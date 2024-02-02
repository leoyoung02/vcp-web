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
import { EmailEditorModule } from '../../../external/email-editor/src/lib/email-editor.module';
import { EmailEditorComponent } from 'email-editor';
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
    EmailEditorModule,
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
  title: string = '';
  description: string = '';
  
  predefinedTemplate: any;
  hasProfileHomeContent: boolean = false;
  profileHomeContentSetting: any = [];
  sectionOptions: any = [];
  user: any;
  customMemberTypeId: any;

  templates: any;
  template: any;
  source : any = "";
  html : any = "";
  body : any = "";
  css : any = ""; 
  source_es : any = "";
  html_es : any = "";
  body_es : any = "";
  css_es : any = "";
  source_eu : any = "";
  html_eu : any = "";
  body_eu : any = "";
  css_eu : any = "";
  source_fr : any = "";
  html_fr : any = "";
  body_fr : any = "";
  css_fr : any = "";
  source_de : any = "";
  html_de : any = "";
  body_de : any = "";
  css_de : any = "";
  source_ca : any = "";
  html_ca : any = "";
  body_ca : any = "";
  css_ca : any = "";
  @ViewChild('editor', {static: false})
  private emailEditor: EmailEditorComponent | undefined

  features: any = [];
  includedFeatures: any = [];
  modulesOrder: any = [];
  homePersonalizeSettings: any;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {}

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslanguage) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.user = this._localService.getLocalStorage(environment.lsuser);
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
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
    this.getCompanyFeatures();
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
    this.initializeSettings();
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
    this.getLandingTemplates();
  }

  initializeSettings() {
    this.getSettingsTitle();
  }

  getSettingsTitle() {
    this._companyService
    .getCategorySetting(4)
    .subscribe(
        response => {
            this.sectionOptions = response['section_options']
            if(this.sectionOptions && this.sectionOptions?.length > 0){
                this.getSetttingSectionOptions()
            }
        },
        error => {
            console.log(error);
        }
    )
  }

  getSetttingSectionOptions() {
    if(this.sectionOptions){
     let option = this.sectionOptions.filter(f => {
        return f.title_en == 'Allow different content based on profile'
     })
     if(option && option?.length > 0){
        this.profileHomeContentSetting = option[0]
        this.getOtherSettingsSectionOptionContent(this.profileHomeContentSetting.id, this.profileHomeContentSetting.section_id)
     }
    }
  }

  async getOtherSettingsSectionOptionContent(option_id, section_id) {
    await this._companyService.getOtherSettingsSectionOptionContent(option_id, section_id, this.companyId)
    .subscribe(
        async response => {
            let optionContent: any[] = []
            optionContent.push(response['option_content']);
            optionContent?.forEach(oc => {
                if(this.profileHomeContentSetting['id'] == oc['option_id'] && this.profileHomeContentSetting['section_id'] == oc['section_id']){
                    this.hasProfileHomeContent = oc.active ? true : false
                }
            })
            if(this.company?.predefined_template_id > 0) {
              this.getPredefinedTemplate(this.company?.predefined_template_id);
            }
        }
    )
  }

  getPredefinedTemplate(id) {
    this._companyService.getHomeTemplate(id, this.companyId).subscribe(
      (response) => {
        if (
          this.hasProfileHomeContent &&
          response.home_template_mapping &&
          response.home_template_mapping?.length > 1
        ) {
          let preDefinedTemplate = response.home_template_mapping;
          this.predefinedTemplate = response.home_template_mapping?.filter(
            (tmp) => {
              this.customMemberTypeId = this.user?.custom_member_type_id || 0;
              if (tmp.custom_member_type_id == this.customMemberTypeId) {
                if (tmp.has_title && !tmp.video_title) {
                  tmp.video_title =
                    preDefinedTemplate?.length > 0
                      ? preDefinedTemplate[0].video_title
                      : "";
                }
                if (!tmp.video_description) {
                  tmp.video_description =
                    preDefinedTemplate?.length > 0
                      ? preDefinedTemplate[0].video_description
                      : "";
                }
                if (tmp.has_video && !tmp.video_file) {
                  tmp.video_file =
                    preDefinedTemplate?.length > 0
                      ? preDefinedTemplate[0].video_file
                      : "";
                }
              }
              return tmp.custom_member_type_id == this.customMemberTypeId;
            }
          );
        } else {
          this.predefinedTemplate = response.home_template_mapping?.filter(
            (tmp) => {
              return !tmp.custom_member_type_id;
            }
          );
        }
        this.predefinedTemplate = this.predefinedTemplate?.length > 0 ? this.predefinedTemplate[0] : "";
        this.title = this.predefinedTemplate?.video_title || "";
        this.description = this.predefinedTemplate?.video_description || "";
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async getLandingTemplates() {
    this._companyService.getLandingTemplates(this.companyId)
      .subscribe(
        async (response) => {
          this.templates = response.templates;
          if(this.templates?.length > 0) {
            let template = this.templates?.filter(temp => {
              return temp.status == 1
            })
            this.template = template?.length > 0 ? template[0] : {};
            if(this.template?.id > 0) {
              this.loadContent();
            }
          }
        },
        error => {
            console.log(error)
        }
      )
  }

  editorLoaded(event) {
    this.loadContent();
  }

  loadContent() {
    if(this.template?.id > 0) {
        this._companyService.getLandingTemplate(this.template?.id, this.companyId)
        .subscribe(
            async (response) => {
                this.template = response.template
                if(response.template) {
                  this.source = this.template.source
                  this.source_es = this.template.source_es
                  this.source_eu = this.template.source_eu
                  this.source_fr = this.template.source_fr
                  this.source_de = this.template.source_de
                  this.source_ca = this.template.source_ca

                  this.body = this.template.body
                  this.body_es = this.template.body_es
                  this.body_eu = this.template.body_eu
                  this.body_fr = this.template.body_fr
                  this.body_de = this.template.body_de
                  this.body_ca = this.template.body_ca

                  this.css = this.template.css
                  this.css_es = this.template.css_es
                  this.css_eu = this.template.css_eu
                  this.css_fr = this.template.css_fr
                  this.css_de = this.template.css_de
                  this.css_ca = this.template.css_ca

                  this.html = this.template.html
                  this.html_es = this.template.html_es
                  this.html_eu = this.template.html_eu
                  this.html_fr = this.template.html_fr
                  this.html_de = this.template.html_de
                  this.html_ca = this.template.html_ca
                }
                this.setContent()
            },
            error => {
                console.log(error)
            }
        )
    }
  }

  setContent() {
    if(this.language == 'es') {
      if(this.template.source_es) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source_es))
      }
    } else if(this.language == 'fr') {
      if(this.template.source_fr) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source_fr))
      }
    } if(this.language == 'en') {
      if(this.template.source) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source))
      }
    }if(this.language == 'eu') {
      if(this.template.source_eu) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source_eu))
      }
    }if(this.language == 'de') {
      if(this.template.source_de) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source_de))
      }
    }if(this.language == 'ca') {
      if(this.template.source_ca) {
        this.emailEditor?.editor.loadDesign(JSON.parse(this.source_ca))
      }
    }
  }

  getCompanyFeatures() {
    this.modulesOrder = [
      {
        id: 1,
        value: 'latest',
        text: this._translateService.instant('personalize-home.latest')
      },
      {
        id: 2,
        value: 'random',
        text: this._translateService.instant('personalize-home.random')
      }
    ]
    this._companyService
      .getHomePersonalizeSettings(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          let companyFeatures: any = [] 
          companyFeatures = response['features'];
          companyFeatures = companyFeatures?.filter((f) => {
            return f.id != 22 && f.status == 1;
          });
          this.formatFeatures(companyFeatures);
          this.homePersonalizeSettings = response['settings'];
        },
        (error) => {
          console.log(error);
        }
      );
  }

  formatFeatures(features) {
    features = features?.map((item) => {
        return {
            ...item,
            checked: false,
            id: item?.id,
            title: this.getFeatureTitle(item),
            order: 'latest'
        };
    });
    if(features?.length > 0) {
      features = features.sort((a, b) => {
        return a.sequence - a.sequence;
      });
    }

    this.features = features;
  }

  getFeatureTitle(feature) {
    return feature
      ? this.language == "en"
        ? feature.name_es ||
          feature.feature_name_es
        : this.language == "fr"
        ? feature.name_fr ||
          feature.feature_name_es
        : this.language == "eu"
        ? feature.name_eu ||
          feature.feature_name_es
        : this.language == "ca"
        ? feature.name_ca ||
          feature.feature_name_es
        : this.language == "de"
        ? feature.de ||
          feature.name_es
        : feature.name_es
      : "";
  }

  goToTemplateStep() {
    this.isVideoTutorialsStep = false;
    this.isVideoTutorialsStepCompleted = true;
    this.isTemplateStep = true;
  }

  goToContentStep() {
    this.isTemplateStep = false;
    this.isTemplateStepCompleted = true;
    
    if(this.activeLayoutId != 1) {  
      this.isContentStep = true;
    } else {
      this.goToSectionsStep();
    }
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

  saveContentTitleDescription() {

  }

  saveContentEditor() {

  }

  handleModuleChecked(feature) {
    console.log(this.features)
    this.updateFeatures();
  }

  updateFeatures() {
    this.includedFeatures = this.features?.filter(f => {
      return f.checked
    })
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