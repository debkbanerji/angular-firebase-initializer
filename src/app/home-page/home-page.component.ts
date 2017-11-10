import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
    public ANGULAR_LOGO_URL: string;
    public FIREBASE_LOGO_URL: string;
    public platformName = '{{templyte}}';

    constructor(private router: Router) {

    }

    ngOnInit() {
        this.ANGULAR_LOGO_URL = '/assets/images/angular_logo.png';
        this.FIREBASE_LOGO_URL = '/assets/images/firebase_logo.png';
    }

    public navigateTo(route) {
        this.router.navigate([route]);
    }
}
