import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureFlagsService } from '../services/feature-flags.service';
import { firstValueFrom } from 'rxjs';

export function provideFeatureHttpLoader(url: string): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(async () => {
      const http = inject(HttpClient);
      const flags = inject(FeatureFlagsService);

      const remote = await firstValueFrom(http.get<Record<string, boolean | string>>(url));
      flags.patchFlags(remote);
    }),
  ]);
}
