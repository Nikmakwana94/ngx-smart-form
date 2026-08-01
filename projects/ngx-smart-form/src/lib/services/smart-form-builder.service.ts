import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SmartFormConfigError } from '../errors/smart-form-config.error';
import { SmartFormConfig, SmartFormFieldConfig } from '../models/form-config';
import {
  normalizeSmartFormConfig,
  resolveDefaultValue,
  resolveFieldValidation,
} from '../utils/smart-form-config.utils';
import { buildValidators } from '../validators/smart-form-validators';

@Injectable({
  providedIn: 'root',
})
export class SmartFormBuilderService {
  /**
   * Builds an Angular FormGroup from a declarative SmartFormConfig.
   * The original configuration object is never mutated.
   */
  buildForm(config: SmartFormConfig): FormGroup {
    const normalized = normalizeSmartFormConfig(config);
    const controls: Record<string, FormControl> = {};

    for (const [fieldName, fieldConfig] of Object.entries(normalized.fields)) {
      controls[fieldName] = this.createControl(fieldName, fieldConfig);
    }

    return new FormGroup(controls, normalized.updateOn ? { updateOn: normalized.updateOn } : undefined);
  }

  private createControl(
    fieldName: string,
    field: SmartFormFieldConfig,
  ): FormControl {
    if (!field?.type) {
      throw new SmartFormConfigError(
        `Field "${fieldName}" is missing a required "type" property.`,
      );
    }

    const initialValue = resolveDefaultValue(field);
    const validation = resolveFieldValidation(field);
    const validators = buildValidators(validation, field.type);

    return new FormControl(
      {
        value: initialValue,
        disabled: field.disabled === true,
      },
      validators.length > 0 ? validators : undefined,
    );
  }
}
