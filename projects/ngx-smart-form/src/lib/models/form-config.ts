import { Type } from '@angular/core';

import { SmartFormCondition } from './condition-config';
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

/** Common properties shared by leaf field configurations. */
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
  /** Show the field only when the condition passes. */
  when?: SmartFormCondition;
  /** Enable the field only when the condition passes. */
  enabledWhen?: SmartFormCondition;
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
  min?: number;
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

/** Nested group of fields rendered as a child FormGroup. */
export interface SmartFormGroupFieldConfig {
  type: 'group';
  label?: string;
  hint?: string;
  hidden?: boolean;
  cssClass?: string;
  when?: SmartFormCondition;
  enabledWhen?: SmartFormCondition;
  fields: SmartFormFieldsConfig;
}

/** Leaf field types that can be used as FormArray items. */
export type SmartFormArrayItemConfig = Exclude<
  SmartFormLeafFieldConfig,
  SmartFormFileFieldConfig
>;

/** Repeatable array of fields rendered as a FormArray. */
export interface SmartFormArrayFieldConfig {
  type: 'array';
  label?: string;
  hint?: string;
  hidden?: boolean;
  cssClass?: string;
  when?: SmartFormCondition;
  enabledWhen?: SmartFormCondition;
  item: SmartFormArrayItemConfig;
  defaultValue?: readonly unknown[];
  minItems?: number;
  maxItems?: number;
}

/** Allows consumers to plug in their own Angular components. */
export interface SmartFormCustomFieldConfig extends SmartFormFieldConfigBase {
  type: 'custom';
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
}

/** Leaf field configuration (controls that map to a single FormControl). */
export type SmartFormLeafFieldConfig =
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

export type SmartFormFieldConfig =
  | SmartFormLeafFieldConfig
  | SmartFormGroupFieldConfig
  | SmartFormArrayFieldConfig;

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
