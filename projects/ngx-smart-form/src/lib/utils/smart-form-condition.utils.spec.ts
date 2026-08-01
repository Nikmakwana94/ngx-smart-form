import { FormControl, FormGroup } from '@angular/forms';

import { SmartFormCondition } from '../models/condition-config';
import { evaluateCondition } from './smart-form-condition.utils';

describe('evaluateCondition', () => {
  let form: FormGroup;

  beforeEach(() => {
    form = new FormGroup({
      accountType: new FormControl('individual'),
      role: new FormControl('admin'),
      active: new FormControl(true),
      address: new FormGroup({
        country: new FormControl('IN'),
      }),
    });
  });

  function condition(partial: SmartFormCondition): SmartFormCondition {
    return partial;
  }

  it('should support equals', () => {
    expect(
      evaluateCondition(condition({ field: 'accountType', equals: 'company' }), form),
    ).toBeFalse();
    form.get('accountType')?.setValue('company');
    expect(
      evaluateCondition(condition({ field: 'accountType', equals: 'company' }), form),
    ).toBeTrue();
  });

  it('should support notEquals', () => {
    expect(
      evaluateCondition(condition({ field: 'accountType', notEquals: 'company' }), form),
    ).toBeTrue();
  });

  it('should support in', () => {
    expect(
      evaluateCondition(condition({ field: 'role', in: ['admin', 'manager'] }), form),
    ).toBeTrue();
    expect(
      evaluateCondition(condition({ field: 'role', in: ['guest'] }), form),
    ).toBeFalse();
  });

  it('should support notIn', () => {
    expect(
      evaluateCondition(condition({ field: 'role', notIn: ['guest'] }), form),
    ).toBeTrue();
  });

  it('should support truthy', () => {
    expect(evaluateCondition(condition({ field: 'active', truthy: true }), form)).toBeTrue();
    form.get('active')?.setValue(false);
    expect(evaluateCondition(condition({ field: 'active', truthy: true }), form)).toBeFalse();
  });

  it('should support falsy', () => {
    form.get('active')?.setValue(false);
    expect(evaluateCondition(condition({ field: 'active', falsy: true }), form)).toBeTrue();
  });

  it('should support nested field paths', () => {
    expect(
      evaluateCondition(condition({ field: 'address.country', equals: 'IN' }), form),
    ).toBeTrue();
  });
});
