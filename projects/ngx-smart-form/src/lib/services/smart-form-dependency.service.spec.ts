import { SmartFormBuilderService } from './smart-form-builder.service';
import { SmartFormDependencyService } from './smart-form-dependency.service';

describe('SmartFormDependencyService', () => {
  let service: SmartFormDependencyService;
  let builder: SmartFormBuilderService;

  beforeEach(() => {
    service = new SmartFormDependencyService();
    builder = new SmartFormBuilderService();
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should hide and disable fields when when condition fails', () => {
    const form = builder.buildForm({
      accountType: { type: 'text', defaultValue: 'individual' },
      companyName: {
        type: 'text',
        when: { field: 'accountType', equals: 'company' },
        validation: { required: true },
      },
    });

    service.connect(form, {
      accountType: { type: 'text' },
      companyName: {
        type: 'text',
        when: { field: 'accountType', equals: 'company' },
        validation: { required: true },
      },
    });

    expect(service.isVisible('companyName')).toBeFalse();
    expect(form.get('companyName')?.disabled).toBeTrue();
    expect(form.valid).toBeTrue();
  });

  it('should show and enable fields when when condition passes', () => {
    const form = builder.buildForm({
      accountType: { type: 'text', defaultValue: 'company' },
      companyName: {
        type: 'text',
        when: { field: 'accountType', equals: 'company' },
        validation: { required: true },
      },
    });

    service.connect(form, {
      accountType: { type: 'text' },
      companyName: {
        type: 'text',
        when: { field: 'accountType', equals: 'company' },
        validation: { required: true },
      },
    });

    expect(service.isVisible('companyName')).toBeTrue();
    expect(form.get('companyName')?.enabled).toBeTrue();
    expect(form.valid).toBeFalse();
  });

  it('should disable fields when enabledWhen fails', () => {
    const form = builder.buildForm({
      accountType: { type: 'text', defaultValue: 'individual' },
      companyName: { type: 'text', defaultValue: 'Acme' },
    });

    service.connect(form, {
      accountType: { type: 'text' },
      companyName: {
        type: 'text',
        enabledWhen: { field: 'accountType', equals: 'company' },
      },
    });

    expect(service.isVisible('companyName')).toBeTrue();
    expect(form.get('companyName')?.disabled).toBeTrue();
  });

  it('should evaluate nested condition paths', () => {
    const form = builder.buildForm({
      address: {
        type: 'group',
        fields: {
          country: { type: 'text', defaultValue: 'US' },
        },
      },
      region: { type: 'text' },
    });

    service.connect(form, {
      address: {
        type: 'group',
        fields: {
          country: { type: 'text' },
        },
      },
      region: {
        type: 'text',
        when: { field: 'address.country', equals: 'IN' },
      },
    });

    expect(service.isVisible('region')).toBeFalse();

    form.get('address.country')?.setValue('IN');

    expect(service.isVisible('region')).toBeTrue();
  });

  it('should clean up subscriptions on disconnect', () => {
    const form = builder.buildForm({
      accountType: { type: 'text', defaultValue: 'individual' },
      companyName: { type: 'text' },
    });

    const cleanup = service.connect(form, {
      accountType: { type: 'text' },
      companyName: {
        type: 'text',
        when: { field: 'accountType', equals: 'company' },
      },
    });

    expect(service.isVisible('companyName')).toBeFalse();
    expect(form.get('companyName')?.disabled).toBeTrue();

    cleanup();
    form.get('accountType')?.setValue('company');

    expect(form.get('companyName')?.disabled).toBeTrue();
  });

  it('should disable statically hidden fields without removing controls', () => {
    const form = builder.buildForm({
      shownField: { type: 'text' },
      hiddenField: { type: 'text', hidden: true },
    });

    service.connect(form, {
      shownField: { type: 'text' },
      hiddenField: { type: 'text', hidden: true },
    });

    expect(form.get('hiddenField')).toBeTruthy();
    expect(service.isVisible('hiddenField')).toBeFalse();
    expect(form.get('hiddenField')?.disabled).toBeTrue();
    expect(form.valid).toBeTrue();
  });
});
