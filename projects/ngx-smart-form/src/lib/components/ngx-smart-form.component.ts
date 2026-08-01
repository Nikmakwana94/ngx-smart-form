import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SmartFormConfig, SmartFormFieldConfig } from '../models';
import { SmartFormBuilderService } from '../services/smart-form-builder.service';
import { normalizeSmartFormConfig } from '../utils/smart-form-config.utils';
import { SmartFormFieldComponent } from './field-renderer/smart-form-field.component';

export interface SmartFormFieldEntry {
  key: string;
  config: SmartFormFieldConfig;
}

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

          <button type="submit" class="ngx-smart-form-submit">
            Submit
          </button>
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

    .ngx-smart-form-submit:hover {
      background: #1d4ed8;
    }

    .ngx-smart-form-submit:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `,
})
export class NgxSmartFormComponent {
  private readonly builder = inject(SmartFormBuilderService);

  /** Form configuration object. Supports flat or structured `{ fields }` shape. */
  readonly config = input<SmartFormConfig | null>(null);

  /** Emitted when a FormGroup has been built from the current configuration. */
  readonly formReady = output<FormGroup>();

  /** Emitted when the form is submitted and valid. */
  readonly submitted = output<Record<string, unknown>>();

  /** The internally built FormGroup, available after configuration is provided. */
  readonly formGroup = signal<FormGroup | null>(null);

  /** Normalized field entries derived from the current configuration. */
  readonly fieldEntries = signal<SmartFormFieldEntry[]>([]);

  /** Tracks whether a submit has been attempted to reveal validation errors. */
  readonly submitAttempted = signal(false);

  constructor() {
    effect(() => {
      const config = this.config();

      if (!config) {
        this.formGroup.set(null);
        this.fieldEntries.set([]);
        this.submitAttempted.set(false);
        return;
      }

      const normalized = normalizeSmartFormConfig(config);
      this.fieldEntries.set(
        Object.entries(normalized.fields).map(([key, fieldConfig]) => ({
          key,
          config: fieldConfig,
        })),
      );

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
