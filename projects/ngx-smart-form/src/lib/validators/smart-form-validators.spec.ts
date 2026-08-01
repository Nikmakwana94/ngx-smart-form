import { ValidatorFn, Validators } from '@angular/forms';

import { SmartFormFieldValidation } from '../models/validation-config';
import { buildValidators } from './smart-form-validators';

describe('buildValidators', () => {
  it('should map all supported declarative rules to Angular validators', () => {
    const validation: SmartFormFieldValidation = {
      required: true,
      min: 1,
      max: 10,
      minLength: 2,
      maxLength: 5,
      pattern: '^a+$',
      email: true,
    };

    const validators = buildValidators(validation, 'text');

    expect(validators.length).toBe(7);
    expect(validators).toContain(Validators.required);
    expect(validators).toContain(Validators.email);
  });

  it('should auto-apply email validator for email field types', () => {
    const validators = buildValidators({}, 'email');

    expect(validators).toContain(Validators.email);
  });

  it('should not auto-apply email validator when explicitly disabled', () => {
    const validators = buildValidators({ email: false }, 'email');

    expect(validators).not.toContain(Validators.email);
  });

  it('should include custom validators when provided', () => {
    const custom: ValidatorFn = () => null;
    const validators = buildValidators({ validators: [custom] }, 'text');

    expect(validators).toContain(custom);
  });

  it('should use requiredTrue for checkbox fields', () => {
    const validators = buildValidators({ required: true }, 'checkbox');

    expect(validators).toContain(Validators.requiredTrue);
    expect(validators).not.toContain(Validators.required);
  });
});
