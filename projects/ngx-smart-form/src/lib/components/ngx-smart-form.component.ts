import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  SmartFormConfig,
  SmartFormFieldConfig,
  SmartFormSubmitConfig,
} from '../models';
import { SmartFormBuilderService } from '../services/smart-form-builder.service';
import { SmartFormDependencyService } from '../services/smart-form-dependency.service';
import { normalizeSmartFormConfig } from '../utils/smart-form-config.utils';
import { SmartFormFieldHostComponent } from './field-renderer/smart-form-field-host.component';

export interface SmartFormFieldEntry {
  key: string;
  path: string;
  config: SmartFormFieldConfig;
}

const DEFAULT_SUBMIT_CONFIG: SmartFormSubmitConfig = {
  label: 'Submit',
  visible: true,
};

@Component({
  selector: 'ngx-smart-form',
  imports: [ReactiveFormsModule, SmartFormFieldHostComponent],
  providers: [SmartFormDependencyService],
  template: `
    <div class="ngx-smart-form" data-testid="ngx-smart-form">
      @if (formGroup(); as form) {
        <form
          [formGroup]="form"
          class="ngx-smart-form__form"
          (ngSubmit)="onSubmit()"
          novalidate
        >
          @for (field of fieldEntries(); track field.path) {
            <ngx-smart-form-field-host
              [rootForm]="form"
              [formGroup]="form"
              [fieldKey]="field.key"
              [fieldPath]="field.path"
              [fieldConfig]="field.config"
              [submitAttempted]="submitAttempted()"
            />
          }

          @if (submitConfig().visible !== false) {
            <button
              type="submit"
              class="ngx-smart-form-submit"
              [disabled]="form.invalid"
            >
              {{ submitConfig().label ?? 'Submit' }}
            </button>
          }
        </form>
      }
    </div>
  `,
  styles: `
    .ngx-smart-form__form {
      display: block;
    }

    .ngx-smart-form-submit {
      padding: 0.5rem 1rem;
      border: 1px solid #2563eb;
      border-radius: 0.375rem;
      background: #2563eb;
      color: #ffffff;
      font: inherit;
      cursor: pointer;
    }

    .ngx-smart-form-submit:hover:not(:disabled) {
      background: #1d4ed8;
    }

    .ngx-smart-form-submit:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    .ngx-smart-form-submit:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `,
})
export class NgxSmartFormComponent {
  private readonly builder = inject(SmartFormBuilderService);
  private readonly dependencyService = inject(SmartFormDependencyService);
  private dependencyCleanup: (() => void) | null = null;

  readonly config = input<SmartFormConfig | null>(null);
  readonly formReady = output<FormGroup>();
  readonly submitted = output<Record<string, unknown>>();

  readonly formGroup = signal<FormGroup | null>(null);
  readonly fieldEntries = signal<SmartFormFieldEntry[]>([]);
  readonly submitAttempted = signal(false);
  readonly submitConfig = signal<SmartFormSubmitConfig>(DEFAULT_SUBMIT_CONFIG);

  constructor() {
    effect((onCleanup) => {
      const config = this.config();

      if (!config) {
        this.formGroup.set(null);
        this.fieldEntries.set([]);
        this.submitAttempted.set(false);
        this.submitConfig.set(DEFAULT_SUBMIT_CONFIG);
        this.dependencyCleanup?.();
        this.dependencyCleanup = null;
        return;
      }

      const normalized = normalizeSmartFormConfig(config);
      this.fieldEntries.set(
        Object.entries(normalized.fields).map(([key, fieldConfig]) => ({
          key,
          path: key,
          config: fieldConfig,
        })),
      );
      this.submitConfig.set({
        ...DEFAULT_SUBMIT_CONFIG,
        ...normalized.submit,
      });

      const form = this.builder.buildForm(config);
      this.formGroup.set(form);
      this.submitAttempted.set(false);
      this.formReady.emit(form);

      this.dependencyCleanup?.();
      this.dependencyCleanup = this.dependencyService.connect(
        form,
        normalized.fields,
      );

      onCleanup(() => {
        this.dependencyCleanup?.();
        this.dependencyCleanup = null;
        this.dependencyService.disconnect();
      });
    });
  }

  onSubmit(): void {
    const form = this.formGroup();

    if (!form) {
      return;
    }

    this.submitAttempted.set(true);

    if (form.valid) {
      this.submitted.emit(form.getRawValue());
      return;
    }

    form.markAllAsTouched();
  }
}
