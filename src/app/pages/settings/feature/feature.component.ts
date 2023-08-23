import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@share/components';
import { CompanyService, LocalService } from '@share/services';
import get from "lodash/get";
import { Subject } from 'rxjs';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        BreadcrumbComponent
    ],
    templateUrl: './feature.component.html',
})

export class FeatureComponent {
    private destroy$ = new Subject<void>();
    
    id: any;
    level1Title: any;
    level2Title: any;
    level3Title: any;
    level4Title: any;
    buttonColor: any;
    companyId: any;
    companyDomain: any;
    primaryColor: any;
    companies: any;
    userId: any;
    language: any;
    featureTitle: any;
    isInitialLoad: boolean = false;
    languageChangeSubscription;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _location: Location,
    ) {}

    async ngOnInit() {
        this.userId = this._localService.getLocalStorage(environment.lsuserId)
        this.companyId = this._localService.getLocalStorage(environment.lscompanyId)
        this.language = this._localService.getLocalStorage(environment.lslang)
        this._translateService.use(this.language || 'es')

       this.companies = this._localService.getLocalStorage(environment.lscompanies) ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies)) : ''
        if(!this.companies) { this.companies = get(await this._companyService.getCompanies().toPromise(), 'companies') }
        let company = this._companyService.getCompany(this.companies)
        if(company && company[0]) {
            this.companyId = company[0].id
            this.companyDomain = company[0].domain
            this.primaryColor = company[0].primary_color
            this.buttonColor = company[0].button_color ? company[0].button_color : company[0].primary_color
        }

        this._route.paramMap.subscribe(params => {
            this.id = params.get('id')
            this.initializeFeature()
        })

        this.languageChangeSubscription =
            this._translateService.onLangChange.subscribe(
                (event: LangChangeEvent) => {
                this.language = event.lang;
                    this.rerenderList();
                }
            );
    }

    rerenderList() {
        if (!this.isInitialLoad) {
          this.initializeFeature();
        }
    }

    initializeFeature() {
        let companyFeatures = this._localService.getLocalStorage(environment.lsfeatures) ? JSON.parse(this._localService.getLocalStorage(environment.lsfeatures)) : ''
        if(companyFeatures?.length > 0) {
            let feature_row = companyFeatures.filter(f => {
                return f.id == this.id
            })
            let feature = feature_row?.length > 0 ? feature_row[0] : {}
            this.featureTitle = feature ? (this.language == 'en' ? 
            (feature.name_en ? feature.name_en : feature.feature_name) : 
                (this.language == 'fr' ? (feature.name_fr ? feature.name_fr : feature.feature_name) :
                    (feature.name_es ? feature.name_es : feature.feature_name_ES)
                )
            ) : ''
        }
        this.initializeBreadcrumb();
        this.isInitialLoad = false;
    }

    initializeBreadcrumb() {
        this.level1Title = this._translateService.instant('company-settings.settings')
        this.level2Title = this._translateService.instant('company-settings.personalization')
        this.level3Title = this._translateService.instant('company-settings.modules')
        this.level4Title = this.featureTitle
    }

    handleGoBack() {
        this._location.back()
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}