import { Provider, Type, Injector, inject, effect } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';
import type { FeatureToken } from './provide-feature';

export function provideVariant<T extends object>(
  token: FeatureToken<T>,
  variants: Record<string, Type<T>>,
  defaultVariant?: string
): Provider[] {
  const variantKeys = Object.keys(variants);
  const defaultKey = (defaultVariant ?? variantKeys[0]) as string;

  return [
    ...Object.values(variants),
    {
      provide: token,
      useFactory: () => {
        const injector = inject(Injector);
        const flags = inject(FeatureFlagsService);

        const impls = Object.fromEntries(
          Object.entries(variants).map(([key, type]) => [key, injector.get(type)])
        ) as Record<string, T>;

        let currentImpl: T = impls[defaultKey];

        effect(() => {
          const variantKey = flags.getVariant(token.featureKey)() ?? defaultKey;
          currentImpl = impls[variantKey] ?? impls[defaultKey];
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
