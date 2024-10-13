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
            const currentRoute = this.router.config.find(route => route.path === currentUrl && route.component === FeatureToggleModuleLoader);

            if (currentRoute) {
                const updatedRoute = { ...currentRoute, loadChildren: module, component: undefined };
                this.router.resetConfig(this.router.config.map(route => route === currentRoute ? updatedRoute : route));
                this.router.navigateByUrl(currentUrl, { skipLocationChange: true });
            } else {
                console.error('No matching route found to modify.');
            }
        } else {
            console.error('No module found to load.');
        }
    }
}
