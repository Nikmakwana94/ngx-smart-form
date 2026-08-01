/** Conditional expression used for visibility, enablement, and validation. */
export interface SmartFormCondition {
  /** Dot-separated path to the source field (e.g. `address.country`). */
  field: string;
  equals?: unknown;
  notEquals?: unknown;
  in?: readonly unknown[];
  notIn?: readonly unknown[];
  /** When true, the condition passes if the source value is truthy. */
  truthy?: true;
  /** When true, the condition passes if the source value is falsy. */
  falsy?: true;
}
