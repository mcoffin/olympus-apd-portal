import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
    selector: 'apd-portal',
    template: '<h1>Olympus APD Portal</h1>'
})
export class ApdPortalComponent {
    title = "Olympus APD Portal";
}

@NgModule({
    imports: [ BrowserModule ],
    declarations: [ ApdPortalComponent ],
    bootstrap: [ ApdPortalComponent ]
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
