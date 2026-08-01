import { Type } from '@angular/core';

import {
  SmartFormDateRangeValue,
  SmartFormFieldType,
  SmartFormOption,
} from './field-types';
import { SmartFormFieldValidation } from './validation-config';

/** When the form or individual controls emit value updates. */
export type SmartFormUpdateOn = 'change' | 'blur' | 'submit';

/** Submit button configuration for structured forms. */
export interface SmartFormSubmitConfig {
  label?: string;
  visible?: boolean;
}

/** Common properties shared by all field configurations. */
export interface SmartFormFieldConfigBase {
  type: SmartFormFieldType;
  label?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
  /** Shorthand for `validation.required`. */
  required?: boolean;
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
  /** Shorthand for `validation.min`. */
  min?: number;
  /** Shorthand for `validation.max`. */
  max?: number;
}

export interface SmartFormSelectFieldConfig extends SmartFormFieldConfigBase {
  type: 'select';
  options: SmartFormOption[];
  defaultValue?: unknown;
}

export interface SmartFormRadioFieldConfig extends SmartFormFieldConfigBase {
  type: 'radio';
  options: SmartFormOption[];
  defaultValue?: unknown;
}

export interface SmartFormMultiSelectFieldConfig extends SmartFormFieldConfigBase {
  type: 'multi-select' | 'autocomplete';
  options: SmartFormOption[];
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
  | SmartFormRadioFieldConfig
  | SmartFormMultiSelectFieldConfig
  | SmartFormCheckboxFieldConfig
  | SmartFormDateFieldConfig
  | SmartFormDateRangeFieldConfig
  | SmartFormFileFieldConfig
  | SmartFormCustomFieldConfig;

/** Field map keyed by control name. */
export type SmartFormFieldsConfig = Record<string, SmartFormFieldConfig>;

/** Structured form configuration with optional form-level options. */
export interface SmartFormStructuredConfig {
  fields: SmartFormFieldsConfig;
  updateOn?: SmartFormUpdateOn;
  submit?: SmartFormSubmitConfig;
}

/**
 * Top-level form configuration.
 * Accepts either a flat field map or a structured object with `fields`.
 */
export type SmartFormConfig = SmartFormFieldsConfig | SmartFormStructuredConfig;
