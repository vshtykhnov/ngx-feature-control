import { Injectable, InjectionToken, Type } from '@angular/core';
import { FeatureToken } from '../types/feature-token.type';
import { FeatureState } from '../types/feature-state.type';
import { registerFeatureImpl } from '../registry/feature-registry';

/**
 * Configuration for the FeatureImpl decorator.
 */
export interface FeatureImplConfig<T> {
  /**
   * The feature token this implementation belongs to
   */
  token: FeatureToken<T> | InjectionToken<T>;

  /**
   * The state this implementation represents ('enabled' or 'disabled')
   */
  state: FeatureState;

  /**
   * Determines which injectors will provide the injectable.
   * - 'root': Application-level injector in most apps
   * - 'platform': Special singleton platform injector shared by all applications
   * - 'any': Provides a unique instance in each lazy loaded module
   * - Type<any>: Associates the injectable with a specific NgModule
   */
  providedIn?: Type<any> | 'root' | 'platform' | 'any' | null;
}

/**
 * Decorator to mark a class as a feature implementation.
 * Automatically makes the class injectable and registers it in the feature registry.
 *
 * @param config - Configuration specifying the token, state, and optional providedIn scope
 *
 * @example
 * ```typescript
 * @FeatureImpl({
 *   token: CheckoutService,
 *   state: 'enabled',
 *   providedIn: 'root'
 * })
 * export class NewCheckoutService implements CheckoutService {
 *   async checkout() {
 *     console.log('New checkout flow');
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Without providedIn (requires manual provider registration)
 * @FeatureImpl({
 *   token: CheckoutService,
 *   state: 'disabled'
 * })
 * export class OldCheckoutService implements CheckoutService {
 *   async checkout() {
 *     console.log('Old checkout flow');
 *   }
 * }
 * ```
 */
export function FeatureImpl<T>(config: FeatureImplConfig<T>): ClassDecorator {
  return (target: any) => {
    // Make the class injectable with optional providedIn scope
    Injectable(config.providedIn ? { providedIn: config.providedIn } : undefined)(target);

    // Register the implementation in the feature registry
    registerFeatureImpl(config.token, config.state, target as Type<T>);
  };
}
