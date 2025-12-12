import { Directive, effect, inject, Input, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

type FeatureInput =
  | string
  | { key: string; equals: string }
  | { key: string; in: string[] };

@Directive({
  selector: '[feature]',
  standalone: true,
})
export class FeatureDirective {
  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly flags = inject(FeatureFlagsService);
  private readonly condition = signal<FeatureInput | null>(null);

  constructor() {
    effect(() => {
      const input = this.condition();
      this.vcr.clear();
      
      if (input && this.checkCondition(input)) {
        this.vcr.createEmbeddedView(this.tpl);
      }
    });
  }

  @Input({ alias: 'feature' })
  set featureCondition(input: FeatureInput) {
    this.condition.set(input);
  }

  private checkCondition(input: FeatureInput): boolean {
    if (typeof input === 'string') {
      return this.flags.isEnabled(input)();
    }

    if ('equals' in input) {
      const variant = this.flags.getVariant(input.key)();
      return variant === input.equals;
    }

    if ('in' in input) {
      const variant = this.flags.getVariant(input.key)();
      return variant !== null && input.in.includes(variant);
    }

    return false;
  }
}
