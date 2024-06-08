import { CommonModule, NgOptimizedImage, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { environment } from "@env/environment";
import { CoursesService } from "@features/services";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";
import { LocalService, CompanyService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { initFlowbite } from "flowbite";
import { COURSE_IMAGE_URL } from "@lib/api-constants";
import get from "lodash/get";

@Component({
    selector: 'app-course-intro',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        NgOptimizedImage,
    ],
    templateUrl: './intro.component.html'
})
export class CourseIntroComponent {
    private destroy$ = new Subject<void>();

    @Input() id!: number;

    language: any;
    userId: any;
    companyId: any;
    companies: any;
    primaryColor: any;
    buttonColor: any;
    hoverColor: any;
    emailDomain: any;
    languageChangeSubscription: any;
    courseData: any;
    course: any;
    courseTitle: any;
    courseDescription: any;
    courseImage: any;
    courseDurationUnitTitle: any;
    courseDifficulty: any;

    constructor(
        private _router: Router,
        private _coursesService: CoursesService,
        private _companyService: CompanyService,
        private _translateService: TranslateService,
        private _localService: LocalService,
    ) { }

    async ngOnInit() {
        initFlowbite();
        this.language = this._localService.getLocalStorage(environment.lslang) || "es";
        this._translateService.use(this.language || "es");

        this.userId = this._localService.getLocalStorage(environment.lsuserId);
        this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
        this.companies = this._localService.getLocalStorage(environment.lscompanies)
            ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
            : "";
        if (!this.companies) {
            this.companies = get(
                await this._companyService.getCompanies().toPromise(),
                "companies"
            );
        }
        let company = this._companyService.getCompany(this.companies);
        if (company && company[0]) {
            this.companyId = company[0];
            this.emailDomain = company[0].domain;
            this.companyId = company[0].id;
            this.primaryColor = company[0].primary_color;
            this.buttonColor = company[0].button_color
                ? company[0].button_color
                : company[0].primary_color;
            this.hoverColor = company[0].hover_color
                ? company[0].hover_color
                : company[0].primary_color;
        }

        this.languageChangeSubscription =
            this._translateService.onLangChange.subscribe(
                (event: LangChangeEvent) => {
                    this.language = event.lang;
                    this.initializePage();
                }
            );

        this.fetchCourseDetails();
    }

    initializePage() {
        this.formatCourse(this.courseData?.course);
    }

    fetchCourseDetails() {
        this._coursesService
          .fetchCourseCombined(this.id, this.companyId, this.userId)
          .subscribe(
            (data) => {
              let course_data =  data[0] ? data[0] : [];
              this.courseData = course_data; // data?.course;
              this.initializePage();
            },
            (error) => {
              console.log(error);
            }
          );
    }

    formatCourse(data) {
        this.course = data;
        this.courseTitle = this.getCourseTitle(this.course);
        this.courseDescription = this.getCourseDescription(this.course);
        this.courseImage = `${COURSE_IMAGE_URL}/${this.course?.image}`;
        this.courseDurationUnitTitle = this.getCourseDurationUnitTitle(this.course);
        this.courseDifficulty = this.getDifficultyLevelTitle(this.course);
    }

    getCourseTitle(course) {
        return this.language == "en"
          ? course.title_en
            ? course.title_en || course.title
            : course.title
          : this.language == "fr"
          ? course.title_fr
            ? course.title_fr || course.title
            : course.title
          : this.language == "eu"
          ? course.title_eu
            ? course.title_eu || course.title
            : course.title
          : this.language == "ca"
          ? course.title_ca
            ? course.title_ca || course.title
            : course.title
          : this.language == "de"
          ? course.title_de
            ? course.title_de || course.title
            : course.title
          : this.language == "it"
          ? course.title_it
            ? course.title_it || course.title
            : course.title
          : course.title;
    }

    getCourseDescription(course) {
        return this.language == "en"
          ? course.description_en
            ? course.title_en || course.description
            : course.description
          : this.language == "fr"
          ? course.title_fr
            ? course.title_fr || course.description
            : course.description
          : this.language == "eu"
          ? course.title_eu
            ? course.title_eu || course.description
            : course.description
          : this.language == "ca"
          ? course.title_ca
            ? course.title_ca || course.description
            : course.description
          : this.language == "de"
          ? course.title_de
            ? course.title_de || course.description
            : course.description
          : this.language == "it"
          ? course.title_it
            ? course.title_it || course.description
            : course.description
          : course.description;
    }

    getCourseDurationUnitTitle(course) {
        return this.language == 'en' ? course.duration_unit_en : (this.language == 'fr' ? course.duration_unit_fr : 
          (this.language == 'eu' ? course.duration_unit_eu : (this.language == 'ca' ? course.duration_unit_ca : 
          (this.language == 'de' ? course.duration_unit_de : (this.language == 'it' ? course.duration_unit_it : course.duration_unit_es)
          )))
        )
    }

    getDifficultyLevelTitle(course) {
        return this.language == 'en' ? course.difficulty : (this.language == 'fr' ? course.difficulty_fr : 
          (this.language == 'eu' ? course.difficulty_eu : (this.language == 'ca' ? course.difficulty_ca : 
          (this.language == 'de' ? course.difficulty_de : (this.language == 'it' ? course.difficulty_it : course.difficulty_es)
          )))
        )
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}