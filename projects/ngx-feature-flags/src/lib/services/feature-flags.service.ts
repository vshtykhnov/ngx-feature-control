import { Injectable, computed, signal } from '@angular/core';

type FlagValue = boolean | string;

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly _flags = signal<Record<string, FlagValue>>({});

  isEnabled(key: string) {
    return computed(() => !!this._flags()[key]);
  }

  getVariant(key: string) {
    return computed(() => {
      const value = this._flags()[key];
      return typeof value === 'string' ? value : null;
    });
  }

  setFlags(flags: Record<string, FlagValue>): void {
    this._flags.set(flags);
  }

  patchFlags(flags: Partial<Record<string, FlagValue>>): void {
    this._flags.update(curr => ({ ...curr, ...flags } as Record<string, FlagValue>));
  }

  getFlag(key: string): FlagValue | undefined {
    return this._flags()[key];
  }

  getAllFlags(): Record<string, FlagValue> {
    return this._flags();
  }
}
