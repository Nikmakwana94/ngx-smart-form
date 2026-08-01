import {
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

import { SmartFormArrayFieldConfig } from '../../models/form-config';
import { SmartFormBuilderService } from '../../services/smart-form-builder.service';
import { fieldPathToId } from '../../utils/smart-form-path.utils';
import { SmartFormFieldComponent } from './smart-form-field.component';

@Component({
  selector: 'ngx-smart-form-array-field',
  imports: [ReactiveFormsModule, SmartFormFieldComponent],
  template: `
    <div [class]="containerClass()">
      @if (fieldConfig().label) {
        <span [id]="labelId()" class="ngx-smart-form-label">{{ fieldConfig().label }}</span>
      }

      <div
        class="ngx-smart-form-array"
        role="group"
        [attr.aria-labelledby]="fieldConfig().label ? labelId() : null"
      >
        @for (control of formArray().controls; track $index; let index = $index) {
          <div class="ngx-smart-form-array-item">
            <ngx-smart-form-field
              [fieldKey]="itemFieldKey(index)"
              [fieldPath]="itemFieldPath(index)"
              [fieldConfig]="itemFieldConfig(index)"
              [control]="asFormControl(control)"
              [submitAttempted]="submitAttempted()"
            />

            <button
              type="button"
              class="ngx-smart-form-array-remove"
              [disabled]="removeDisabled()"
              [attr.aria-label]="removeAriaLabel()"
              (click)="removeItem(index)"
            >
              Remove
            </button>
          </div>
        }

        <button
          type="button"
          class="ngx-smart-form-array-add"
          [disabled]="addDisabled()"
          [attr.aria-label]="addAriaLabel()"
          (click)="addItem()"
        >
          + {{ addLabel() }}
        </button>
      </div>

      @if (fieldConfig().hint) {
        <small class="ngx-smart-form-hint">{{ fieldConfig().hint }}</small>
      }
    </div>
  `,
  styles: `
    .ngx-smart-form-array {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ngx-smart-form-array-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .ngx-smart-form-array-item ngx-smart-form-field {
      flex: 1;
    }

    .ngx-smart-form-array-add,
    .ngx-smart-form-array-remove {
      padding: 0.375rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 0.375rem;
      background: #ffffff;
      font: inherit;
      cursor: pointer;
    }

    .ngx-smart-form-array-add:disabled,
    .ngx-smart-form-array-remove:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `,
})
export class SmartFormArrayFieldComponent {
  private readonly builder = inject(SmartFormBuilderService);

  readonly fieldPath = input.required<string>();
  readonly fieldConfig = input.required<SmartFormArrayFieldConfig>();
  readonly formArray = input.required<FormArray>();
  readonly submitAttempted = input<boolean>(false);

  readonly labelId = computed(() => `ngx-smart-form-${fieldPathToId(this.fieldPath())}-label`);
  readonly containerClass = computed(() => {
    const classes = ['ngx-smart-form-field', 'ngx-smart-form-field--array'];
    const customClass = this.fieldConfig().cssClass;

    if (customClass) {
      classes.push(customClass);
    }

    return classes.join(' ');
  });

  addLabel(): string {
    return this.fieldConfig().item.label ?? 'Add Item';
  }

  addAriaLabel(): string {
    const label = this.fieldConfig().item.label ?? 'item';
    return `Add ${label}`;
  }

  removeAriaLabel(): string {
    const label = this.fieldConfig().item.label ?? 'item';
    return `Remove ${label}`;
  }

  itemFieldKey(index: number): string {
    return `${this.fieldPath()}-${index}`;
  }

  itemFieldPath(index: number): string {
    return `${this.fieldPath()}.${index}`;
  }

  itemFieldConfig(index: number) {
    const item = this.fieldConfig().item;
    return {
      ...item,
      label: item.label ?? `Item ${index + 1}`,
    };
  }

  asFormControl(control: unknown): FormControl {
    return control as FormControl;
  }

  addDisabled(): boolean {
    const maxItems = this.fieldConfig().maxItems;
    return maxItems !== undefined && this.formArray().length >= maxItems;
  }

  removeDisabled(): boolean {
    const minItems = this.fieldConfig().minItems;
    return minItems !== undefined && this.formArray().length <= minItems;
  }

  addItem(): void {
    if (this.addDisabled()) {
      return;
    }

    this.formArray().push(this.builder.buildArrayItemControl(this.fieldConfig().item));
  }

  removeItem(index: number): void {
    if (this.removeDisabled()) {
      return;
    }

    this.formArray().removeAt(index);
  }
}
