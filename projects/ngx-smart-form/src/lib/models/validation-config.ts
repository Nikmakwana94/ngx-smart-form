import { AsyncValidatorFn, ValidatorFn } from '@angular/forms';

/** Custom validation error messages keyed by validator name. */
export interface SmartFormValidationMessages {
  required?: string;
  min?: string;
  max?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string;
  email?: string;
  [key: string]: string | undefined;
}

/** Declarative validation rules for a form field. */
export interface SmartFormFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  email?: boolean;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  messages?: SmartFormValidationMessages;
}
