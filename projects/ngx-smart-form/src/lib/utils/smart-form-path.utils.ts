import { AbstractControl, FormGroup } from '@angular/forms';

/** Resolves a dot-separated control path against a root FormGroup. */
export function resolveControlByPath(
  root: FormGroup,
  path: string,
): AbstractControl | null {
  if (!path) {
    return root;
  }

  const segments = path.split('.');
  let current: AbstractControl | null = root;

  for (const segment of segments) {
    if (!current) {
      return null;
    }

    current = current.get(segment);
  }

  return current;
}

/** Reads a control value using a dot-separated path. */
export function getControlValueByPath(root: FormGroup, path: string): unknown {
  return resolveControlByPath(root, path)?.value;
}

/** Joins parent and child path segments. */
export function joinFieldPath(parentPath: string, key: string): string {
  return parentPath ? `${parentPath}.${key}` : key;
}

/** Converts a field path into a stable DOM id suffix. */
export function fieldPathToId(path: string): string {
  return path.replace(/\./g, '-');
}
