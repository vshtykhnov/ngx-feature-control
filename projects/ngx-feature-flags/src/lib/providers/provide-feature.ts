import { Provider, Type, Injector, inject, AbstractType, isDevMode, effect } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

export type FeatureToken<T> = (AbstractType<T> | Type<T>) & { featureKey: string };

export function provideFeature<T extends object>(
  token: FeatureToken<T>,
  impls: { enabled: Type<T>; disabled: Type<T> }
): Provider[] {
  return [
    impls.enabled,
    impls.disabled,
    {
      provide: token,
      useFactory: () => {
      const injector = inject(Injector);
      const flags = inject(FeatureFlagsService);
      const featureKey = token.featureKey;

      const enabledImpl = injector.get(impls.enabled);
      const disabledImpl = injector.get(impls.disabled);

      let currentImpl: T = disabledImpl;

      effect(() => {
        const isEnabled = flags.isEnabled(featureKey)();
        currentImpl = isEnabled ? enabledImpl : disabledImpl;

        if (isDevMode()) {
          const implName = isEnabled ? impls.enabled.name : impls.disabled.name;
          console.log(`[FeatureFlag] ${token.name || featureKey} -> ${implName} (${isEnabled ? 'enabled' : 'disabled'})`);
        }
      });

      return new Proxy({} as T, {
        get(_target, prop) {
          const value = Reflect.get(currentImpl, prop, currentImpl);
          if (typeof value === 'function') {
            return value.bind(currentImpl);
          }
          return value;
        },
        set(_target, prop, value) {
          return Reflect.set(currentImpl, prop, value, currentImpl);
        },
      });
      },
    },
  ];
}
