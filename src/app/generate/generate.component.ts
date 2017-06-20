import {Component, OnInit} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';
import {NgForm} from '@angular/forms';
declare var saveAs: any;

@Component({
    selector: 'app-generate',
    templateUrl: './generate.component.html',
    styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

    public apiURL: any;
    public errorText: string;

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.apiURL = 'api/generate-project';
    }

    public generate(form: NgForm) {
        if (form.valid) {
            const projectName = form.value.projectName;
            const year = new Date().getFullYear();
            this.giveUserProject({
                firebaseConfig: form.value.firebaseConfig,
                author: form.value.author,
                year: year,
                projectName: projectName,
                // projectNameCamelCase: this.toTitleCase(projectName),
                // projectNameKebabCase: this.toKebabCase(projectName),
                projectDescription: form.value.projectDescription
            });
            form.resetForm();
            this.errorText = 'Successfully generated ' + projectName + '! Check the project\'s README.md for next steps';
        } else {
            this.errorText = 'Enter all the required information';
        }

    }

    private giveUserProject(config) {
        this.getProject(config)
            .subscribe(res => {
                saveAs(res, this.toKebabCase(config.projectName) + '.zip');
                // const fileURL = URL.createObjectURL(res);
                // window.open(fileURL);
            });
    }

    private getProject(config) {
        return this.http.post(this.apiURL, config,
            {responseType: ResponseContentType.Blob})
            .map((res) => {
                return new Blob([res.blob()], {type: 'application/zip'});
            });
    }

    private toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }).replace(/\s/g, '');
    }

    private toKebabCase(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

}
