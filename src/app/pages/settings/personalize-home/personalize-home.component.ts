import { CommonModule, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { BreadcrumbComponent, PageTitleComponent, ToastComponent } from "@share/components";
import { SearchComponent } from "@share/components/search/search.component";
import {
  CompanyService,
  LocalService,
} from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { VideoPlayerComponent } from "@features/training/video-player/video-player.component";
import { HomeTemplateCardComponent } from "@share/components/card/home-template/home-template.component";
import { initFlowbite } from "flowbite";
import { Media } from "@lib/interfaces";
import get from "lodash/get";

@Component({
  selector: "app-personalize-home",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SearchComponent,
    BreadcrumbComponent,
    ToastComponent,
    PageTitleComponent,
    VideoPlayerComponent,
    HomeTemplateCardComponent,
  ],
  templateUrl: "./personalize-home.component.html",
})
export class PersonalizeHomeComponent {
  private destroy$ = new Subject<void>();

  @Input() list: any;

  languageChangeSubscription;
  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";
  userId: any;
  companyId: any;
  language: any;
  isloading: boolean = true;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  company: any;
  domain: any;
  isVideoTutorialsStep: boolean = true;
  isVideoTutorialsStepCompleted: boolean = false;
  isTemplateStep: boolean = false;
  isTemplateStepCompleted: boolean = false;
  isContentStep: boolean = false;
  isContentStepCompleted: boolean = false;
  isSectionsStep: boolean = false;
  isSectionsStepCompleted: boolean = false;

  playlist: Array<Media> = [
    {
      title: 'Personalizar diseño',
      src: `${environment.api}/get-course-unit-file/homeVideoFile_10277_1677186128469.mov`,
      type: 'video/mp4',
      poster: `${environment.api}/get-image-company/video-tutorials.png`
    },
    {
      title: 'Activar módulos',
      src: `${environment.api}/get-course-unit-file/homeVideoFile_10277_1677186128469.mov`,
      type: 'video/mp4',
      poster: `${environment.api}/get-image-company/video-tutorials.png`
    },
    {
      title: 'Configuración de privacidad',
      src: `${environment.api}/get-course-unit-file/homeVideoFile_10277_1677186128469.mov`,
      type: 'video/mp4',
      poster: `${environment.api}/get-image-company/video-tutorials.png`
    },
    {
      title: 'Configuración del menú',
      src: `${environment.api}/get-course-unit-file/homeVideoFile_10277_1677186128469.mov`,
      type: 'video/mp4',
      poster: `${environment.api}/get-image-company/video-tutorials.png`
    }
  ];
  homeTemplates: any = [];
  activeLayoutId: any;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {}

  async ngOnInit() {
    this.language =
      this._localService.getLocalStorage(environment.lslanguage) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
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
      this.company = company[0];
      this.companyId = company[0].id;
      this.domain = company[0].domain;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
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
    initFlowbite();
    this.initializeBreadcrumb();
    this.initializeHomeTemplates();
  }

  initializeBreadcrumb() {
    this.level1Title = this._translateService.instant(
      "company-settings.settings"
    );
    this.level2Title = this._translateService.instant(
      "company-settings.personalizehometemplate"
    );
  }

  initializeHomeTemplates() {
    this.homeTemplates.push(
      {
        id: 1,
        name: `${this._translateService.instant('leads.layout')} 1`,
        image: `${environment.api}/get-image-company/home_template_1.png`,
        active: this.company?.predefined_template_id == 1 ? true : false,
      },
      {
        id: 2,
        name: `${this._translateService.instant('leads.layout')} 2`,
        image: `${environment.api}/get-image-company/home_template_2.png`,
        active: this.company?.predefined_template_id == 2 ? true : false
      },
      {
        id: 3,
        name: `${this._translateService.instant('leads.layout')} 3`,
        image: `${environment.api}/get-image-company/home_template_3.png`,
        active: !this.company?.predefined_template_id && !this.company?.predefined_template ? true : false
      }
    );
    this.activeLayoutId = this.company?.predefined_template_id == 1 ? 1 : (
      this.company?.predefined_template_id == 2 ? 2 : (
        (!this.company?.predefined_template_id && !this.company?.predefined_template) ? 3 : 0
      )
    )
  }

  goToTemplateStep() {
    this.isVideoTutorialsStep = false;
    this.isVideoTutorialsStepCompleted = true;
    this.isTemplateStep = true;
  }

  goToContentStep() {
    this.isTemplateStep = false;
    this.isTemplateStepCompleted = true;
    this.isContentStep = true;
  }

  goToSectionsStep() {
    this.isContentStep = false;
    this.isContentStepCompleted = true;
    this.isSectionsStep = true;
  }

  finish() {
    this.isSectionsStepCompleted = true;
    setTimeout(() => {
      this._location.back();
    }, 1000)
  }

  handleGoBack() {
    this._location.back();
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