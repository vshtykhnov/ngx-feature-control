import {
  Directive,
  effect,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

/**
 * Structural directive that conditionally includes a template based on a feature flag.
 *
 * @example
 * ```html
 * <button *appFeatureIf="'checkout.new'">
 *   New Checkout
 * </button>
 * ```
 */
@Directive({
  selector: '[appFeatureIf]',
  standalone: true,
})
export class FeatureIfDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly flags = inject(FeatureFlagsService);

  /**
   * The feature key to check. When the feature is enabled, the template is rendered.
   */
  @Input({ alias: 'appFeatureIf' })
  set feature(key: string) {
    effect(() => {
      this.vcr.clear();
      if (this.flags.isEnabled(key)()) {
        this.vcr.createEmbeddedView(this.tpl);
      }
    });
  }
}
