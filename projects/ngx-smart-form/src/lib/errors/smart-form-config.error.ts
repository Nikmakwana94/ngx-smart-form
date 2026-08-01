/** Thrown when a SmartFormConfig or field configuration is invalid. */
export class SmartFormConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SmartFormConfigError';
  }
}
