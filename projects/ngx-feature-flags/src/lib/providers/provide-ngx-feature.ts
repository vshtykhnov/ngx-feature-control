import { Provider, EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

/**
 * Настраивает ngx-feature систему с опциональными дефолтными флагами
 *
 * Использование:
 *   provideNgxFeature() // без флагов
 *   provideNgxFeature({ 'payment.new-flow': false }) // с дефолтными флагами
 */
export function provideNgxFeature(
  defaultFlags?: Record<string, boolean>
): EnvironmentProviders {
  const providers: Provider[] = [];

  // Если переданы дефолтные флаги, инициализируем их
  if (defaultFlags) {
    providers.push({
      provide: 'NGX_FEATURE_INIT',
      useFactory: () => {
        const flags = inject(FeatureFlagsService);
        flags.setFlags(defaultFlags);
        return null;
      },
      multi: true,
    });
  }

  return makeEnvironmentProviders(providers);
}
