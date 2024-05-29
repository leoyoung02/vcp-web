import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService, LocalService } from '@share/services';
import { Subject, takeUntil } from 'rxjs';
import { EditorModule } from "@tinymce/tinymce-angular";
import { environment } from '@env/environment';
import { BuddyService } from '@features/services';
import { initFlowbite } from "flowbite";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PageTitleComponent } from '@share/components';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import get from 'lodash/get';

@Component({
    selector: 'app-mentor-request',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        NgOptimizedImage,
        FormsModule,
        ReactiveFormsModule,
        EditorModule,
        MatSnackBarModule,
        FontAwesomeModule,
        PageTitleComponent,
    ],
    templateUrl: './mentor-request.component.html'
})
export class MentorRequestComponent {
    private destroy$ = new Subject<void>();

    languageChangeSubscription;
    user: any;
    email: any;
    language: any;
    companyId: any = 0;
    companies: any;
    domain: any;
    pageTitle: any;
    features: any;

    primaryColor: any;
    buttonColor: any;
    hoverColor: any;
    userId: any;
    subfeatures: any;
    superAdmin: boolean = false;
    pageName: any;
    pageDescription: any;
    showSectionTitleDivider: boolean = false;
    isMobile: boolean = false;
    buddyFeature: any;
    featureId: any;

    form: any;
    me: any;
    hasRequest: boolean = false;
    approvedRequest: boolean = false;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _buddyService: BuddyService,
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
    ) { }

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    async ngOnInit() {
        this.onResize();
        initFlowbite();

        this.email = this._localService.getLocalStorage(environment.lsemail);
        this.userId = this._localService.getLocalStorage(environment.lsuserId);
        this.companyId = this._localService.getLocalStorage(
            environment.lscompanyId
        );
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");
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
            this.domain = company[0].domain;
            this.companyId = company[0].id;
            this.primaryColor = company[0].primary_color;
            this.buttonColor = company[0].button_color
                ? company[0].button_color
                : company[0].primary_color;
            this.hoverColor = company[0].hover_color
                ? company[0].hover_color
                : company[0].primary_color;
            this.showSectionTitleDivider = company[0].show_section_title_divider;
            this._localService.setLocalStorage(
                environment.lscompanyId,
                this.companyId
            );
        }

        this.languageChangeSubscription =
            this._translateService.onLangChange.subscribe(
                (event: LangChangeEvent) => {
                    this.language = event.lang;
                    this.initializePage();
                }
            );

        this.initializePage();
    }

    initializePage() {
        this.pageTitle = this._translateService.instant("buddy.applyasmentor");
        this.initializeForm();
    }

    initializeForm() {
        this.form = this.fb.group({
            first_name: ["", Validators.required],
            last_name: ["", Validators.required],
            major: new FormControl('', [Validators.required]),
            location: new FormControl('', [Validators.required]),
            language: new FormControl('', [Validators.required]),
            message: new FormControl('', [Validators.required]),
        });

        this.loadMentorRequestData();
    }

    loadMentorRequestData() {
        this._buddyService
          .fetchMentorRequestData(this.userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (data) => {
                this.initializeProfile(data);
            },
            (error) => {
              console.log(error);
            }
        );
    }

    initializeProfile(data) {
        this.me = data?.mentor;
        this.form.get('first_name').setValue(this.me?.first_name);
        this.form.get('last_name').setValue(this.me?.last_name);
        this.form.get('location').setValue(this.me?.location);
        this.form.get('major').setValue(this.me?.major);
        this.form.get('language').setValue(this.me?.language);
        this.form.get('message').setValue(this.me?.message);

        this.hasRequest = this.me?.created_at ? true : false;
        this.approvedRequest = this.me?.approved == 1 ? true : false;
    }

    submit() {
        let params = {
            company_id: this.companyId,
            user_id: this.userId,
            first_name: this.form.get('first_name').value,
            last_name: this.form.get('last_name').value,
            major: this.form.get('major').value,
            location: this.form.get('location').value,
            language: this.form.get('language').value,
            message: this.form.get('message').value,
        }
        this._buddyService.applyMentor(params).subscribe(
            res => {
                this.hasRequest = true;
                this.open(this._translateService.instant('dialog.savedsuccessfully'), '')
            },
            error => {
                console.log(error)
                this.open(this._translateService.instant('dialog.error'), '')
        })
    }

    async open(message: string, action: string) {
        await this._snackBar.open(message, action, {
          duration: 3000,
          panelClass: ["info-snackbar"],
        });
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}