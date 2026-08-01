import { formatDateForInput } from './smart-form-date.utils';

describe('formatDateForInput', () => {
  it('should return null for empty values', () => {
    expect(formatDateForInput(null)).toBeNull();
    expect(formatDateForInput('')).toBeNull();
  });

  it('should format Date objects as yyyy-MM-dd', () => {
    expect(formatDateForInput(new Date('2000-06-15T12:00:00.000Z'))).toBe('2000-06-15');
  });

  it('should trim ISO date strings to yyyy-MM-dd', () => {
    expect(formatDateForInput('2000-06-15T00:00:00.000Z')).toBe('2000-06-15');
  });

  it('should preserve short date strings', () => {
    expect(formatDateForInput('2000-06-15')).toBe('2000-06-15');
  });
});
