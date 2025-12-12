import { Injectable, computed, signal } from '@angular/core';

/**
 * Сервис для управления feature flags
 *
 * Использование:
 *   flags.setFlags({ 'payment.new-flow': true });
 *   flags.patchFlags({ 'payment.new-flow': false });
 *   flags.isEnabled('payment.new-flow')(); // reactive
 */
@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private readonly _flags = signal<Record<string, boolean>>({});

  /**
   * Возвращает реактивный сигнал для конкретного флага
   */
  isEnabled(key: string) {
    return computed(() => !!this._flags()[key]);
  }

  /**
   * Заменяет все флаги
   */
  setFlags(flags: Record<string, boolean>): void {
    this._flags.set(flags);
  }

  /**
   * Обновляет флаги частично (merge)
   */
  patchFlags(flags: Partial<Record<string, boolean>>): void {
    this._flags.update(curr => ({ ...curr, ...flags } as Record<string, boolean>));
  }

  /**
   * Получить текущее значение флага (не реактивно)
   */
  getFlag(key: string): boolean {
    return !!this._flags()[key];
  }

  /**
   * Получить все флаги
   */
  getAllFlags(): Record<string, boolean> {
    return this._flags();
  }
}
