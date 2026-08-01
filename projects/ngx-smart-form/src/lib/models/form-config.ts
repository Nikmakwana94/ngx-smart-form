import { Type } from '@angular/core';

import {
  SmartFormDateRangeValue,
  SmartFormFieldType,
  SmartFormSelectOption,
} from './field-types';
import { SmartFormFieldValidation } from './validation-config';

/** Common properties shared by all field configurations. */
export interface SmartFormFieldConfigBase {
  type: SmartFormFieldType;
  label?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  validation?: SmartFormFieldValidation;
  cssClass?: string;
}

export interface SmartFormTextFieldConfig extends SmartFormFieldConfigBase {
  type: 'text' | 'email' | 'password' | 'textarea';
  defaultValue?: string;
  rows?: number;
}

export interface SmartFormNumberFieldConfig extends SmartFormFieldConfigBase {
  type: 'number';
  defaultValue?: number;
  step?: number;
}

export interface SmartFormSelectFieldConfig extends SmartFormFieldConfigBase {
  type: 'select' | 'multi-select' | 'radio' | 'autocomplete';
  options: SmartFormSelectOption[];
  defaultValue?: unknown;
}

export interface SmartFormCheckboxFieldConfig extends SmartFormFieldConfigBase {
  type: 'checkbox';
  defaultValue?: boolean;
}

export interface SmartFormDateFieldConfig extends SmartFormFieldConfigBase {
  type: 'date';
  defaultValue?: Date | string | null;
  min?: Date | string;
  max?: Date | string;
}

export interface SmartFormDateRangeFieldConfig extends SmartFormFieldConfigBase {
  type: 'date-range';
  defaultValue?: SmartFormDateRangeValue;
  min?: Date | string;
  max?: Date | string;
}

export interface SmartFormFileFieldConfig extends SmartFormFieldConfigBase {
  type: 'file';
  accept?: string;
  multiple?: boolean;
}

/** Allows consumers to plug in their own Angular components. */
export interface SmartFormCustomFieldConfig extends SmartFormFieldConfigBase {
  type: 'custom';
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
}

export type SmartFormFieldConfig =
  | SmartFormTextFieldConfig
  | SmartFormNumberFieldConfig
  | SmartFormSelectFieldConfig
  | SmartFormCheckboxFieldConfig
  | SmartFormDateFieldConfig
  | SmartFormDateRangeFieldConfig
  | SmartFormFileFieldConfig
  | SmartFormCustomFieldConfig;

/** Top-level form configuration keyed by control name. */
export type SmartFormConfig = Record<string, SmartFormFieldConfig>;
