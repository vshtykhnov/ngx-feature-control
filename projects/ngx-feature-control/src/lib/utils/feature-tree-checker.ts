import { Feature } from "../models/feature.interface";

export class FeatureTreeChecker {
    public static checkFeatureTree(features: Feature[], featureName: string): boolean {
        const feature = features.find(f => f.name === featureName);

        if (!feature || !feature.isEnabled) {
            return false;
        }

        if (feature.dependencies && feature.dependencies.length > 0) {
            return feature.dependencies.every(dependencyName => this.checkFeatureTree(features, dependencyName));
        }

        return true;
    }
}
