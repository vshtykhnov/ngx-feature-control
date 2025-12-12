import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { FeatureFlagsService } from '../services/feature-flags.service';

export function featureMatch(
  key: string,
  opts?: { redirectTo?: string }
): CanMatchFn {
  return (): boolean | UrlTree => {
    const on = inject(FeatureFlagsService).isEnabled(key)();
    if (on) return true;

    const redirectTo = opts?.redirectTo;
    return redirectTo ? inject(Router).parseUrl(redirectTo) : false;
  };
}
