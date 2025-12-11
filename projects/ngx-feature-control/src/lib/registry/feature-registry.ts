import { InjectionToken, Type } from '@angular/core';
import { FeatureToken } from '../types/feature-token.type';
import { FeatureState } from '../types/feature-state.type';
import { FeatureImplEntry } from './feature-impl-entry.interface';

/**
 * Global registry mapping feature tokens to their implementations.
 * Tokens are AbstractType (can be abstract classes).
 * Implementations are Type (concrete classes).
 * @internal
 */
const FEATURE_IMPL_REGISTRY = new Map<
  FeatureToken<unknown> | InjectionToken<unknown>,
  FeatureImplEntry
>();

/**
 * Registers a feature implementation for a specific state (enabled/disabled).
 *
 * @param token - The feature token (must have static featureKey property)
 * @param state - Whether this is the 'enabled' or 'disabled' implementation
 * @param impl - The implementation class
 *
 * @throws Error if token doesn't have a featureKey
 */
export function registerFeatureImpl<T>(
  token: FeatureToken<T> | InjectionToken<T>,
  state: FeatureState,
  impl: Type<T>,
): void {
  const key =
    (token as FeatureToken<T>).featureKey ??
    (() => {
      throw new Error(
        'Feature token must have static featureKey when used with FeatureImpl',
      );
    })();

  const existing = FEATURE_IMPL_REGISTRY.get(token) ?? { key };
  (existing as any)[state] = impl;
  FEATURE_IMPL_REGISTRY.set(token, existing);
}

/**
 * Retrieves the feature implementation entry for a given token.
 *
 * @param token - The feature token to look up
 * @returns The feature implementation entry, or undefined if not found
 */
export function getFeatureImplEntry(
  token: FeatureToken<unknown> | InjectionToken<unknown>,
): FeatureImplEntry | undefined {
  return FEATURE_IMPL_REGISTRY.get(token);
}
