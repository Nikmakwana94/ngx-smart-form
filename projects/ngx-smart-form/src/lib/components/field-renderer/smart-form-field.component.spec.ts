import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SmartFormFieldConfig, SmartFormLeafFieldConfig } from '../../models/form-config';
import { SmartFormFieldComponent } from './smart-form-field.component';

describe('SmartFormFieldComponent', () => {
  let fixture: ComponentFixture<SmartFormFieldComponent>;

  function setupField(
    fieldKey: string,
    fieldConfig: SmartFormLeafFieldConfig,
    control: FormControl,
    submitAttempted = false,
  ): void {
    fixture = TestBed.createComponent(SmartFormFieldComponent);
    fixture.componentRef.setInput('fieldKey', fieldKey);
    fixture.componentRef.setInput('fieldConfig', fieldConfig);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('submitAttempted', submitAttempted);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFormFieldComponent, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should render text input for text fields', () => {
    setupField('name', { type: 'text', label: 'Name' }, new FormControl(''));

    const input = fixture.debugElement.query(By.css('input[type="text"]'));
    expect(input).toBeTruthy();
  });

  it('should render email input for email fields', () => {
    setupField('email', { type: 'email', label: 'Email' }, new FormControl(''));

    const input = fixture.debugElement.query(By.css('input[type="email"]'));
    expect(input).toBeTruthy();
  });

  it('should render number input for number fields', () => {
    setupField('age', { type: 'number', label: 'Age', min: 18, max: 100 }, new FormControl(null));

    const input = fixture.debugElement.query(By.css('input[type="number"]'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.getAttribute('min')).toBe('18');
    expect(input.nativeElement.getAttribute('max')).toBe('100');
  });

  it('should render textarea for textarea fields', () => {
    setupField(
      'description',
      { type: 'textarea', label: 'Description', rows: 4 },
      new FormControl(''),
    );

    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
    expect(textarea.nativeElement.getAttribute('rows')).toBe('4');
  });

  it('should render configured labels', () => {
    setupField('name', { type: 'text', label: 'Full Name' }, new FormControl(''));

    const label = fixture.debugElement.query(By.css('label'));
    expect(label.nativeElement.textContent.trim()).toBe('Full Name');
    expect(label.nativeElement.getAttribute('for')).toBe('ngx-smart-form-name');
  });

  it('should not render a label when none is configured', () => {
    setupField('name', { type: 'text' }, new FormControl(''));

    expect(fixture.debugElement.query(By.css('label'))).toBeNull();
  });

  it('should render configured placeholders', () => {
    setupField(
      'name',
      { type: 'text', label: 'Name', placeholder: 'Enter your name' },
      new FormControl(''),
    );

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.getAttribute('placeholder')).toBe('Enter your name');
  });

  it('should render configured hints', () => {
    setupField(
      'username',
      {
        type: 'text',
        label: 'Username',
        hint: 'Username must be at least 3 characters',
      },
      new FormControl(''),
    );

    const hint = fixture.debugElement.query(By.css('.ngx-smart-form-hint'));
    expect(hint.nativeElement.textContent.trim()).toBe(
      'Username must be at least 3 characters',
    );
  });

  it('should display initial control values', () => {
    setupField('name', { type: 'text', label: 'Name' }, new FormControl('Jane'));

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.value).toBe('Jane');
  });

  it('should reflect disabled controls', () => {
    const control = new FormControl({ value: 'john', disabled: true });
    setupField('username', { type: 'text', label: 'Username' }, control);

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.disabled).toBeTrue();
    expect(control.disabled).toBeTrue();
  });

  it('should reflect readonly without disabling the control', () => {
    const control = new FormControl('john');
    setupField(
      'username',
      { type: 'text', label: 'Username', readonly: true },
      control,
    );

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.readOnly).toBeTrue();
    expect(control.disabled).toBeFalse();
  });

  it('should not render hidden fields visually', () => {
    setupField('secret', { type: 'text', label: 'Secret', hidden: true }, new FormControl(''));

    expect(fixture.debugElement.query(By.css('.ngx-smart-form-field'))).toBeNull();
  });

  it('should show validation errors after the control is touched', () => {
    const control = new FormControl('', Validators.required);

    setupField(
      'name',
      {
        type: 'text',
        label: 'Name',
        validation: {
          required: true,
          messages: { required: 'Name is required' },
        },
      },
      control,
    );

    expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeNull();

    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.ngx-smart-form-error'));
    expect(error.nativeElement.textContent.trim()).toBe('Name is required');
  });

  it('should show validation errors after submit attempted', () => {
    const control = new FormControl('', Validators.required);

    setupField(
      'name',
      { type: 'text', label: 'Name', validation: { required: true } },
      control,
      true,
    );

    const error = fixture.debugElement.query(By.css('.ngx-smart-form-error'));
    expect(error.nativeElement.textContent.trim()).toBe('This field is required.');
  });

  it('should hide validation errors when the control becomes valid', () => {
    const control = new FormControl('', Validators.required);

    setupField(
      'name',
      { type: 'text', label: 'Name', validation: { required: true } },
      control,
    );

    control.markAsTouched();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeTruthy();

    control.setValue('Jane');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeNull();
  });

  it('should wire accessibility attributes', () => {
    const control = new FormControl('', Validators.required);

    setupField(
      'name',
      {
        type: 'text',
        label: 'Name',
        hint: 'Enter your full name',
        validation: { required: true },
      },
      control,
      true,
    );

    const input = fixture.debugElement.query(By.css('input'));
    expect(input.nativeElement.id).toBe('ngx-smart-form-name');
    expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    expect(input.nativeElement.getAttribute('aria-describedby')).toBe(
      'ngx-smart-form-name-hint ngx-smart-form-name-error',
    );
  });

  it('should update the bound FormControl when the user types', () => {
    const control = new FormControl('');
    setupField('name', { type: 'text', label: 'Name' }, control);

    const input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'Updated';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(control.value).toBe('Updated');
  });

  describe('Phase 3 field types', () => {
    it('should render password input with correct type', () => {
      setupField(
        'password',
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
          validation: { required: true, minLength: 8 },
        },
        new FormControl(''),
      );

      const input = fixture.debugElement.query(By.css('input[type="password"]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.placeholder).toBe('Enter your password');
    });

    it('should render select with options and placeholder', () => {
      setupField(
        'country',
        {
          type: 'select',
          label: 'Country',
          placeholder: 'Select a country',
          options: [
            { label: 'India', value: 'IN' },
            { label: 'United States', value: 'US', disabled: true },
          ],
        },
        new FormControl(null),
      );

      const select = fixture.debugElement.query(By.css('select'));
      const options = fixture.debugElement.queryAll(By.css('option'));

      expect(select).toBeTruthy();
      expect(options.length).toBe(3);
      expect(options[0].nativeElement.textContent.trim()).toBe('Select a country');
      expect(options[2].nativeElement.disabled).toBeTrue();
    });

    it('should reflect disabled select field state', () => {
      const control = new FormControl({ value: null, disabled: true });
      setupField(
        'country',
        {
          type: 'select',
          label: 'Country',
          options: [{ label: 'India', value: 'IN' }],
        },
        control,
      );

      expect(fixture.debugElement.query(By.css('select')).nativeElement.disabled).toBeTrue();
    });

    it('should render checkbox with boolean value and default false', () => {
      setupField(
        'terms',
        { type: 'checkbox', label: 'Accept Terms' },
        new FormControl(false),
      );

      const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(checkbox).toBeTruthy();
      expect(checkbox.nativeElement.checked).toBeFalse();
      expect(fixture.debugElement.query(By.css('label')).nativeElement.textContent.trim()).toBe(
        'Accept Terms',
      );
    });

    it('should reflect checked checkbox state', () => {
      setupField(
        'terms',
        { type: 'checkbox', label: 'Accept Terms' },
        new FormControl(true),
      );

      expect(
        fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement.checked,
      ).toBeTrue();
    });

    it('should enforce required checkbox behavior via requiredTrue', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      setupField(
        'terms',
        {
          type: 'checkbox',
          label: 'Accept Terms',
          validation: { required: true },
        },
        control,
        true,
      );

      expect(control.valid).toBeFalse();
      expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeTruthy();

      control.setValue(true);
      fixture.detectChanges();

      expect(control.valid).toBeTrue();
      expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeNull();
    });

    it('should render radio options with unique IDs and update FormControl value', () => {
      const control = new FormControl<string | null>(null);
      setupField(
        'gender',
        {
          type: 'radio',
          label: 'Gender',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
          ],
        },
        control,
      );

      const radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radios.length).toBe(2);
      expect(radios[0].nativeElement.id).toBe('ngx-smart-form-gender-0');
      expect(radios[1].nativeElement.id).toBe('ngx-smart-form-gender-1');
      expect(fixture.debugElement.query(By.css('[role="radiogroup"]'))).toBeTruthy();

      radios[1].nativeElement.click();
      fixture.detectChanges();

      expect(control.value).toBe('female');
    });

    it('should render date input with min and max attributes', () => {
      setupField(
        'birthDate',
        {
          type: 'date',
          label: 'Date of Birth',
          defaultValue: '2000-01-15',
          min: '1900-01-01',
          max: '2020-12-31',
        },
        new FormControl('2000-01-15'),
      );

      const input = fixture.debugElement.query(By.css('input[type="date"]'));
      expect(input).toBeTruthy();
      expect(input.nativeElement.value).toBe('2000-01-15');
      expect(input.nativeElement.getAttribute('min')).toBe('1900-01-01');
      expect(input.nativeElement.getAttribute('max')).toBe('2020-12-31');
    });

    it('should keep readonly checkbox-like fields enabled for non-checkbox types', () => {
      const control = new FormControl('john');
      setupField(
        'username',
        { type: 'text', label: 'Username', readonly: true },
        control,
      );

      expect(fixture.debugElement.query(By.css('input')).nativeElement.readOnly).toBeTrue();
      expect(control.disabled).toBeFalse();
    });
  });
});
