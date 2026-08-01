# ngx-smart-form

A flexible, configuration-driven dynamic form library for Angular applications. Built on Angular Reactive Forms with strict TypeScript typing and no third-party UI dependencies.

> **Status:** This project is in early development. The foundation and type architecture are in place; dynamic form rendering and validation are planned for upcoming releases.

## Features

| Feature | Status |
| --- | --- |
| Configuration-driven form models (`SmartFormConfig`) | Available |
| Extensible field type definitions | Available |
| Validation configuration interfaces | Available |
| UI-framework independence (no Material, Bootstrap, etc.) | Available |
| Dynamic form renderer | Planned |
| Reactive Forms integration | Planned |
| Built-in validators and error messages | Planned |
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

> Dynamic rendering is not yet implemented. The example below shows the intended configuration API.

```typescript
import { Component } from '@angular/core';
import {
  NgxSmartFormComponent,
  SmartFormConfig,
} from 'ngx-smart-form';

@Component({
  selector: 'app-user-form',
  imports: [NgxSmartFormComponent],
  template: `<ngx-smart-form [config]="formConfig" />`,
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
      validation: { min: 18 },
    },
  };
}
```

## Configuration

Forms are defined as a configuration object keyed by control name. Each field specifies a `type`, optional display properties, and optional validation rules.

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

Validation is configured declaratively on each field via the `validation` property:

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

Supported validation options (implementation planned):

- `required`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `email`
- Custom sync and async validators
- Conditional validation via `when`
- Custom validation messages

## Supported Field Types

The type system is prepared for the following field types:

| Type | Status |
| --- | --- |
| `text` | Planned |
| `email` | Planned |
| `password` | Planned |
| `number` | Planned |
| `textarea` | Planned |
| `select` | Planned |
| `multi-select` | Planned |
| `checkbox` | Planned |
| `radio` | Planned |
| `date` | Planned |
| `date-range` | Planned |
| `file` | Planned |
| `autocomplete` | Planned |
| `custom` | Planned |

## Roadmap

### Phase 1

- Dynamic form configuration
- Basic field types
- Reactive Forms integration
- Validation
- Error messages

### Phase 2

- Nested forms
- Form arrays
- Conditional fields
- Custom validators

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
