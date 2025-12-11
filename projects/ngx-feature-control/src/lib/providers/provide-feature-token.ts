import { inject, InjectionToken, Provider, Type } from '@angular/core';
import { FeatureToken } from '../types/feature-token.type';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { getFeatureImplEntry } from '../registry/feature-registry';
import { FeatureImplEntry } from '../registry/feature-impl-entry.interface';

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
    useFactory: () => {
      const flags = inject(FeatureFlagsService);
      const def: FeatureImplEntry | undefined = getFeatureImplEntry(
        token as FeatureToken<unknown>,
      );

      if (!def) {
        throw new Error(
          `No feature implementations registered for token ${
            (token as any).name ?? token.toString()
          }`,
        );
      }

      const isOn = flags.isEnabled(def.key)();
      const Impl = (isOn ? def.enabled : def.disabled) as Type<T> | undefined;

      if (!Impl) {
        throw new Error(
          `Missing ${
            isOn ? 'enabled' : 'disabled'
          } implementation for feature ${def.key}`,
        );
      }

      return inject(Impl);
    },
  };
}
