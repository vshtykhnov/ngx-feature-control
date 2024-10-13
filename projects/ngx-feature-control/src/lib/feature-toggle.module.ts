import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureIfDirective } from './feature-if-directive';
import { FeatureToggleService } from './feature-toggle.service';

@NgModule({
  declarations: [FeatureIfDirective],
  exports: [FeatureIfDirective],
  imports: [CommonModule],
  providers: [FeatureToggleService]
})
export class FeatureToggleModule { }