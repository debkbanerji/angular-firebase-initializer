import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';


import {AppComponent} from './app.component';
import {HomePageComponent} from './home-page/home-page.component';
import {GenerateComponent} from './generate/generate.component';

const routes: Routes = [ // Array of all routes - modify when adding routes
    {path: '', component: HomePageComponent, pathMatch: 'full' }, // Default route
    {path: 'generate', component: GenerateComponent, pathMatch: 'full' }
];
//
// declare var saveAs: any;
//
// let fileSaver = saveAs;

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        GenerateComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
