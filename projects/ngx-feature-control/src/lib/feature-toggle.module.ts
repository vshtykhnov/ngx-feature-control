import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureIfDirective } from './feature-if-directive';
import { FeatureToggleComponentLoader } from './feature-toggle-component-loader';
import { FeatureToggleModuleLoader } from './feature-toggle-module-loader';
import { FeatureToggleService } from './feature-toggle.service';

@NgModule({
  declarations: [
    FeatureIfDirective,
    FeatureToggleModuleLoader,
    FeatureToggleComponentLoader
  ],
  exports: [FeatureIfDirective],
  imports: [CommonModule, RouterModule],
  providers: [FeatureToggleService]
})
export class FeatureToggleModule { }