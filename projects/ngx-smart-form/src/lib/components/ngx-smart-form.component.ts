import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  SmartFormConfig,
  SmartFormFieldConfig,
  SmartFormSubmitConfig,
} from '../models';
import { SmartFormBuilderService } from '../services/smart-form-builder.service';
import { normalizeSmartFormConfig } from '../utils/smart-form-config.utils';
import { SmartFormFieldComponent } from './field-renderer/smart-form-field.component';

export interface SmartFormFieldEntry {
  key: string;
  config: SmartFormFieldConfig;
}

const DEFAULT_SUBMIT_CONFIG: SmartFormSubmitConfig = {
  label: 'Submit',
  visible: true,
};

@Component({
  selector: 'ngx-smart-form',
  imports: [ReactiveFormsModule, SmartFormFieldComponent],
  template: `
    <div class="ngx-smart-form" data-testid="ngx-smart-form">
      @if (formGroup(); as form) {
        <form
          [formGroup]="form"
          class="ngx-smart-form__form"
          (ngSubmit)="onSubmit()"
          novalidate
        >
          @for (field of fieldEntries(); track field.key) {
            <ngx-smart-form-field
              [fieldKey]="field.key"
              [fieldConfig]="field.config"
              [control]="getControl(form, field.key)"
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

  readonly config = input<SmartFormConfig | null>(null);
  readonly formReady = output<FormGroup>();
  readonly submitted = output<Record<string, unknown>>();

  readonly formGroup = signal<FormGroup | null>(null);
  readonly fieldEntries = signal<SmartFormFieldEntry[]>([]);
  readonly submitAttempted = signal(false);
  readonly submitConfig = signal<SmartFormSubmitConfig>(DEFAULT_SUBMIT_CONFIG);

  constructor() {
    effect(() => {
      const config = this.config();

      if (!config) {
        this.formGroup.set(null);
        this.fieldEntries.set([]);
        this.submitAttempted.set(false);
        this.submitConfig.set(DEFAULT_SUBMIT_CONFIG);
        return;
      }

      const normalized = normalizeSmartFormConfig(config);
      this.fieldEntries.set(
        Object.entries(normalized.fields).map(([key, fieldConfig]) => ({
          key,
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
    });
  }

  getControl(form: FormGroup, fieldKey: string): FormControl {
    return form.get(fieldKey) as FormControl;
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
