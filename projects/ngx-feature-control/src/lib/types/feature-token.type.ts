import { AbstractType } from '@angular/core';

/**
 * Metadata interface for feature tokens.
 * Defines the required featureKey property.
 */
export interface FeatureTokenMeta {
  featureKey: string;
}

/**
 * Type representing a feature token.
 * Combines Angular's AbstractType with feature metadata.
 * Use abstract classes as feature tokens.
 *
 * @example
 * ```typescript
 * export abstract class CheckoutService {
 *   static readonly featureKey = 'checkout.new';
 *   abstract checkout(): Promise<void>;
 * }
 * ```
 */
export type FeatureToken<T> = AbstractType<T> & FeatureTokenMeta;
