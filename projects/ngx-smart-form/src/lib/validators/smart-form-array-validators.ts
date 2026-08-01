import { ValidatorFn } from '@angular/forms';

/** Validates that a FormArray has at least the configured number of items. */
export function minArrayLength(min: number): ValidatorFn {
  return (control) => {
    const length = control.value?.length ?? 0;
    return length >= min
      ? null
      : { minArrayLength: { requiredLength: min, actualLength: length } };
  };
}

/** Validates that a FormArray has at most the configured number of items. */
export function maxArrayLength(max: number): ValidatorFn {
  return (control) => {
    const length = control.value?.length ?? 0;
    return length <= max
      ? null
      : { maxArrayLength: { requiredLength: max, actualLength: length } };
  };
}
