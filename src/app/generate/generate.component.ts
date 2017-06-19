import {Component, OnInit} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';
declare var saveAs: any;

@Component({
    selector: 'app-generate',
    templateUrl: './generate.component.html',
    styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

    // private author: string;
    // private projectName: string;
    // private projectDescription: string;
    // private firebaseConfig: any;
    public apiURL: any;


    constructor(private http: Http) {
    }

    ngOnInit() {
        this.apiURL = 'api/project';
    }

    public generate(f) {
        this.giveUserProject({
           projectName: 'my-second-project'
        });
    }

    private giveUserProject(config) {
        const fileName = config.projectName;
        console.log(fileName);
        this.getProject(config)
            .subscribe(res => {
                saveAs(res, fileName + '.zip');
                // const fileURL = URL.createObjectURL(res);
                // window.open(fileURL);
            });
    }

    private getProject(config) {
        return this.http.get(this.apiURL,
            {responseType: ResponseContentType.Blob})
            .map((res) => {
                return new Blob([res.blob()], {type: 'application/zip'});
            });
    }

}
