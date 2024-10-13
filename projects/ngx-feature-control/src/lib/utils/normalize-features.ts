import { Feature } from '../models/feature.interface';

export function normalizeFeatures(features: string[]): Feature[] {
    return features.map(name => ({ name: name.replace('!', ''), isEnabled: !name.startsWith('!') }));
}
