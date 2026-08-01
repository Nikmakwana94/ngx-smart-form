import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SmartFormConfig } from '../models';
import { SmartFormBuilderService } from '../services/smart-form-builder.service';

/**
 * Root smart form component.
 * Builds a Reactive FormGroup from configuration. Visual field rendering is planned for a future release.
 */
@Component({
  selector: 'ngx-smart-form',
  imports: [ReactiveFormsModule],
  template: `
    <div class="ngx-smart-form" data-testid="ngx-smart-form">
      @if (formGroup(); as form) {
        <form [formGroup]="form" class="ngx-smart-form__form">
          <p class="ngx-smart-form__placeholder">
            Reactive form ready ({{ controlCount() }} controls). Visual rendering coming soon.
          </p>
        </form>
      }
    </div>
  `,
  styles: `
    .ngx-smart-form__placeholder {
      margin: 0;
      font: inherit;
    }
  `,
})
export class NgxSmartFormComponent {
  private readonly builder = inject(SmartFormBuilderService);

  /** Form configuration object. Supports flat or structured `{ fields }` shape. */
  readonly config = input<SmartFormConfig | null>(null);

  /** Emitted when a FormGroup has been built from the current configuration. */
  readonly formReady = output<FormGroup>();

  /** The internally built FormGroup, available after configuration is provided. */
  readonly formGroup = signal<FormGroup | null>(null);

  constructor() {
    effect(() => {
      const config = this.config();

      if (!config) {
        this.formGroup.set(null);
        return;
      }

      const form = this.builder.buildForm(config);
      this.formGroup.set(form);
      this.formReady.emit(form);
    });
  }

  /** Number of controls in the built form, for placeholder diagnostics. */
  controlCount(): number {
    return Object.keys(this.formGroup()?.controls ?? {}).length;
  }
}
