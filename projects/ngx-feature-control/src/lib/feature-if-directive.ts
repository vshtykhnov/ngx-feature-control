import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FeatureToggleService } from './feature-toggle.service';
import { Feature } from './models/feature.interface';
import { normalizeFeatures } from './utils/normalize-features';

@Directive({ selector: '[appFeatureIf]' })
export class FeatureIfDirective {
  @Input() public set appFeatureIf(features: string[] | string) {
    const featureArray = Array.isArray(features) ? features : [features];
    const normalizedFeatures: Feature[] = normalizeFeatures(featureArray);
    const isFeatureEnabled = this._featureToggleService.areFeaturesMatching(normalizedFeatures);

    if (isFeatureEnabled) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

  constructor(
    private _templateRef: TemplateRef<unknown>,
    private _viewContainer: ViewContainerRef,
    private _featureToggleService: FeatureToggleService
  ) { }
}
