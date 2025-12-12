import { Provider, Type, Injector, inject, AbstractType, effect } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

export type FeatureToken<T> = (AbstractType<T> | Type<T>) & { readonly featureKey: string };

export function provideFeature<T extends object, E extends T = T, D extends T = T>(
  token: FeatureToken<T>,
  impls: { enabled: Type<E>; disabled: Type<D> }
): Provider[] {
  return [
    impls.enabled,
    impls.disabled,
    {
      provide: token,
      useFactory: () => {
        const injector = inject(Injector);
        const flags = inject(FeatureFlagsService);
        const enabledImpl = injector.get(impls.enabled);
        const disabledImpl = injector.get(impls.disabled);

        let currentImpl: T = disabledImpl;

        effect(() => {
          currentImpl = flags.isEnabled(token.featureKey)() ? enabledImpl : disabledImpl;
        });

        return new Proxy({} as T, {
          get(_target, prop) {
            const value = Reflect.get(currentImpl, prop, currentImpl);
            return typeof value === 'function' ? value.bind(currentImpl) : value;
          },
          set(_target, prop, value) {
            return Reflect.set(currentImpl, prop, value, currentImpl);
          },
        });
      },
    },
  ];
}
