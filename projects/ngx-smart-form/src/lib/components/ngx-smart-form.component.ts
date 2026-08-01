import { Component, input } from '@angular/core';

import { SmartFormConfig } from '../models';

/**
 * Root smart form component.
 * Dynamic rendering and Reactive Forms integration are planned for a future release.
 */
@Component({
  selector: 'ngx-smart-form',
  imports: [],
  template: `
    <div class="ngx-smart-form" data-testid="ngx-smart-form">
      @if (config()) {
        <p class="ngx-smart-form__placeholder">
          ngx-smart-form is initialized. Dynamic rendering coming soon.
        </p>
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
  /** Form configuration object keyed by field name. */
  readonly config = input<SmartFormConfig | null>(null);
}
