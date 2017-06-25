import {Component, OnInit} from '@angular/core';
import {Http, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/map';
import {NgForm} from '@angular/forms';
declare let saveAs: any;

@Component({
    selector: 'app-generate',
    templateUrl: './generate.component.html',
    styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

    private apiURL: any;
    public DOWN_ARROW_URL: string;
    public errorText: string;
    public colors: any;

    constructor(private http: Http) {
    }

    ngOnInit() {
        this.apiURL = 'api/generate-project';
        this.DOWN_ARROW_URL = '/assets/images/down_arrow.png';
        this.colors = [
            {
                code: "#d9534f",
                name: "Red"
            },
            {
                code: "#ff5722",
                name: "Orange"
            },
            {
                code: "#5bc0de",
                name: "Light Blue"
            },
            {
                code: "#428bca",
                name: "Dark Blue"
            },
            {
                code: "#5cb85c",
                name: "Green"
            },
            {
                code: "#64dd17",
                name: "Lime Green"
            },
            {
                code: "#00897b",
                name: "Teal"
            },
            {
                code: "#ef4581",
                name: "Pink"
            },
            {
                code: "#783393",
                name: "Purple"
            },
            {
                code: "#757575",
                name: "Grey"
            },
            {
                code: "#fcd837",
                name: "Yellow"
            }
        ];
    }

    public generate(form: NgForm) {
        if (form.valid) {
            const projectName = form.value.projectName;
            const year = new Date().getFullYear();
            // let projectColor;
            // if (!form.value.projectColor || form.value.projectColor === "") {
            //     projectColor = "#f55549"
            // } else {
            //     form.value.projectColor = projectColor;
            // }
            this.giveUserProject({
                firebaseConfig: form.value.firebaseConfig,
                author: form.value.author,
                year: year,
                projectName: projectName,
                // projectNameCamelCase: this.toTitleCase(projectName),
                // projectNameKebabCase: this.toKebabCase(projectName),
                projectDescription: form.value.projectDescription,
                projectColor: form.value.projectColor
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
