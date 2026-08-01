import { SmartFormFieldType } from '../../models/field-types';

/** Field types supported by the Phase 2 visual renderer. */
export const RENDERABLE_FIELD_TYPES = [
  'text',
  'email',
  'number',
  'textarea',
] as const satisfies readonly SmartFormFieldType[];

export type RenderableFieldType = (typeof RENDERABLE_FIELD_TYPES)[number];

/** Returns true when the field type has a visual renderer in the current phase. */
export function isRenderableFieldType(
  type: SmartFormFieldType,
): type is RenderableFieldType {
  return (RENDERABLE_FIELD_TYPES as readonly string[]).includes(type);
}
