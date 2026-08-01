import { ValidatorFn, Validators } from '@angular/forms';

import { SmartFormFieldType } from '../models/field-types';
import { SmartFormFieldValidation } from '../models/validation-config';

/**
 * Maps declarative validation configuration to Angular ValidatorFn instances.
 * Custom validators from the config are appended when provided.
 */
export function buildValidators(
  validation: SmartFormFieldValidation,
  fieldType: SmartFormFieldType,
): ValidatorFn[] {
  const validators: ValidatorFn[] = [];

  if (validation.required) {
    if (fieldType === 'checkbox') {
      validators.push(Validators.requiredTrue);
    } else {
      validators.push(Validators.required);
    }
  }

  if (validation.min !== undefined) {
    validators.push(Validators.min(validation.min));
  }

  if (validation.max !== undefined) {
    validators.push(Validators.max(validation.max));
  }

  if (validation.minLength !== undefined) {
    validators.push(Validators.minLength(validation.minLength));
  }

  if (validation.maxLength !== undefined) {
    validators.push(Validators.maxLength(validation.maxLength));
  }

  if (validation.pattern !== undefined) {
    validators.push(Validators.pattern(validation.pattern));
  }

  const shouldApplyEmailValidator =
    validation.email === true || (validation.email === undefined && fieldType === 'email');

  if (shouldApplyEmailValidator && fieldType !== 'number') {
    validators.push(Validators.email);
  }

  if (validation.validators?.length) {
    validators.push(...validation.validators);
  }

  return validators;
}
