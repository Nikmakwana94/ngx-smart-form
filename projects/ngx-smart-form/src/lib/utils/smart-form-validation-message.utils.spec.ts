import { ValidationErrors } from '@angular/forms';

import { SmartFormValidationMessages } from '../models/validation-config';
import {
  resolveValidationMessage,
  shouldShowFieldError,
} from './smart-form-validation-message.utils';

describe('smart-form-validation-message.utils', () => {
  describe('resolveValidationMessage', () => {
    it('should return null when there are no errors', () => {
      expect(resolveValidationMessage(null)).toBeNull();
    });

    it('should return custom required message when configured', () => {
      const messages: SmartFormValidationMessages = {
        required: 'Name is required',
      };

      expect(resolveValidationMessage({ required: true }, messages)).toBe(
        'Name is required',
      );
    });

    it('should map minlength errors to minLength custom messages', () => {
      const messages: SmartFormValidationMessages = {
        minLength: 'Too short',
      };

      expect(
        resolveValidationMessage(
          { minlength: { requiredLength: 3, actualLength: 1 } },
          messages,
        ),
      ).toBe('Too short');
    });

    it('should provide default messages when custom messages are missing', () => {
      expect(resolveValidationMessage({ required: true })).toBe(
        'This field is required.',
      );
      expect(resolveValidationMessage({ min: { min: 18, actual: 10 } })).toBe(
        'Value must be at least 18.',
      );
      expect(
        resolveValidationMessage({ email: true } as ValidationErrors),
      ).toBe('Please enter a valid email address.');
    });

    it('should return custom messages for async validator error keys', () => {
      const messages: SmartFormValidationMessages = {
        usernameTaken: 'This username is already taken.',
      };

      expect(
        resolveValidationMessage({ usernameTaken: true }, messages),
      ).toBe('This username is already taken.');
    });
  });

  describe('shouldShowFieldError', () => {
    it('should show errors when invalid and touched', () => {
      expect(shouldShowFieldError(true, true, false)).toBeTrue();
    });

    it('should show errors when invalid and submit attempted', () => {
      expect(shouldShowFieldError(true, false, true)).toBeTrue();
    });

    it('should not show errors when invalid but untouched and not submitted', () => {
      expect(shouldShowFieldError(true, false, false)).toBeFalse();
    });

    it('should not show errors when valid', () => {
      expect(shouldShowFieldError(false, true, true)).toBeFalse();
    });
  });
});
