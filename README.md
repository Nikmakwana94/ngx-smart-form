# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** Phase 2 complete — declarative configuration is converted into Reactive Forms and rendered with native HTML controls for basic field types. Additional field types and advanced layouts are planned.

## Features

| Feature | Status |
| --- | --- |
| Configuration-driven form models (`SmartFormConfig`) | Available |
| Reactive Forms engine (`SmartFormBuilderService`) | Available |
| Declarative validation mapping | Available |
| Native HTML field rendering (`text`, `email`, `number`, `textarea`) | Available |
| Validation error messages UI | Available |
| Default values and disabled controls | Available |
| Structured config with `updateOn` | Available |
| Extensible field type definitions | Available |
| UI-framework independence (no Material, Bootstrap, etc.) | Available |
| Additional field types (select, checkbox, date, etc.) | Planned |
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
    name: {
      type: 'text',
      label: 'Name',
      validation: { required: true },
    },
    email: {
      type: 'email',
      label: 'Email',
      validation: { required: true, email: true },
    },
    age: {
      type: 'number',
      label: 'Age',
      min: 18,
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

Phase 2 renders native HTML controls from configuration. The component builds a `FormGroup` internally and binds each rendered field to the same controls created by `SmartFormBuilderService`.

```typescript
formConfig: SmartFormConfig = {
  fields: {
    name: {
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      validation: {
        required: true,
        minLength: 3,
        messages: {
          required: 'Full name is required',
          minLength: 'Name must be at least 3 characters',
        },
      },
    },

    email: {
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      validation: {
        required: true,
        email: true,
      },
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

### Currently rendered field types

| Type | Rendered |
| --- | --- |
| `text` | Yes |
| `email` | Yes |
| `number` | Yes |
| `textarea` | Yes |
| `password` | Planned |
| `select` | Planned |
| `multi-select` | Planned |
| `checkbox` | Planned |
| `radio` | Planned |
| `date` | Planned |
| `date-range` | Planned |
| `file` | Planned |
| `autocomplete` | Planned |
| `custom` | Planned |

Fields with `hidden: true` remain in the `FormGroup` but are not rendered visually.

## Reactive Form Configuration

The library converts declarative configuration into Angular Reactive Forms. You can use either a **flat field map** or a **structured config** with a `fields` wrapper.

### Structured configuration

```typescript
formConfig: SmartFormConfig = {
  fields: {
    name: {
      type: 'text',
      label: 'Name',
      validation: {
        required: true,
        minLength: 3,
      },
    },
    email: {
      type: 'email',
      label: 'Email',
      validation: {
        required: true,
        email: true,
      },
    },
  },
  updateOn: 'blur',
};
```

### Flat configuration (also supported)

```typescript
formConfig: SmartFormConfig = {
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
};
```

### Using the builder service directly

```typescript
import { inject } from '@angular/core';
import { SmartFormBuilderService, SmartFormConfig } from 'ngx-smart-form';

const builder = inject(SmartFormBuilderService);

const config: SmartFormConfig = {
  username: { type: 'text', defaultValue: 'john', disabled: true },
};

const form = builder.buildForm(config);
```

## Configuration

Forms are defined as a configuration object. Each field specifies a `type`, optional display properties, and optional validation rules.

```typescript
const formConfig: SmartFormConfig = {
  country: {
    type: 'select',
    label: 'Country',
    options: [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
    ],
  },
};
```

See the `SmartFormFieldConfig` union type for all supported field shapes.

## Validation

Validation is configured via the `validation` property or field-level shorthand (`required`, `min`, `max` on number fields):

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

Validation errors are shown when a control is **invalid** and **touched**, or after a submit attempt.

**Currently supported** (mapped to Angular `Validators`):

- `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`
- Custom sync validators via `validation.validators`
- Custom messages via `validation.messages`

**Planned:**

- Async validators
- Conditional validation via `when`

## Supported Field Types

| Type | FormControl support | UI rendering |
| --- | --- | --- |
| `text` | Available | Available |
| `email` | Available | Available |
| `number` | Available | Available |
| `textarea` | Available | Available |
| `password` | Available | Planned |
| `select` | Available | Planned |
| `multi-select` | Available | Planned |
| `checkbox` | Available | Planned |
| `radio` | Available | Planned |
| `date` | Available | Planned |
| `date-range` | Available | Planned |
| `file` | Available | Planned |
| `autocomplete` | Available | Planned |
| `custom` | Planned | Planned |

## Roadmap

### Phase 1 ✅

- Dynamic form configuration
- Reactive Forms engine
- Validation mapping
- Default values and disabled controls

### Phase 2 ✅

- Visual field renderer
- Native HTML controls for basic field types
- Validation error messages
- Form submission API

### Phase 3

- Additional field types (select, checkbox, radio, date, file)
- Nested forms and form arrays
- Conditional fields
- Custom components
- Async validation
- UI adapters (Material, Bootstrap, etc.)

## Contributing

Contributions are welcome. Please open an issue or pull request on [GitHub](https://github.com/Nikmakwana94/ngx-smart-form).

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests where applicable
4. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Nikhil Makwana
