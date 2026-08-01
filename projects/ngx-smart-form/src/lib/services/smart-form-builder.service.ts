import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { SmartFormConfigError } from '../errors/smart-form-config.error';
import {
  SmartFormArrayFieldConfig,
  SmartFormConfig,
  SmartFormFieldConfig,
  SmartFormFieldsConfig,
  SmartFormLeafFieldConfig,
} from '../models/form-config';
import {
  normalizeSmartFormConfig,
  resolveDefaultValue,
  resolveFieldValidation,
} from '../utils/smart-form-config.utils';
import {
  maxArrayLength,
  minArrayLength,
} from '../validators/smart-form-array-validators';
import { buildAsyncValidators, buildValidators } from '../validators/smart-form-validators';

@Injectable({
  providedIn: 'root',
})
export class SmartFormBuilderService {
  buildForm(config: SmartFormConfig): FormGroup {
    const normalized = normalizeSmartFormConfig(config);
    return this.buildGroup(normalized.fields, normalized.updateOn);
  }

  buildArrayItemControl(
    item: SmartFormLeafFieldConfig,
    value?: unknown,
  ): FormControl {
    const itemConfig =
      value !== undefined
        ? ({ ...item, defaultValue: value } as SmartFormLeafFieldConfig)
        : item;

    return this.createLeafControl('item', itemConfig);
  }

  private buildGroup(
    fields: SmartFormFieldsConfig,
    updateOn?: 'change' | 'blur' | 'submit',
  ): FormGroup {
    const controls: Record<string, AbstractControl> = {};

    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
      controls[fieldName] = this.buildField(fieldName, fieldConfig);
    }

    return new FormGroup(
      controls,
      updateOn ? { updateOn } : undefined,
    );
  }

  private buildField(
    fieldName: string,
    field: SmartFormFieldConfig,
  ): AbstractControl {
    if (!field?.type) {
      throw new SmartFormConfigError(
        `Field "${fieldName}" is missing a required "type" property.`,
      );
    }

    switch (field.type) {
      case 'group':
        return this.buildGroup(field.fields);
      case 'array':
        return this.buildArray(field);
      default:
        return this.createLeafControl(fieldName, field);
    }
  }

  private buildArray(field: SmartFormArrayFieldConfig): FormArray {
    const initialValues = field.defaultValue ?? [];
    const controls = initialValues.map((value) =>
      this.buildArrayItemControl(field.item, value),
    );
    const validators = [];

    if (field.minItems !== undefined) {
      validators.push(minArrayLength(field.minItems));
    }

    if (field.maxItems !== undefined) {
      validators.push(maxArrayLength(field.maxItems));
    }

    return new FormArray(
      controls,
      validators.length > 0 ? validators : undefined,
    );
  }

  private createLeafControl(
    fieldName: string,
    field: SmartFormLeafFieldConfig,
  ): FormControl {
    const initialValue = resolveDefaultValue(field);
    const validation = resolveFieldValidation(field);
    const validators = buildValidators(validation, field.type);
    const asyncValidators = buildAsyncValidators(validation);

    return new FormControl(
      {
        value: initialValue,
        disabled: field.disabled === true,
      },
      {
        validators: validators.length > 0 ? validators : undefined,
        asyncValidators:
          asyncValidators.length > 0 ? asyncValidators : undefined,
      },
    );
  }
}
