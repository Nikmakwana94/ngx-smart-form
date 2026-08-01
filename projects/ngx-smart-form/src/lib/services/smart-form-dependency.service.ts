import { Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { merge, Subscription } from 'rxjs';

import { SmartFormCondition } from '../models/condition-config';
import {
  SmartFormArrayFieldConfig,
  SmartFormFieldConfig,
  SmartFormFieldsConfig,
  SmartFormGroupFieldConfig,
} from '../models/form-config';
import {
  collectConditionSourceFields,
  evaluateCondition,
} from '../utils/smart-form-condition.utils';
import {
  joinFieldPath,
  resolveControlByPath,
} from '../utils/smart-form-path.utils';

export interface FieldDependencyState {
  visible: boolean;
  enabled: boolean;
}

interface DependencyTarget {
  path: string;
  config: SmartFormFieldConfig | SmartFormGroupFieldConfig | SmartFormArrayFieldConfig;
  staticDisabled: boolean;
}

type ConditionFieldConfig = {
  when?: SmartFormCondition;
  enabledWhen?: SmartFormCondition;
  hidden?: boolean;
  type?: string;
  fields?: SmartFormFieldsConfig;
};

@Injectable()
export class SmartFormDependencyService {
  private readonly stateMap = new Map<string, FieldDependencyState>();
  private subscriptions: Subscription[] = [];

  /** Bumped whenever dependency states are recalculated. */
  readonly revision = signal(0);

  getState(path: string): FieldDependencyState {
    return this.stateMap.get(path) ?? { visible: true, enabled: true };
  }

  isVisible(path: string): boolean {
    return this.getState(path).visible;
  }

  connect(form: FormGroup, fields: SmartFormFieldsConfig): () => void {
    this.disconnect();

    const targets = this.collectTargets(fields);
    const sourceFields = collectConditionSourceFields(
      fields as Record<string, ConditionFieldConfig>,
    );

    const applyAll = (): void => {
      for (const target of targets) {
        const state = this.evaluateTarget(form, target);
        this.stateMap.set(target.path, state);
        this.applyControlState(form, target.path, state, target.staticDisabled);
      }

      this.revision.update((value) => value + 1);
    };

    applyAll();

    for (const sourcePath of sourceFields) {
      const sourceControl = resolveControlByPath(form, sourcePath);

      if (!sourceControl) {
        continue;
      }

      this.subscriptions.push(
        merge(sourceControl.valueChanges, sourceControl.statusChanges).subscribe(
          () => applyAll(),
        ),
      );
    }

    return () => this.disconnect();
  }

  disconnect(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions = [];
    this.stateMap.clear();
  }

  private evaluateTarget(
    form: FormGroup,
    target: DependencyTarget,
  ): FieldDependencyState {
    const config = target.config;
    let visible = !config.hidden;

    if (config.when) {
      visible = visible && evaluateCondition(config.when, form);
    }

    let enabled = visible;

    if (visible && config.enabledWhen) {
      enabled = evaluateCondition(config.enabledWhen, form);
    }

    if (!visible) {
      enabled = false;
    }

    return { visible, enabled };
  }

  private applyControlState(
    form: FormGroup,
    path: string,
    state: FieldDependencyState,
    staticDisabled: boolean,
  ): void {
    const control = resolveControlByPath(form, path);

    if (!control) {
      return;
    }

    const shouldDisable = staticDisabled || !state.enabled;

    if (shouldDisable && control.enabled) {
      control.disable({ emitEvent: false });
    } else if (!shouldDisable && control.disabled && !staticDisabled) {
      control.enable({ emitEvent: false });
    }
  }

  private collectTargets(
    fields: SmartFormFieldsConfig,
    parentPath = '',
  ): DependencyTarget[] {
    const targets: DependencyTarget[] = [];

    for (const [key, config] of Object.entries(fields)) {
      const path = joinFieldPath(parentPath, key);
      targets.push({
        path,
        config,
        staticDisabled: 'disabled' in config && config.disabled === true,
      });

      if (config.type === 'group') {
        targets.push(...this.collectTargets(config.fields, path));
      }
    }

    return targets;
  }
}
