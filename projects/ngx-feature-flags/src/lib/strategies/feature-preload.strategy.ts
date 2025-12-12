import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FeatureFlagsService } from '../services/feature-flags.service';

@Injectable({ providedIn: 'root' })
export class FeaturePreloadStrategy implements PreloadingStrategy {
  constructor(private flags: FeatureFlagsService) {}

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const key = route.data?.['featureKey'] as string | undefined;
    
    // Если нет ключа — можно либо не прелоадить (текущий вариант),
    // либо прелоадить всегда (вернуть load())
    if (!key) {
      return of(null);
    }

    // Проверяем флаг и решаем, загружать ли модуль
    return this.flags.isEnabled(key)() ? load() : of(null);
  }
}
