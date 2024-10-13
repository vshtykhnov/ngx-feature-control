import { Injectable } from '@angular/core';
import { Feature } from './models/feature.interface';
import { FeatureTreeChecker } from './utils/feature-tree-checker';

@Injectable({ providedIn: 'root' })
export class FeatureToggleService {
  private features: Feature[] = [];

  public init(features: Feature[]): void {
    this.features = [...features];
  }

  public isFeatureEnabled(features: Feature[]): boolean {
    return features.every((feature: Feature) =>
      FeatureTreeChecker.checkFeatureTree(this.features, feature.name));
  }

  public areFeaturesMatching(expectedFeatures: Feature[]): boolean {
    return expectedFeatures.every((expectedFeature: Feature) => {
      if (!expectedFeature.isEnabled) {
        const feature = this.features.find(f => f.name === expectedFeature.name);
        return feature ? !feature.isEnabled : false;
      }

      return FeatureTreeChecker.checkFeatureTree(this.features, expectedFeature.name);
    });
  }

}
