
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

### Handling Dependencies

If a feature depends on another feature, it won't be active unless all its dependencies are active.

```typescript
const features = [
  { name: 'featureA', isEnabled: true, dependencies: ['featureB'] }, // featureA depends on featureB
  { name: 'featureB', isEnabled: false } // featureB is disabled
];
```

In this case, even though `featureA` is enabled, it will not be active because `featureB`, its dependency, is disabled.

### Example with Dependencies

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example-dependencies',
  template: `
    <div *appFeatureIf="['featureA']">
      This section is visible only if 'featureA' is enabled and all its dependencies are also enabled.
    </div>
  `
})
export class ExampleDependenciesComponent {
  public featureToggleData = [
    { name: 'featureA', isEnabled: true, dependencies: ['featureB'] }, // featureA depends on featureB
    { name: 'featureB', isEnabled: false } // featureB is disabled
  ];
}
```

### Example without Dependencies

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example-no-dependencies',
  template: `
    <div *appFeatureIf="['featureA']">
      This section is visible because 'featureA' is enabled and has no dependencies.
    </div>
  `
})
export class ExampleNoDependenciesComponent {
  public featureToggleData = [
    { name: 'featureA', isEnabled: true }, // featureA is enabled
    { name: 'featureB', isEnabled: false } // featureB is disabled, but does not affect featureA
  ];
}
```

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
