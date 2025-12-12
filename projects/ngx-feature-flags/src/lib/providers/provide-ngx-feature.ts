import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

export const DEFAULT_FEATURE_FLAGS =
  new InjectionToken<Record<string, boolean | string>>('DEFAULT_FEATURE_FLAGS');

export function provideNgxFeature(
  defaultFlags?: Record<string, boolean | string>
): EnvironmentProviders {
  return makeEnvironmentProviders([
    ...(defaultFlags ? [{ provide: DEFAULT_FEATURE_FLAGS, useValue: defaultFlags }] : []),

    provideEnvironmentInitializer(() => {
      const flags = inject(FeatureFlagsService);
      const defaults =
        defaultFlags ?? inject(DEFAULT_FEATURE_FLAGS, { optional: true }) ?? {};
      flags.setFlags(defaults as Record<string, boolean>);
    }),
  ]);
}
