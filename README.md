# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** Phase 1 complete — the Reactive Form engine converts `SmartFormConfig` into Angular `FormGroup` instances. Visual field rendering is still under development.

## Features

| Feature | Status |
| --- | --- |
| Configuration-driven form models (`SmartFormConfig`) | Available |
| Reactive Forms engine (`SmartFormBuilderService`) | Available |
| Declarative validation mapping | Available |
| Default values and disabled controls | Available |
| Structured config with `updateOn` | Available |
| Extensible field type definitions | Available |
| UI-framework independence (no Material, Bootstrap, etc.) | Available |
| Dynamic field renderer | Planned |
| Validation error messages UI | Planned |
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
      (formReady)="onFormReady($event)">
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
    console.log('Form value:', form.value);
  }
}
```

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

> Visual field rendering is not yet implemented. The component builds the internal `FormGroup` and exposes it via `(formReady)`.

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

**Currently supported** (mapped to Angular `Validators`):

- `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`
- Custom sync validators via `validation.validators`

**Planned:**

- Custom validation messages UI
- Async validators
- Conditional validation via `when`

## Supported Field Types

| Type | FormControl support | UI rendering |
| --- | --- | --- |
| `text` | Available | Planned |
| `email` | Available | Planned |
| `password` | Available | Planned |
| `number` | Available | Planned |
| `textarea` | Available | Planned |
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

### Phase 2

- Visual field renderer
- Basic field UI components
- Validation error messages
- Nested forms and form arrays
- Conditional fields

### Phase 3

- Custom components
- Async validation
- Advanced layouts
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
