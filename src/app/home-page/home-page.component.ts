import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
    private ANGULAR_LOGO_URL: string;
    private FIREBASE_LOGO_URL: string;

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
