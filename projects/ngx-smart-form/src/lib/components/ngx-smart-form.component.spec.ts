import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSmartFormComponent } from './ngx-smart-form.component';

describe('NgxSmartFormComponent', () => {
  let component: NgxSmartFormComponent;
  let fixture: ComponentFixture<NgxSmartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxSmartFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxSmartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a form configuration input', () => {
    fixture.componentRef.setInput('config', {
      name: {
        type: 'text',
        label: 'Name',
        validation: { required: true },
      },
    });
    fixture.detectChanges();

    expect(component.config()).toEqual({
      name: {
        type: 'text',
        label: 'Name',
        validation: { required: true },
      },
    });
  });
});
