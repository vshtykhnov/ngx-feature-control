
# ngx-feature-control

**ngx-feature-control** — a module for Angular that simplifies managing feature toggles. It allows you to enable/disable features and manage dependencies between them.

## Features

- Simple management of feature states (enabled/disabled).
- Support for dependencies between features.
- Easy integration with Angular components and routes.
- Provides a flexible directive to conditionally render components based on feature states.

## Installation

To install ngx-feature-control, run:

```bash
npm install ngx-feature-control --save
```

## Setup

Add `FeatureToggleModule` to your app's module:

```typescript
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FeatureToggleModule, FeatureToggleService } from 'ngx-feature-control';

export function initializeFeatures(featureToggleService: FeatureToggleService) {
  return () => {
    const features = [
      { name: 'featureA', isEnabled: true },
      { name: 'featureB', isEnabled: false },
      { name: 'featureC', isEnabled: true, dependencies: ['featureA'] }
    ];
    featureToggleService.init(features);  // Initialize features during app startup
  };
}

@NgModule({
  imports: [
    FeatureToggleModule,
    // other modules
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFeatures,
      deps: [FeatureToggleService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Usage

### Using in Components

You can use the `*appFeatureIf` directive to conditionally render elements based on feature states:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <div *appFeatureIf="['featureA', '!featureB']">
      This section is visible if 'featureA' is enabled and 'featureB' is disabled.
    </div>
  `
})
export class ExampleComponent {
  public featureToggleData = {
    featureA: true,
    featureB: false,
  };
}
```

### Using Feature Toggles in Lazy Loaded Routes

You can use feature toggles to conditionally load components based on feature states in lazy-loaded routes:

```typescript
import { Routes } from '@angular/router';
import { FeatureToggleComponent } from 'ngx-feature-control';

export const routes: Routes = [
    {
        path: 'business',
        component: FeatureToggleComponent,
        data: {
            features: [
                {
                    featureFlag: 'business',
                    component: () => import('./modules/business/business.component').then(m => m.BusinessComponent),
                },
                {
                    featureFlag: 'contacts',
                    component: () => import('./modules/contacts/contacts.component').then(m => m.ContactsComponent),
                }
            ],
            default: () => import('./modules/business/business.component').then(m => m.BusinessComponent),
        }
    },
];
```

In this example, the `FeatureToggleComponent` is used to dynamically load the appropriate component based on the feature flag provided in the `data`. If a feature flag is enabled, the corresponding component is loaded lazily. If no feature flag matches, a default component is loaded.

## Development

### Run locally

You can run the project locally by using:

```bash
npm start
```

### Running tests

To run the tests, use:

```bash
npm test
```

## Contributions

Any contribution is welcome. Please check out `CONTRIBUTING.md` for instructions.
