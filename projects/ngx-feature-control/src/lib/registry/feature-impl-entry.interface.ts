import { Type } from '@angular/core';

/**
 * Registry entry for a feature implementation.
 * Stores both enabled and disabled implementations for a feature.
 */
export interface FeatureImplEntry {
  /**
   * The feature key identifier
   */
  key: string;

  /**
   * Implementation class to use when feature is enabled
   */
  enabled?: Type<unknown>;

  /**
   * Implementation class to use when feature is disabled
   */
  disabled?: Type<unknown>;
}
