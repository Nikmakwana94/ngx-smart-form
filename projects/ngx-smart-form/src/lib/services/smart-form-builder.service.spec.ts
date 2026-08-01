import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

import { SmartFormConfigError } from '../errors/smart-form-config.error';
import { SmartFormConfig } from '../models/form-config';
import { SmartFormBuilderService } from './smart-form-builder.service';

describe('SmartFormBuilderService', () => {
  let service: SmartFormBuilderService;

  beforeEach(() => {
    service = new SmartFormBuilderService();
  });

  describe('basic fields', () => {
    it('should create FormControls for text, email, and number fields', () => {
      const config: SmartFormConfig = {
        name: { type: 'text', label: 'Name' },
        email: { type: 'email', label: 'Email' },
        age: { type: 'number', label: 'Age' },
      };

      const form = service.buildForm(config);

      expect(form).toBeInstanceOf(FormGroup);
      expect(form.contains('name')).toBeTrue();
      expect(form.contains('email')).toBeTrue();
      expect(form.contains('age')).toBeTrue();
      expect(form.get('name')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('age')?.value).toBeNull();
    });

    it('should support structured config with fields wrapper', () => {
      const config: SmartFormConfig = {
        fields: {
          username: { type: 'text', label: 'Username' },
        },
      };

      const form = service.buildForm(config);

      expect(form.contains('username')).toBeTrue();
    });
  });

  describe('default values', () => {
    it('should apply defaultValue to controls', () => {
      const config: SmartFormConfig = {
        name: {
          type: 'text',
          label: 'Name',
          defaultValue: 'John',
        },
        age: {
          type: 'number',
          label: 'Age',
          defaultValue: 30,
        },
      };

      const form = service.buildForm(config);

      expect(form.get('name')?.value).toBe('John');
      expect(form.get('age')?.value).toBe(30);
    });

    it('should use type-specific empty defaults when defaultValue is omitted', () => {
      const config: SmartFormConfig = {
        bio: { type: 'textarea', label: 'Bio' },
        active: { type: 'checkbox', label: 'Active' },
        tags: { type: 'multi-select', label: 'Tags', options: [] },
      };

      const form = service.buildForm(config);

      expect(form.get('bio')?.value).toBe('');
      expect(form.get('active')?.value).toBeFalse();
      expect(form.get('tags')?.value).toEqual([]);
    });
  });

  describe('validation', () => {
    it('should apply required validator', () => {
      const config: SmartFormConfig = {
        name: {
          type: 'text',
          validation: { required: true },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('name');

      control?.setValue('');
      expect(control?.hasError('required')).toBeTrue();

      control?.setValue('Jane');
      expect(control?.valid).toBeTrue();
    });

    it('should apply requiredTrue validator for checkbox fields', () => {
      const config: SmartFormConfig = {
        terms: {
          type: 'checkbox',
          validation: { required: true },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('terms');

      expect(control?.value).toBeFalse();
      expect(control?.valid).toBeFalse();

      control?.setValue(true);
      expect(control?.valid).toBeTrue();
    });

    it('should support required shorthand on the field', () => {
      const config: SmartFormConfig = {
        name: {
          type: 'text',
          required: true,
        },
      };

      const form = service.buildForm(config);

      form.get('name')?.setValue('');
      expect(form.get('name')?.hasError('required')).toBeTrue();
    });

    it('should apply min and max validators for number fields', () => {
      const config: SmartFormConfig = {
        age: {
          type: 'number',
          min: 18,
          validation: { max: 65 },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('age');

      control?.setValue(16);
      expect(control?.hasError('min')).toBeTrue();

      control?.setValue(70);
      expect(control?.hasError('max')).toBeTrue();

      control?.setValue(25);
      expect(control?.valid).toBeTrue();
    });

    it('should apply minLength and maxLength validators', () => {
      const config: SmartFormConfig = {
        username: {
          type: 'text',
          validation: { minLength: 3, maxLength: 10 },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('username');

      control?.setValue('ab');
      expect(control?.hasError('minlength')).toBeTrue();

      control?.setValue('abcdefghijk');
      expect(control?.hasError('maxlength')).toBeTrue();

      control?.setValue('valid');
      expect(control?.valid).toBeTrue();
    });

    it('should apply pattern validator', () => {
      const config: SmartFormConfig = {
        code: {
          type: 'text',
          validation: { pattern: '^[A-Z]{3}$' },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('code');

      control?.setValue('abc');
      expect(control?.hasError('pattern')).toBeTrue();

      control?.setValue('ABC');
      expect(control?.valid).toBeTrue();
    });

    it('should apply email validator for email fields and explicit validation', () => {
      const emailField = { type: 'email' as const, label: 'Email' };
      const contactField = {
        type: 'text' as const,
        validation: { email: true },
      };

      const emailForm = service.buildForm({ email: emailField });
      emailForm.get('email')?.setValue('invalid');
      expect(emailForm.get('email')?.hasError('email')).toBeTrue();

      const contactForm = service.buildForm({ contact: contactField });
      contactForm.get('contact')?.setValue('invalid');
      expect(contactForm.get('contact')?.hasError('email')).toBeTrue();
    });

    it('should append custom validators from validation config', () => {
      const config: SmartFormConfig = {
        value: {
          type: 'text',
          validation: {
            validators: [Validators.required],
          },
        },
      };

      const form = service.buildForm(config);

      form.get('value')?.setValue('');
      expect(form.get('value')?.hasError('required')).toBeTrue();
    });
  });

  describe('disabled state', () => {
    it('should create disabled controls when disabled is true', () => {
      const config: SmartFormConfig = {
        username: {
          type: 'text',
          defaultValue: 'john',
          disabled: true,
        },
      };

      const form = service.buildForm(config);
      const control = form.get('username');

      expect(control?.disabled).toBeTrue();
      expect(control?.value).toBe('john');
    });

    it('should not disable controls when disabled is false or omitted', () => {
      const config: SmartFormConfig = {
        username: { type: 'text', disabled: false },
      };

      const form = service.buildForm(config);

      expect(form.get('username')?.enabled).toBeTrue();
    });
  });

  describe('readonly metadata', () => {
    it('should not disable controls when readonly is true', () => {
      const config: SmartFormConfig = {
        username: {
          type: 'text',
          defaultValue: 'john',
          readonly: true,
        },
      };

      const form = service.buildForm(config);

      expect(form.get('username')?.enabled).toBeTrue();
    });
  });

  describe('form-level configuration', () => {
    it('should apply updateOn option to the FormGroup', () => {
      const config: SmartFormConfig = {
        fields: {
          name: { type: 'text' },
        },
        updateOn: 'blur',
      };

      const form = service.buildForm(config);

      expect(form.updateOn).toBe('blur');
    });
  });

  describe('multiple fields', () => {
    it('should create all expected controls from a multi-field config', () => {
      const config: SmartFormConfig = {
        name: { type: 'text', label: 'Name', validation: { required: true } },
        email: { type: 'email', label: 'Email', validation: { required: true } },
        age: { type: 'number', label: 'Age', min: 18 },
      };

      const form = service.buildForm(config);

      expect(Object.keys(form.controls)).toEqual(['name', 'email', 'age']);
    });
  });

  describe('invalid configuration', () => {
    it('should throw when config is null', () => {
      expect(() => service.buildForm(null as unknown as SmartFormConfig)).toThrowError(
        SmartFormConfigError,
        'SmartFormConfig must be a non-null object.',
      );
    });

    it('should throw when config is empty', () => {
      expect(() => service.buildForm({})).toThrowError(
        SmartFormConfigError,
        'SmartFormConfig must contain at least one field.',
      );
    });

    it('should throw when structured config has empty fields', () => {
      expect(() => service.buildForm({ fields: {} })).toThrowError(
        SmartFormConfigError,
        'SmartFormConfig.fields must contain at least one field.',
      );
    });

    it('should throw when a field is missing type', () => {
      const config = {
        name: { label: 'Name' },
      } as unknown as SmartFormConfig;

      expect(() => service.buildForm(config)).toThrowError(
        SmartFormConfigError,
        'Field "name" is missing a required "type" property.',
      );
    });

    it('should throw for unsupported field types', () => {
      const config = {
        bad: { type: 'xyz' },
      } as unknown as SmartFormConfig;

      expect(() => service.buildForm(config)).toThrowError(
        SmartFormConfigError,
        'Unsupported ngx-smart-form field type: "xyz"',
      );
    });

    it('should throw for custom field type', () => {
      const config: SmartFormConfig = {
        customField: {
          type: 'custom',
          component: class {},
        },
      };

      expect(() => service.buildForm(config)).toThrowError(
        SmartFormConfigError,
        'Field type "custom" is not yet supported by SmartFormBuilderService.',
      );
    });
  });

  describe('immutability', () => {
    it('should not mutate the original configuration object', () => {
      const config: SmartFormConfig = {
        name: {
          type: 'text',
          label: 'Name',
          required: true,
          validation: { minLength: 2 },
        },
        age: {
          type: 'number',
          min: 18,
          defaultValue: 21,
        },
      };

      const snapshot = JSON.parse(JSON.stringify(config));

      service.buildForm(config);

      expect(config).toEqual(snapshot);
    });
  });

  describe('Phase 4 advanced forms', () => {
    it('should build nested FormGroup structures', () => {
      const config: SmartFormConfig = {
        name: { type: 'text', label: 'Name' },
        address: {
          type: 'group',
          label: 'Address',
          fields: {
            street: { type: 'text', label: 'Street' },
            city: { type: 'text', label: 'City' },
          },
        },
      };

      const form = service.buildForm(config);
      const address = form.get('address');

      expect(address).toBeInstanceOf(FormGroup);
      expect(form.get('address.street')).toBeTruthy();
      expect(form.get('address.city')).toBeTruthy();
    });

    it('should build FormArray with initial values', () => {
      const config: SmartFormConfig = {
        skills: {
          type: 'array',
          item: { type: 'text', label: 'Skill' },
          defaultValue: ['Angular', 'TypeScript'],
        },
      };

      const form = service.buildForm(config);
      const skills = form.get('skills');

      expect(skills).toBeTruthy();
      expect(skills?.value).toEqual(['Angular', 'TypeScript']);
    });

    it('should validate FormArray minItems and maxItems', () => {
      const config: SmartFormConfig = {
        skills: {
          type: 'array',
          item: { type: 'text', label: 'Skill' },
          defaultValue: ['Angular'],
          minItems: 2,
        },
      };

      const form = service.buildForm(config);
      expect(form.get('skills')?.valid).toBeFalse();
    });

    it('should attach custom sync validators', () => {
      const validator: ValidatorFn = (control) =>
        control.value === 'admin' ? null : { reserved: true };

      const config: SmartFormConfig = {
        username: {
          type: 'text',
          validation: {
            validators: [validator],
          },
        },
      };

      const form = service.buildForm(config);
      form.get('username')?.setValue('guest');
      expect(form.get('username')?.hasError('reserved')).toBeTrue();
    });

    it('should attach async validators', fakeAsync(() => {
      const asyncValidator = () =>
        new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 10);
        });

      const config: SmartFormConfig = {
        username: {
          type: 'text',
          validation: {
            asyncValidators: [asyncValidator],
          },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('username');

      expect(control?.status).toBe('PENDING');

      tick(10);

      expect(control?.status).toBe('VALID');
    }));

    it('should resolve async validators to INVALID when errors are returned', fakeAsync(() => {
      const asyncValidator = () =>
        new Promise<{ usernameTaken: true }>((resolve) => {
          setTimeout(() => resolve({ usernameTaken: true }), 10);
        });

      const config: SmartFormConfig = {
        username: {
          type: 'text',
          validation: {
            asyncValidators: [asyncValidator],
          },
        },
      };

      const form = service.buildForm(config);
      const control = form.get('username');

      expect(control?.status).toBe('PENDING');

      tick(10);

      expect(control?.status).toBe('INVALID');
      expect(control?.hasError('usernameTaken')).toBeTrue();
    }));

    it('should keep hidden fields in the FormGroup', () => {
      const form = service.buildForm({
        shownField: { type: 'text', label: 'Shown' },
        hiddenField: { type: 'text', label: 'Hidden', hidden: true },
      });

      expect(form.get('hiddenField')).toBeTruthy();
      expect(form.get('shownField')).toBeTruthy();
    });
  });
});
