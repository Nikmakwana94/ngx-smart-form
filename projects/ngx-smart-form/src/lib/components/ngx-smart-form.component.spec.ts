import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

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
});
