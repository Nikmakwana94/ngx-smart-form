import { SmartFormConfigError } from '../errors/smart-form-config.error';
import {
  SmartFormConfig,
  SmartFormFieldConfig,
  SmartFormFieldsConfig,
  SmartFormStructuredConfig,
  SmartFormSubmitConfig,
  SmartFormUpdateOn,
} from '../models/form-config';
import { SmartFormFieldValidation } from '../models/validation-config';

export interface NormalizedSmartFormConfig {
  fields: SmartFormFieldsConfig;
  updateOn?: SmartFormUpdateOn;
  submit?: SmartFormSubmitConfig;
}

const STRUCTURED_CONFIG_KEYS = new Set(['fields', 'updateOn', 'submit']);

function isFieldConfig(value: unknown): value is SmartFormFieldConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as SmartFormFieldConfig).type === 'string'
  );
}

function isStructuredConfig(
  config: SmartFormConfig,
): config is SmartFormStructuredConfig {
  const record = config as Record<string, unknown>;

  if (!('fields' in record) || !isFieldsConfig(record['fields'])) {
    return false;
  }

  return Object.keys(record).every((key) => STRUCTURED_CONFIG_KEYS.has(key));
}

function isFieldsConfig(value: unknown): value is SmartFormFieldsConfig {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isFieldConfig);
}

/** Normalizes flat or structured config into a consistent internal shape. */
export function normalizeSmartFormConfig(
  config: SmartFormConfig,
): NormalizedSmartFormConfig {
  if (!config || typeof config !== 'object') {
    throw new SmartFormConfigError(
      'SmartFormConfig must be a non-null object.',
    );
  }

  if (isStructuredConfig(config)) {
    if (Object.keys(config.fields).length === 0) {
      throw new SmartFormConfigError(
        'SmartFormConfig.fields must contain at least one field.',
      );
    }

    validateFields(config.fields);

    return {
      fields: config.fields,
      updateOn: config.updateOn,
      submit: config.submit,
    };
  }

  const flatRecord = config as Record<string, unknown>;
  const entries = Object.entries(flatRecord);

  if (entries.length === 0) {
    throw new SmartFormConfigError(
      'SmartFormConfig must contain at least one field.',
    );
  }

  const fields: SmartFormFieldsConfig = {};

  for (const [fieldName, fieldConfig] of entries) {
    if (!isFieldConfig(fieldConfig)) {
      throw new SmartFormConfigError(
        `Field "${fieldName}" is missing a required "type" property.`,
      );
    }

    fields[fieldName] = fieldConfig;
  }

  return { fields };
}

function validateFields(fields: SmartFormFieldsConfig): void {
  for (const [fieldName, fieldConfig] of Object.entries(fields)) {
    if (!fieldConfig?.type) {
      throw new SmartFormConfigError(
        `Field "${fieldName}" is missing a required "type" property.`,
      );
    }
  }
}

/** Merges field-level validation shorthand into a single validation object. */
export function resolveFieldValidation(
  field: SmartFormFieldConfig,
): SmartFormFieldValidation {
  if (field.type === 'group' || field.type === 'array') {
    return {};
  }

  const validation: SmartFormFieldValidation = {
    ...(field.validation ?? {}),
  };

  if (field.required === true) {
    validation.required = true;
  }

  if (field.type === 'number') {
    if (field.min !== undefined && validation.min === undefined) {
      validation.min = field.min;
    }

    if (field.max !== undefined && validation.max === undefined) {
      validation.max = field.max;
    }
  }

  if (field.type === 'email' && validation.email === undefined) {
    validation.email = true;
  }

  return validation;
}

/** Resolves the initial value for a field control. */
export function resolveDefaultValue(field: SmartFormFieldConfig): unknown {
  if ('defaultValue' in field && field.defaultValue !== undefined) {
    return field.defaultValue;
  }

  switch (field.type) {
    case 'group':
      return null;
    case 'array':
      return field.defaultValue ?? [];
    case 'checkbox':
      return false;
    case 'multi-select':
      return [];
    case 'number':
      return null;
    case 'text':
    case 'email':
    case 'password':
    case 'textarea':
      return '';
    case 'select':
    case 'radio':
    case 'autocomplete':
    case 'date':
    case 'date-range':
    case 'file':
      return null;
    case 'custom':
      throw new SmartFormConfigError(
        'Field type "custom" is not yet supported by SmartFormBuilderService.',
      );
    default:
      throw new SmartFormConfigError(
        `Unsupported ngx-smart-form field type: "${(field as SmartFormFieldConfig).type}"`,
      );
  }
}
