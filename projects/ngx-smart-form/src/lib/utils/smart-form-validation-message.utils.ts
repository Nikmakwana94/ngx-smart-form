import { ValidationErrors } from '@angular/forms';

import { SmartFormValidationMessages } from '../models/validation-config';

const MESSAGE_KEY_ALIASES: Record<string, keyof SmartFormValidationMessages> = {
  minlength: 'minLength',
  maxlength: 'maxLength',
};

function resolveCustomMessage(
  errorKey: string,
  messages?: SmartFormValidationMessages,
): string | undefined {
  if (!messages) {
    return undefined;
  }

  const aliasKey = MESSAGE_KEY_ALIASES[errorKey];
  const direct = messages[errorKey];
  const aliased = aliasKey ? messages[aliasKey] : undefined;

  return direct ?? aliased;
}

function resolveDefaultMessage(
  errorKey: string,
  errorValue: unknown,
): string {
  switch (errorKey) {
    case 'required':
      return 'This field is required.';
    case 'min':
      return `Value must be at least ${(errorValue as { min: number }).min}.`;
    case 'max':
      return `Value must be at most ${(errorValue as { max: number }).max}.`;
    case 'minlength':
      return `Minimum length is ${(errorValue as { requiredLength: number }).requiredLength}.`;
    case 'maxlength':
      return `Maximum length is ${(errorValue as { requiredLength: number }).requiredLength}.`;
    case 'email':
      return 'Please enter a valid email address.';
    case 'pattern':
      return 'Please enter a valid value.';
    default:
      return 'Please enter a valid value.';
  }
}

/** Resolves the first applicable validation message for a control error set. */
export function resolveValidationMessage(
  errors: ValidationErrors | null,
  messages?: SmartFormValidationMessages,
): string | null {
  if (!errors) {
    return null;
  }

  const errorKey = Object.keys(errors)[0];

  if (!errorKey) {
    return null;
  }

  return (
    resolveCustomMessage(errorKey, messages) ??
    resolveDefaultMessage(errorKey, errors[errorKey])
  );
}

/** Whether validation errors should be displayed for a control. */
export function shouldShowFieldError(
  invalid: boolean,
  touched: boolean,
  submitAttempted: boolean,
): boolean {
  return invalid && (touched || submitAttempted);
}
