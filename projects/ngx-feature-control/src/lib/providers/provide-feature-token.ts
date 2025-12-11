import { InjectionToken, Provider } from '@angular/core';
import { FeatureToken } from '../types/feature-token.type';
import { FeatureImplementationResolver } from '../services/feature-impl-resolver.service';

/**
 * Creates a provider for a feature token that dynamically resolves to the correct
 * implementation based on the feature flag state.
 *
 * @param token - The feature token to provide
 * @returns A provider configuration
 *
 * @throws Error if no implementations are registered for the token
 * @throws Error if the required implementation (enabled/disabled) is missing
 *
 * @example
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideFeatureToken(CheckoutService),
 *   ],
 * });
 * ```
 */
export function provideFeatureToken<T>(
  token: FeatureToken<T> | InjectionToken<T>,
): Provider {
  return {
    provide: token,
    deps: [FeatureImplementationResolver],
    useFactory: (resolver: FeatureImplementationResolver) => resolver.resolve(token),
  };
}
