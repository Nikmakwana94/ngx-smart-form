import { FormGroup } from '@angular/forms';

import { SmartFormCondition } from '../models/condition-config';
import { getControlValueByPath } from './smart-form-path.utils';

/** Evaluates whether a SmartFormCondition passes against the current form state. */
export function evaluateCondition(
  condition: SmartFormCondition,
  form: FormGroup,
): boolean {
  const value = getControlValueByPath(form, condition.field);

  if (condition.equals !== undefined) {
    return value === condition.equals;
  }

  if (condition.notEquals !== undefined) {
    return value !== condition.notEquals;
  }

  if (condition.in !== undefined) {
    return condition.in.includes(value);
  }

  if (condition.notIn !== undefined) {
    return !condition.notIn.includes(value);
  }

  if (condition.truthy === true) {
    return !!value;
  }

  if (condition.falsy === true) {
    return !value;
  }

  return !!value;
}

/** Collects unique source field paths referenced by conditions in a field tree. */
export function collectConditionSourceFields(
  fields: Record<string, { when?: SmartFormCondition; enabledWhen?: SmartFormCondition; type?: string; fields?: Record<string, unknown> }>,
  sources = new Set<string>(),
): Set<string> {
  for (const field of Object.values(fields)) {
    if (field.when?.field) {
      sources.add(field.when.field);
    }

    if (field.enabledWhen?.field) {
      sources.add(field.enabledWhen.field);
    }

    if (field.type === 'group' && field.fields) {
      collectConditionSourceFields(
        field.fields as Record<string, { when?: SmartFormCondition; enabledWhen?: SmartFormCondition; type?: string; fields?: Record<string, unknown> }>,
        sources,
      );
    }
  }

  return sources;
}
