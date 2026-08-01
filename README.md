# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** Phase 4 complete — nested groups, FormArray, conditional visibility/enable, custom sync/async validators, and dynamic validation based on other fields.

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
| Nested FormGroup fields (`type: 'group'`) | Available |
| FormArray fields (`type: 'array'`) | Available |
| Conditional field visibility (`when`) | Available |
| Conditional enable/disable (`enabledWhen`) | Available |
| Custom sync validators (`ValidatorFn`) | Available |
| Async validators (`AsyncValidatorFn`) | Available |
| UI-framework independence (no Material, Bootstrap, etc.) | Available |
| Multi-select, autocomplete, file, date-range | Planned |
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
| `group` | Available (nested FormGroup) | Available |
| `array` | Available (FormArray) | Available |
| `multi-select` | Available | Planned |
| `autocomplete` | Available | Planned |
| `date-range` | Available | Planned |
| `file` | Available | Planned |
| `custom` | Planned | Planned |

Fields with `hidden: true` remain in the `FormGroup` but are not rendered visually. Their controls are disabled so they do not block form validity or submission.

## Nested Groups

Use `type: 'group'` to create a nested `FormGroup` inside the parent form. Nested groups are rendered recursively and are not flattened into the root group.

```typescript
const formConfig: SmartFormConfig = {
  name: { type: 'text', label: 'Name' },
  address: {
    type: 'group',
    label: 'Address',
    fields: {
      street: { type: 'text', label: 'Street' },
      city: { type: 'text', label: 'City' },
      zipCode: { type: 'text', label: 'ZIP Code' },
    },
  },
};
```

Resulting structure:

```text
FormGroup
├── name
└── address (FormGroup)
    ├── street
    ├── city
    └── zipCode
```

## FormArray

Use `type: 'array'` for repeatable fields. The builder creates a real Angular `FormArray` with add/remove UI.

```typescript
{
  skills: {
    type: 'array',
    label: 'Skills',
    item: { type: 'text', label: 'Skill' },
    defaultValue: ['Angular', 'Node.js'],
    minItems: 1,
    maxItems: 10,
  },
}
```

Initial values can be supplied via `defaultValue`. If omitted, the array starts empty. The original config object is never mutated.

## Conditional Fields

Use `when` to show or hide a field based on another control's value. Conditions support dot-paths for nested fields (for example `address.country`).

```typescript
accountType: {
  type: 'select',
  label: 'Account Type',
  options: [
    { label: 'Individual', value: 'individual' },
    { label: 'Company', value: 'company' },
  ],
},
companyName: {
  type: 'text',
  label: 'Company Name',
  when: { field: 'accountType', equals: 'company' },
  validation: { required: true },
},
```

When `accountType` is `individual`, `companyName` is hidden. When it becomes `company`, the field appears and required validation applies.

### Supported condition operators

| Operator | Example |
| --- | --- |
| `equals` | `{ field: 'country', equals: 'IN' }` |
| `notEquals` | `{ field: 'role', notEquals: 'guest' }` |
| `in` | `{ field: 'role', in: ['admin', 'manager'] }` |
| `notIn` | `{ field: 'status', notIn: ['archived'] }` |
| `truthy` | `{ field: 'hasCompany', truthy: true }` |
| `falsy` | `{ field: 'hasCompany', falsy: true }` |

## Conditional Enable / Disable

Use `enabledWhen` to disable a visible field when a condition fails. This is separate from `hidden`, `disabled`, and `readonly`.

```typescript
companyName: {
  type: 'text',
  label: 'Company Name',
  enabledWhen: { field: 'accountType', equals: 'company' },
},
```

When `accountType` is `individual`, the field stays visible but disabled.

## Hidden, Disabled, and Form Values

| State | In FormGroup | Rendered | Validates | In `form.value` | In `form.getRawValue()` |
| --- | --- | --- | --- | --- | --- |
| Visible + enabled | Yes | Yes | Yes | Yes | Yes |
| Hidden (`when` fails or `hidden: true`) | Yes | No | No (disabled) | No | Yes |
| Disabled (`enabledWhen` fails or `disabled: true`) | Yes | Yes* | No | No | Yes |
| Readonly | Yes | Yes | Yes | Yes | Yes |

\*Hidden fields are not rendered. Disabled visible fields are rendered but not editable.

The `(submitted)` event emits `form.getRawValue()`, which includes disabled and hidden control values. Submit button validity uses `form.invalid`, which ignores disabled controls — so hidden required fields do not block submission.

Avoid naming flat-config field keys `fields`, `updateOn`, or `submit`; use the structured `{ fields: { ... } }` shape instead.

Use `form.get('fieldName')` rather than `form.contains('fieldName')` to verify hidden or disabled controls still exist — Angular's `contains()` returns `false` for disabled controls.

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

**Supported validators:** `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`, custom sync validators, and async validators.

Checkbox `required` uses `Validators.requiredTrue` so the form stays invalid until checked.

### Custom synchronous validators

Pass Angular `ValidatorFn` instances via `validation.validators`:

```typescript
import { ValidatorFn } from '@angular/forms';

const usernameValidator: ValidatorFn = (control) =>
  control.value === 'admin' ? { reserved: true } : null;

{
  type: 'text',
  label: 'Username',
  validation: {
    validators: [usernameValidator],
    messages: {
      reserved: 'This username is reserved.',
    },
  },
}
```

### Async validators

Pass Angular `AsyncValidatorFn` instances via `validation.asyncValidators`. The library does not perform HTTP calls — your application provides the validator:

```typescript
import { AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs/operators';

const usernameExistsValidator: AsyncValidatorFn = (control) =>
  this.userService.checkUsername(control.value).pipe(
    map((exists) => (exists ? { usernameTaken: true } : null)),
  );

{
  type: 'text',
  label: 'Username',
  validation: {
    asyncValidators: [usernameExistsValidator],
    messages: {
      usernameTaken: 'This username is already taken.',
    },
  },
}
```

While async validation runs, the control status is `PENDING`. Custom error keys map to `validation.messages` the same way as sync validators.

## Roadmap

### Phase 1 ✅ — Reactive Form Engine

### Phase 2 ✅ — Visual Field Renderer (text, email, number, textarea)

### Phase 3 ✅ — Additional native field types + submit configuration

### Phase 4 ✅ — Advanced form engine

- Nested FormGroup (`type: 'group'`)
- FormArray (`type: 'array'`) with add/remove UI
- Conditional visibility (`when`) and enable (`enabledWhen`)
- Custom sync and async validators
- Nested condition paths (for example `address.country`)

### Phase 5 (recommended)

- Multi-select, autocomplete, file, and date-range UI rendering
- Custom component fields (`type: 'custom'`)
- Optional UI adapters (Material, Bootstrap, etc.)
- Cross-field validators and richer dependency graphs

## Contributing

Contributions are welcome on [GitHub](https://github.com/Nikmakwana94/ngx-smart-form).

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Nikhil Makwana
