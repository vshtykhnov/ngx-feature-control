import { Provider, EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

export function provideNgxFeature(
  defaultFlags?: Record<string, boolean | string>
): EnvironmentProviders {
  const providers: Provider[] = [];

  if (defaultFlags) {
    providers.push({
      provide: 'NGX_FEATURE_INIT',
      useFactory: () => {
        inject(FeatureFlagsService).setFlags(defaultFlags);
        return null;
      },
      multi: true,
    });
  }

  return makeEnvironmentProviders(providers);
}
