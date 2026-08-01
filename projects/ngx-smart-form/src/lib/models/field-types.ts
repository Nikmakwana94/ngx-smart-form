/**
 * Supported field types for ngx-smart-form.
 * Custom field types can be registered via SmartFormCustomFieldConfig.
 */
export type SmartFormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'date-range'
  | 'file'
  | 'autocomplete'
  | 'custom';

/** Option model for select, radio, and other option-based fields. */
export interface SmartFormOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** @deprecated Use {@link SmartFormOption} instead. */
export type SmartFormSelectOption<T = unknown> = SmartFormOption<T>;

/** Date range value model for date-range fields. */
export interface SmartFormDateRangeValue {
  start: Date | string | null;
  end: Date | string | null;
}
