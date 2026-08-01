# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** Phase 3 complete — native HTML rendering for core field types including password, select, checkbox, radio, and date. Advanced field types and nested forms are planned.

## Features

| Feature | Status |
| --- | --- |
| Configuration-driven form models (`SmartFormConfig`) | Available |
| Reactive Forms engine (`SmartFormBuilderService`) | Available |
| Declarative validation mapping | Available |
| Native HTML field rendering | Available |
| Validation error messages UI | Available |
| Configurable submit button | Available |
| Default values and disabled controls | Available |
| Structured config with `updateOn` | Available |
| UI-framework independence (no Material, Bootstrap, etc.) | Available |
| Multi-select, autocomplete, file, date-range | Planned |
| Nested forms and form arrays | Planned |
| Conditional fields and async validation | Planned |
| Custom component fields | Planned |
| Optional UI adapters | Planned |

## Installation

```bash
npm install ngx-smart-form
```

> The package is not yet published to npm. Install from source or wait for the first release.

### Peer dependencies

Ensure your Angular application includes:

- `@angular/common`
- `@angular/core`
- `@angular/forms`

Compatible with Angular **19** and **20**.

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  NgxSmartFormComponent,
  SmartFormConfig,
} from 'ngx-smart-form';

@Component({
  selector: 'app-user-form',
  imports: [NgxSmartFormComponent],
  template: `
    <ngx-smart-form
      [config]="formConfig"
      (formReady)="onFormReady($event)"
      (submitted)="onSubmit($event)">
    </ngx-smart-form>
  `,
})
export class UserFormComponent {
  readonly formConfig: SmartFormConfig = {
    fields: {
      name: { type: 'text', label: 'Name', validation: { required: true } },
      email: { type: 'email', label: 'Email', validation: { required: true } },
      age: { type: 'number', label: 'Age', min: 18 },
    },
    submit: {
      label: 'Create User',
      visible: true,
    },
  };

  onFormReady(form: FormGroup): void {
    console.log('Form ready:', form);
  }

  onSubmit(value: Record<string, unknown>): void {
    console.log('Submitted value:', value);
  }
}
```

## Dynamic Form Rendering

The component builds a `FormGroup` internally and renders native HTML controls from configuration.

```typescript
formConfig: SmartFormConfig = {
  fields: {
    name: {
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      validation: { required: true, minLength: 3 },
    },
    email: {
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      validation: { required: true, email: true },
    },
    age: {
      type: 'number',
      label: 'Age',
      min: 18,
      max: 100,
    },
    description: {
      type: 'textarea',
      label: 'Description',
      placeholder: 'Tell us about yourself',
      rows: 4,
    },
  },
};
```

```html
<ngx-smart-form
  [config]="formConfig"
  (formReady)="onFormReady($event)"
  (submitted)="onSubmit($event)">
</ngx-smart-form>
```

## Field Examples

### Password

```typescript
{
  type: 'password',
  label: 'Password',
  validation: {
    required: true,
    minLength: 8,
  },
}
```

### Select

```typescript
{
  type: 'select',
  label: 'Country',
  placeholder: 'Select a country',
  options: [
    { label: 'India', value: 'IN' },
    { label: 'USA', value: 'US' },
  ],
}
```

### Checkbox

```typescript
{
  type: 'checkbox',
  label: 'Accept Terms',
  validation: {
    required: true,
  },
}
```

### Radio

```typescript
{
  type: 'radio',
  label: 'Gender',
  options: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ],
}
```

### Date

```typescript
{
  type: 'date',
  label: 'Date of Birth',
  min: '1900-01-01',
  max: '2020-12-31',
}
```

### Submit configuration

```typescript
{
  fields: {
    name: { type: 'text', label: 'Name' },
  },
  submit: {
    label: 'Create User',
    visible: true,
  },
}
```

## Supported Field Types

| Type | FormControl | UI rendering |
| --- | --- | --- |
| `text` | Available | Available |
| `email` | Available | Available |
| `password` | Available | Available |
| `number` | Available | Available |
| `textarea` | Available | Available |
| `select` | Available | Available |
| `checkbox` | Available | Available |
| `radio` | Available | Available |
| `date` | Available | Available |
| `multi-select` | Available | Planned |
| `autocomplete` | Available | Planned |
| `date-range` | Available | Planned |
| `file` | Available | Planned |
| `custom` | Planned | Planned |

Fields with `hidden: true` remain in the `FormGroup` but are not rendered visually.

## Reactive Form Configuration

Use either a **flat field map** or a **structured config** with a `fields` wrapper.

```typescript
formConfig: SmartFormConfig = {
  fields: {
    name: {
      type: 'text',
      label: 'Name',
      required: true, // shorthand for validation.required
    },
    age: {
      type: 'number',
      label: 'Age',
      min: 18, // shorthand for validation.min
    },
  },
  updateOn: 'blur',
};
```

### Using the builder service directly

```typescript
import { inject } from '@angular/core';
import { SmartFormBuilderService, SmartFormConfig } from 'ngx-smart-form';

const builder = inject(SmartFormBuilderService);
const form = builder.buildForm({
  username: { type: 'text', defaultValue: 'john', disabled: true },
});
```

## Validation

Validation is configured via the `validation` property or field-level shorthand:

```typescript
{
  type: 'text',
  label: 'Username',
  validation: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
    messages: {
      required: 'Username is required',
      minLength: 'Must be at least 3 characters',
    },
  },
}
```

Errors are shown when a control is **invalid** and **touched**, or after a submit attempt.

**Supported validators:** `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, custom sync validators.

Checkbox `required` uses `Validators.requiredTrue` so the form stays invalid until checked.

## Roadmap

### Phase 1 ✅ — Reactive Form Engine

### Phase 2 ✅ — Visual Field Renderer (text, email, number, textarea)

### Phase 3 ✅ — Additional native field types + submit configuration

### Phase 4

- Multi-select, autocomplete, file, date-range
- Nested forms and form arrays
- Conditional fields
- Custom components
- Async validation
- UI adapters

## Contributing

Contributions are welcome on [GitHub](https://github.com/Nikmakwana94/ngx-smart-form).

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Nikhil Makwana
