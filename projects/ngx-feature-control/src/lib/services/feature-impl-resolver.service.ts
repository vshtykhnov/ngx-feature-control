import { Injectable, Injector, InjectionToken, Type } from '@angular/core';
import { FeatureToken } from '../types/feature-token.type';
import { FeatureFlagsService } from './feature-flags.service';
import { FeatureImplEntry } from '../registry/feature-impl-entry.interface';
import { getFeatureImplEntry } from '../registry/feature-registry';

@Injectable({ providedIn: 'root' })
export class FeatureImplementationResolver {
  constructor(
    private readonly injector: Injector,
    private readonly flags: FeatureFlagsService,
  ) {}

  resolve<T>(token: FeatureToken<T> | InjectionToken<T>): T {
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

    const isOn = this.flags.isEnabled(def.key)();
    const Impl = (isOn ? def.enabled : def.disabled) as Type<T> | undefined;

    if (!Impl) {
      throw new Error(
        `Missing ${isOn ? 'enabled' : 'disabled'} implementation for feature ${
          def.key
        }`,
      );
    }

    return this.injector.get(Impl);
  }
}
