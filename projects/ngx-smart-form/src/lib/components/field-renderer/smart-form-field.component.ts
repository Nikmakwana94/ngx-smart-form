import {
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { merge } from 'rxjs';

import {
  SmartFormFieldConfig,
  SmartFormNumberFieldConfig,
  SmartFormRadioFieldConfig,
  SmartFormSelectFieldConfig,
  SmartFormTextFieldConfig,
} from '../../models/form-config';
import { SmartFormOption } from '../../models/field-types';
import { resolveFieldValidation } from '../../utils/smart-form-config.utils';
import { formatDateForInput } from '../../utils/smart-form-date.utils';
import {
  resolveValidationMessage,
  shouldShowFieldError,
} from '../../utils/smart-form-validation-message.utils';
import { isRenderableFieldType } from './field-type.registry';

@Component({
  selector: 'ngx-smart-form-field',
  imports: [ReactiveFormsModule],
  template: `
    @if (isVisible()) {
      <div [class]="fieldCssClass()">
        @switch (fieldConfig().type) {
          @case ('checkbox') {
            <div class="ngx-smart-form-checkbox">
              <input
                class="ngx-smart-form-control ngx-smart-form-control--checkbox"
                [id]="fieldId()"
                type="checkbox"
                [formControl]="control()"
                [attr.aria-invalid]="showError() ? true : null"
                [attr.aria-describedby]="describedBy()"
              />
              @if (fieldConfig().label) {
                <label
                  [attr.for]="fieldId()"
                  class="ngx-smart-form-label ngx-smart-form-label--checkbox"
                >
                  {{ fieldConfig().label }}
                </label>
              }
            </div>
          }
          @case ('radio') {
            @if (fieldConfig().label) {
              <span [id]="groupLabelId()" class="ngx-smart-form-label">
                {{ fieldConfig().label }}
              </span>
            }
            <div
              class="ngx-smart-form-radio-group"
              role="radiogroup"
              [attr.aria-labelledby]="fieldConfig().label ? groupLabelId() : null"
              [attr.aria-describedby]="describedBy()"
              [attr.aria-invalid]="showError() ? true : null"
            >
              @for (option of radioOptions(); track optionTrack($index, option)) {
                <div class="ngx-smart-form-radio-option">
                  <input
                    class="ngx-smart-form-control ngx-smart-form-control--radio"
                    [id]="radioOptionId($index)"
                    type="radio"
                    [formControl]="control()"
                    [value]="optionValue(option)"
                    [attr.disabled]="option.disabled ? true : null"
                  />
                  <label
                    [attr.for]="radioOptionId($index)"
                    class="ngx-smart-form-label ngx-smart-form-label--radio"
                  >
                    {{ option.label }}
                  </label>
                </div>
              }
            </div>
          }
          @default {
            @if (fieldConfig().label) {
              <label [attr.for]="fieldId()" class="ngx-smart-form-label">
                {{ fieldConfig().label }}
              </label>
            }

            @switch (fieldConfig().type) {
              @case ('text') {
                <input
                  class="ngx-smart-form-control"
                  [id]="fieldId()"
                  type="text"
                  [formControl]="control()"
                  [placeholder]="fieldConfig().placeholder ?? ''"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                />
              }
              @case ('email') {
                <input
                  class="ngx-smart-form-control"
                  [id]="fieldId()"
                  type="email"
                  [formControl]="control()"
                  [placeholder]="fieldConfig().placeholder ?? ''"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                />
              }
              @case ('password') {
                <input
                  class="ngx-smart-form-control"
                  [id]="fieldId()"
                  type="password"
                  [formControl]="control()"
                  [placeholder]="fieldConfig().placeholder ?? ''"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                />
              }
              @case ('number') {
                <input
                  class="ngx-smart-form-control"
                  [id]="fieldId()"
                  type="number"
                  [formControl]="control()"
                  [placeholder]="fieldConfig().placeholder ?? ''"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.min]="numberMin()"
                  [attr.max]="numberMax()"
                  [attr.step]="numberStep()"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                />
              }
              @case ('textarea') {
                <textarea
                  class="ngx-smart-form-control ngx-smart-form-control--textarea"
                  [id]="fieldId()"
                  [formControl]="control()"
                  [placeholder]="fieldConfig().placeholder ?? ''"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.rows]="textareaRows()"
                  [attr.aria-describedby]="describedBy()"
                  [attr.aria-invalid]="showError() ? true : null"
                ></textarea>
              }
              @case ('select') {
                <select
                  class="ngx-smart-form-control ngx-smart-form-control--select"
                  [id]="fieldId()"
                  [formControl]="control()"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                >
                  @if (fieldConfig().placeholder) {
                    <option [ngValue]="null">{{ fieldConfig().placeholder }}</option>
                  }
                  @for (option of selectOptions(); track optionTrack($index, option)) {
                    <option
                      [ngValue]="option.value"
                      [disabled]="option.disabled === true"
                    >
                      {{ option.label }}
                    </option>
                  }
                </select>
              }
              @case ('date') {
                <input
                  class="ngx-smart-form-control"
                  [id]="fieldId()"
                  type="date"
                  [formControl]="control()"
                  [readonly]="fieldConfig().readonly === true"
                  [attr.min]="dateMin()"
                  [attr.max]="dateMax()"
                  [attr.aria-invalid]="showError() ? true : null"
                  [attr.aria-describedby]="describedBy()"
                />
              }
            }
          }
        }

        @if (fieldConfig().hint) {
          <small [id]="hintId()" class="ngx-smart-form-hint">
            {{ fieldConfig().hint }}
          </small>
        }

        @if (showError() && errorMessage()) {
          <div [id]="errorId()" class="ngx-smart-form-error" role="alert">
            {{ errorMessage() }}
          </div>
        }
      </div>
    }
  `,
  styles: `
    .ngx-smart-form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-block-end: 1rem;
    }

    .ngx-smart-form-label {
      font-weight: 600;
    }

    .ngx-smart-form-control {
      box-sizing: border-box;
      width: 100%;
      padding: 0.5rem 0.625rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      font: inherit;
      line-height: 1.4;
    }

    .ngx-smart-form-control:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 1px;
      border-color: #3b82f6;
    }

    .ngx-smart-form-control--textarea {
      min-height: 5rem;
      resize: vertical;
    }

    .ngx-smart-form-control--checkbox,
    .ngx-smart-form-control--radio {
      width: auto;
      margin: 0;
    }

    .ngx-smart-form-checkbox,
    .ngx-smart-form-radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .ngx-smart-form-radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ngx-smart-form-label--checkbox,
    .ngx-smart-form-label--radio {
      font-weight: 500;
    }

    .ngx-smart-form-field--invalid .ngx-smart-form-control:not(.ngx-smart-form-control--checkbox):not(.ngx-smart-form-control--radio) {
      border-color: #dc2626;
    }

    .ngx-smart-form-hint {
      color: #64748b;
      font-size: 0.875rem;
    }

    .ngx-smart-form-error {
      color: #dc2626;
      font-size: 0.875rem;
    }
  `,
})
export class SmartFormFieldComponent {
  readonly fieldKey = input.required<string>();
  readonly fieldConfig = input.required<SmartFormFieldConfig>();
  readonly control = input.required<FormControl>();
  readonly submitAttempted = input<boolean>(false);

  private readonly controlRevision = signal(0);

  constructor() {
    effect((onCleanup) => {
      const control = this.control();
      const subscription = merge(
        control.statusChanges,
        control.valueChanges,
        control.events,
      ).subscribe(() => {
        this.controlRevision.update((value) => value + 1);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  readonly fieldId = computed(() => `ngx-smart-form-${this.fieldKey()}`);
  readonly groupLabelId = computed(() => `${this.fieldId()}-label`);
  readonly hintId = computed(() => `${this.fieldId()}-hint`);
  readonly errorId = computed(() => `${this.fieldId()}-error`);

  readonly isVisible = computed(
    () =>
      !this.fieldConfig().hidden &&
      isRenderableFieldType(this.fieldConfig().type),
  );

  readonly fieldCssClass = computed(() => {
    const classes = ['ngx-smart-form-field'];

    if (this.showError()) {
      classes.push('ngx-smart-form-field--invalid');
    }

    const customClass = this.fieldConfig().cssClass;

    if (customClass) {
      classes.push(customClass);
    }

    if (this.fieldConfig().type === 'checkbox') {
      classes.push('ngx-smart-form-field--checkbox');
    }

    if (this.fieldConfig().type === 'radio') {
      classes.push('ngx-smart-form-field--radio');
    }

    return classes.join(' ');
  });

  readonly showError = computed(() => {
    this.controlRevision();
    return shouldShowFieldError(
      this.control().invalid,
      this.control().touched,
      this.submitAttempted(),
    );
  });

  readonly errorMessage = computed(() => {
    this.controlRevision();
    return resolveValidationMessage(
      this.control().errors,
      resolveFieldValidation(this.fieldConfig()).messages,
    );
  });

  readonly describedBy = computed(() => {
    const ids: string[] = [];

    if (this.fieldConfig().hint) {
      ids.push(this.hintId());
    }

    if (this.showError() && this.errorMessage()) {
      ids.push(this.errorId());
    }

    return ids.length > 0 ? ids.join(' ') : null;
  });

  readonly selectOptions = computed((): SmartFormOption[] => {
    const field = this.fieldConfig();
    return field.type === 'select'
      ? (field as SmartFormSelectFieldConfig).options
      : [];
  });

  readonly radioOptions = computed((): SmartFormOption[] => {
    const field = this.fieldConfig();
    return field.type === 'radio'
      ? (field as SmartFormRadioFieldConfig).options
      : [];
  });

  readonly numberMin = computed(() => {
    const field = this.fieldConfig();
    if (field.type !== 'number') {
      return null;
    }

    const validation = resolveFieldValidation(field);
    return validation.min ?? (field as SmartFormNumberFieldConfig).min ?? null;
  });

  readonly numberMax = computed(() => {
    const field = this.fieldConfig();
    if (field.type !== 'number') {
      return null;
    }

    const validation = resolveFieldValidation(field);
    return validation.max ?? (field as SmartFormNumberFieldConfig).max ?? null;
  });

  readonly numberStep = computed(() => {
    const field = this.fieldConfig();
    return field.type === 'number'
      ? (field as SmartFormNumberFieldConfig).step ?? null
      : null;
  });

  readonly textareaRows = computed(() => {
    const field = this.fieldConfig();
    return field.type === 'textarea'
      ? (field as SmartFormTextFieldConfig).rows ?? null
      : null;
  });

  readonly dateMin = computed(() => {
    const field = this.fieldConfig();
    return field.type === 'date' ? formatDateForInput(field.min) : null;
  });

  readonly dateMax = computed(() => {
    const field = this.fieldConfig();
    return field.type === 'date' ? formatDateForInput(field.max) : null;
  });

  radioOptionId(index: number): string {
    return `${this.fieldId()}-${index}`;
  }

  optionTrack(index: number, option: SmartFormOption): string {
    return `${index}-${String(option.value)}`;
  }

  optionValue(option: SmartFormOption): string {
    return String(option.value);
  }
}
