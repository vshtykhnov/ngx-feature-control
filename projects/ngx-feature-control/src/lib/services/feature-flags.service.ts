import { Injectable, computed, signal } from '@angular/core';

/**
 * Service for managing feature flags state.
 * Provides reactive access to feature flags using Angular signals.
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly _flags = signal<Record<string, boolean>>({});

  /**
   * Returns a computed signal that indicates whether a feature is enabled.
   * @param key - The feature key to check
   * @returns A computed signal returning true if the feature is enabled, false otherwise
   */
  isEnabled(key: string) {
    return computed(() => !!this._flags()[key]);
  }

  /**
   * Sets the entire feature flags configuration.
   * Replaces all existing flags with the provided ones.
   * @param flags - Record of feature keys and their enabled/disabled state
   */
  setFlags(flags: Record<string, boolean>): void {
    this._flags.set(flags);
  }

  /**
   * Partially updates feature flags.
   * Merges provided flags with existing ones.
   * @param flags - Partial record of feature keys to update
   */
  patchFlags(flags: Partial<Record<string, boolean>>): void {
    this._flags.update(prev => ({ ...prev, ...flags } as Record<string, boolean>));
  }
}
