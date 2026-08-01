import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SmartFormBuilderService } from '../services/smart-form-builder.service';
import { NgxSmartFormComponent } from './ngx-smart-form.component';

describe('NgxSmartFormComponent', () => {
  let component: NgxSmartFormComponent;
  let fixture: ComponentFixture<NgxSmartFormComponent>;
  let builder: SmartFormBuilderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSmartFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxSmartFormComponent);
    component = fixture.componentInstance;
    builder = TestBed.inject(SmartFormBuilderService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a flat form configuration input', () => {
    const config = {
      name: {
        type: 'text' as const,
        label: 'Name',
        validation: { required: true },
      },
    };

    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    expect(component.config()).toEqual(config);
  });

  it('should build a FormGroup when config is provided', () => {
    fixture.componentRef.setInput('config', {
      name: { type: 'text', defaultValue: 'Jane' },
      email: { type: 'email' },
    });
    fixture.detectChanges();

    const form = component.formGroup();

    expect(form).toBeInstanceOf(FormGroup);
    expect(form?.get('name')?.value).toBe('Jane');
    expect(form?.contains('email')).toBeTrue();
  });

  it('should emit formReady when a FormGroup is built', () => {
    const emitted: FormGroup[] = [];
    component.formReady.subscribe((form) => emitted.push(form));

    fixture.componentRef.setInput('config', {
      name: { type: 'text' },
    });
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toBe(component.formGroup()!);
    expect(emitted[0].contains('name')).toBeTrue();
  });

  it('should rebuild the form when config changes', () => {
    fixture.componentRef.setInput('config', {
      first: { type: 'text' },
    });
    fixture.detectChanges();

    const firstForm = component.formGroup();

    fixture.componentRef.setInput('config', {
      second: { type: 'email' },
    });
    fixture.detectChanges();

    const secondForm = component.formGroup();

    expect(secondForm).not.toBe(firstForm);
    expect(secondForm?.contains('second')).toBeTrue();
    expect(secondForm?.contains('first')).toBeFalse();
  });

  it('should clear the form when config is set to null', () => {
    fixture.componentRef.setInput('config', {
      name: { type: 'text' },
    });
    fixture.detectChanges();

    fixture.componentRef.setInput('config', null);
    fixture.detectChanges();

    expect(component.formGroup()).toBeNull();
  });

  it('should use SmartFormBuilderService to build forms', () => {
    spyOn(builder, 'buildForm').and.callThrough();

    fixture.componentRef.setInput('config', {
      name: { type: 'text' },
    });
    fixture.detectChanges();

    expect(builder.buildForm).toHaveBeenCalled();
  });

  describe('Phase 2 visual rendering', () => {
    it('should render multiple configured fields', () => {
      fixture.componentRef.setInput('config', {
        name: { type: 'text', label: 'Name' },
        email: { type: 'email', label: 'Email' },
        age: { type: 'number', label: 'Age' },
        description: { type: 'textarea', label: 'Description' },
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('input[type="text"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('input[type="email"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('input[type="number"]'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('textarea'))).toBeTruthy();
    });

    it('should keep hidden fields in the FormGroup without rendering them', () => {
      fixture.componentRef.setInput('config', {
        visible: { type: 'text', label: 'Visible' },
        hiddenField: { type: 'text', label: 'Hidden', hidden: true },
      });
      fixture.detectChanges();

      const form = component.formGroup();
      expect(form?.contains('hiddenField')).toBeTrue();
      expect(fixture.debugElement.queryAll(By.css('.ngx-smart-form-field')).length).toBe(1);
    });

    it('should bind rendered controls to the builder FormGroup', () => {
      fixture.componentRef.setInput('config', {
        name: { type: 'text', defaultValue: 'Jane' },
      });
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'Updated';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.formGroup()?.get('name')?.value).toBe('Updated');
    });

    it('should emit submitted with form value when valid', () => {
      const submittedValues: Record<string, unknown>[] = [];
      component.submitted.subscribe((value) => submittedValues.push(value));

      fixture.componentRef.setInput('config', {
        name: { type: 'text', defaultValue: 'Jane' },
        email: { type: 'email', defaultValue: 'jane@example.com' },
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);

      expect(submittedValues.length).toBe(1);
      expect(submittedValues[0]).toEqual({
        name: 'Jane',
        email: 'jane@example.com',
      });
    });

    it('should not emit submitted when invalid and should mark controls touched', () => {
      const submittedValues: Record<string, unknown>[] = [];
      component.submitted.subscribe((value) => submittedValues.push(value));

      fixture.componentRef.setInput('config', {
        name: {
          type: 'text',
          validation: { required: true },
        },
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
      fixture.detectChanges();

      expect(submittedValues.length).toBe(0);
      expect(component.formGroup()?.get('name')?.touched).toBeTrue();
      expect(fixture.debugElement.query(By.css('.ngx-smart-form-error'))).toBeTruthy();
    });
  });

  describe('Phase 3 submit configuration', () => {
    it('should render the default submit label', () => {
      fixture.componentRef.setInput('config', {
        name: { type: 'text', defaultValue: 'Jane' },
      });
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.ngx-smart-form-submit'));
      expect(button.nativeElement.textContent.trim()).toBe('Submit');
    });

    it('should render a custom submit label from structured config', () => {
      fixture.componentRef.setInput('config', {
        fields: {
          name: { type: 'text', defaultValue: 'Jane' },
        },
        submit: {
          label: 'Create User',
        },
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.ngx-smart-form-submit')).nativeElement.textContent.trim()).toBe(
        'Create User',
      );
    });

    it('should hide the submit button when visible is false', () => {
      fixture.componentRef.setInput('config', {
        fields: {
          name: { type: 'text', defaultValue: 'Jane' },
        },
        submit: {
          visible: false,
        },
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.ngx-smart-form-submit'))).toBeNull();
    });

    it('should disable the submit button while the form is invalid', () => {
      fixture.componentRef.setInput('config', {
        name: {
          type: 'text',
          validation: { required: true },
        },
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.ngx-smart-form-submit')).nativeElement.disabled).toBeTrue();
    });

    it('should enable the submit button when the form becomes valid', () => {
      fixture.componentRef.setInput('config', {
        name: {
          type: 'text',
          defaultValue: 'Jane',
          validation: { required: true },
        },
      });
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.ngx-smart-form-submit')).nativeElement.disabled).toBeFalse();
    });
  });
});
