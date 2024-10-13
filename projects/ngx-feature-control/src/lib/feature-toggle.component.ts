import { Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeatureToggleService } from './feature-toggle.service';

@Component({
    selector: 'app-feature-toggle',
    template: `<ng-container #featureToggleComponent></ng-container>`,
})
export class FeatureToggleComponent implements OnInit {
    @ViewChild('featureToggleComponent', { read: ViewContainerRef, static: true })
    viewContainerRef!: ViewContainerRef;

    constructor(
        private featureToggleService: FeatureToggleService,
        private route: ActivatedRoute
    ) { }

    async ngOnInit() {
        const routeData = this.route.snapshot.data;
        const features = routeData['features'];
        let component: Type<any> | null = null;

        for (const feature of features) {
            if (this.featureToggleService.isFeatureEnabled(feature.featureFlag)) {
                component = await feature.component();
                break;
            }
        }

        if (!component) {
            component = await routeData['default']();
        }

        if (component) {
            this.viewContainerRef.createComponent(component);
        } else {
            console.error('No component found to load');
        }
    }
}
