# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** v0.9.0 release candidate — Phases 1–4 complete. Structured configuration is the recommended form shape.

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

### Fully supported (builder + visual renderer)

These field types are stable in v0.9.0:

| Field Type | Builder | Visual Renderer | Status |
| --- | --- | --- | --- |
| `text` | Yes | Yes | Stable |
| `email` | Yes | Yes | Stable |
| `password` | Yes | Yes | Stable |
| `number` | Yes | Yes | Stable |
| `textarea` | Yes | Yes | Stable |
| `select` | Yes | Yes | Stable |
| `checkbox` | Yes | Yes | Stable |
| `radio` | Yes | Yes | Stable |
| `date` | Yes | Yes | Stable |
| `group` | Yes | Yes | Stable |
| `array` | Yes | Yes | Stable |

### Builder-only / experimental (not rendered yet)

These types exist in the TypeScript configuration model for future extension. They are **not** rendered by `NgxSmartFormComponent` in v0.9.0:

| Field Type | Builder | Visual Renderer | Status |
| --- | --- | --- | --- |
| `multi-select` | Yes | No | Experimental |
| `autocomplete` | Yes | No | Experimental |
| `file` | Yes | No | Experimental |
| `date-range` | Yes | No | Experimental |
| `custom` | No | No | Experimental / planned |

Do not assume experimental types are fully supported in the UI. Use the builder service directly if you need to create controls for builder-only types programmatically.

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

## Form Value and Hidden Fields

Angular Reactive Forms distinguish between **enabled value snapshots** and **raw value snapshots**:

```typescript
form.value        // enabled controls only
form.getRawValue() // all controls, including disabled
```

### v1 contract

| Behavior | Detail |
| --- | --- |
| Disabled controls | Excluded from `form.value`, included in `form.getRawValue()` |
| Hidden fields (`hidden: true` or failed `when`) | Remain in the `FormGroup`, become **disabled**, excluded from validation |
| `(submitted)` output | Emits `form.getRawValue()` — hidden/disabled values are **included** |
| Submit button | Uses `form.invalid`, which ignores disabled controls |

Example:

```typescript
// hiddenField has hidden: true and defaultValue: 'secret'
form.value;           // { shownField: 'visible' }
form.getRawValue();    // { shownField: 'visible', hiddenField: 'secret' }

// After submit:
(submitted)="onSubmit($event)" // $event includes hiddenField
```

| State | In FormGroup | Rendered | Validates | In `form.value` | In `form.getRawValue()` |
| --- | --- | --- | --- | --- | --- |
| Visible + enabled | Yes | Yes | Yes | Yes | Yes |
| Hidden (`when` fails or `hidden: true`) | Yes | No | No (disabled) | No | Yes |
| Disabled (`enabledWhen` fails or `disabled: true`) | Yes | Yes* | No | No | Yes |
| Readonly | Yes | Yes | Yes | Yes | Yes |

\*Hidden fields are not rendered. Disabled visible fields are rendered but not editable.

Use `form.get('fieldName')` rather than `form.contains('fieldName')` to verify hidden or disabled controls still exist — Angular's `contains()` returns `false` for disabled controls.

## Configuration Shape

### Recommended: structured configuration

Structured configuration is the **canonical** form shape for v0.9.0 and beyond:

```typescript
const formConfig: SmartFormConfig = {
  fields: {
    name: {
      type: 'text',
      label: 'Name',
      validation: { required: true },
    },
  },
  updateOn: 'blur',
  submit: {
    label: 'Save',
  },
};
```

Structured configuration leaves room for top-level options:

```text
fields
updateOn
submit
```

and future form-level settings without naming collisions.

### Also supported: flat configuration

Flat configuration remains supported for simple forms:

```typescript
const formConfig: SmartFormConfig = {
  name: {
    type: 'text',
    label: 'Name',
  },
};
```

### Reserved keys in flat configuration

When using flat configuration, do **not** use these keys as field names:

```text
fields
updateOn
submit
```

These names collide with structured top-level properties and can cause ambiguous or invalid configuration. Prefer structured configuration when you need submit-button or form-level options.

## Reactive Form Configuration

Use either a **flat field map** or the recommended **structured config** with a `fields` wrapper.

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
