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

/** Option model for select, multi-select, radio, and autocomplete fields. */
export interface SmartFormSelectOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** Date range value model for date-range fields. */
export interface SmartFormDateRangeValue {
  start: Date | string | null;
  end: Date | string | null;
}
