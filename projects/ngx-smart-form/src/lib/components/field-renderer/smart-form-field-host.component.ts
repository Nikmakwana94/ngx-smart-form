import {
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  SmartFormArrayFieldConfig,
  SmartFormFieldConfig,
  SmartFormGroupFieldConfig,
  SmartFormLeafFieldConfig,
} from '../../models/form-config';
import { SmartFormDependencyService } from '../../services/smart-form-dependency.service';
import { SmartFormArrayFieldComponent } from './smart-form-array-field.component';
import { SmartFormFieldComponent } from './smart-form-field.component';

@Component({
  selector: 'ngx-smart-form-field-host',
  imports: [
    ReactiveFormsModule,
    SmartFormFieldComponent,
    SmartFormArrayFieldComponent,
    forwardRef(() => SmartFormFieldHostComponent),
  ],
  template: `
    @if (isVisible()) {
      @switch (fieldConfig().type) {
        @case ('group') {
          <fieldset [class]="groupClass()">
            @if (fieldConfig().label) {
              <legend class="ngx-smart-form-label ngx-smart-form-group-label">
                {{ fieldConfig().label }}
              </legend>
            }

            @if (groupConfig().hint) {
              <small class="ngx-smart-form-hint">{{ groupConfig().hint }}</small>
            }

            @for (entry of groupEntries(); track entry.key) {
              <ngx-smart-form-field-host
                [rootForm]="rootForm()"
                [formGroup]="groupControl()"
                [fieldKey]="entry.key"
                [fieldPath]="entry.path"
                [fieldConfig]="entry.config"
                [submitAttempted]="submitAttempted()"
              />
            }
          </fieldset>
        }
        @case ('array') {
          <ngx-smart-form-array-field
            [fieldPath]="fieldPath()"
            [fieldConfig]="arrayConfig()"
            [formArray]="arrayControl()"
            [submitAttempted]="submitAttempted()"
          />
        }
        @default {
          <ngx-smart-form-field
            [fieldKey]="fieldKey()"
            [fieldPath]="fieldPath()"
            [fieldConfig]="leafConfig()"
            [control]="leafControl()"
            [submitAttempted]="submitAttempted()"
          />
        }
      }
    }
  `,
  styles: `
    .ngx-smart-form-group {
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-block-end: 1rem;
    }

    .ngx-smart-form-group-label {
      padding: 0 0.25rem;
    }
  `,
})
export class SmartFormFieldHostComponent {
  private readonly dependencyService = inject(SmartFormDependencyService);

  readonly rootForm = input.required<FormGroup>();
  readonly formGroup = input.required<FormGroup>();
  readonly fieldKey = input.required<string>();
  readonly fieldPath = input.required<string>();
  readonly fieldConfig = input.required<SmartFormFieldConfig>();
  readonly submitAttempted = input<boolean>(false);

  readonly isVisible = computed(() => {
    this.dependencyService.revision();
    return this.dependencyService.isVisible(this.fieldPath());
  });

  readonly groupConfig = computed(() => this.fieldConfig() as SmartFormGroupFieldConfig);
  readonly arrayConfig = computed(() => this.fieldConfig() as SmartFormArrayFieldConfig);
  readonly leafConfig = computed(
    () => this.fieldConfig() as SmartFormLeafFieldConfig,
  );

  readonly groupControl = computed(() => {
    return this.formGroup().get(this.fieldKey()) as FormGroup;
  });

  readonly arrayControl = computed(() => {
    return this.formGroup().get(this.fieldKey()) as FormArray;
  });

  readonly leafControl = computed(() => {
    return this.formGroup().get(this.fieldKey()) as FormControl;
  });

  readonly groupClass = computed(() => {
    const classes = ['ngx-smart-form-group'];
    const customClass = this.groupConfig().cssClass;

    if (customClass) {
      classes.push(customClass);
    }

    return classes.join(' ');
  });

  readonly groupEntries = computed(() => {
    const config = this.groupConfig();
    return Object.entries(config.fields).map(([key, childConfig]) => ({
      key,
      path: `${this.fieldPath()}.${key}`,
      config: childConfig,
    }));
  });
}
