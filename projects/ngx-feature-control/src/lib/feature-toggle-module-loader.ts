import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, LoadChildrenCallback, Router } from '@angular/router';
import { FeatureToggleService } from './feature-toggle.service';

@Component({
    selector: 'app-feature-toggle-module-loader',
    template: `<router-outlet></router-outlet>`,
})
export class FeatureToggleModuleLoader implements OnInit {

    constructor(
        private featureToggleService: FeatureToggleService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    async ngOnInit() {
        const routeData = this.route.snapshot.data;
        const features = routeData['features'];
        let module: LoadChildrenCallback | undefined = undefined;

        for (const feature of features) {
            if (this.featureToggleService.isFeatureEnabled(feature.featureFlag)) {
                module = feature.module;
                break;
            }
        }

        if (!module) {
            module = routeData['default'];
        }

        if (module) {
            const currentUrl = this.route.snapshot.url.map(segment => segment.path).join('/');

            this.router.resetConfig([{ path: currentUrl, loadChildren: module }]);
            this.router.navigateByUrl(currentUrl);
        } else {
            console.error('No module found to load.');
        }
    }
}
