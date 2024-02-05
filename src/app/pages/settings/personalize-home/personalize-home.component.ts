import { CommonModule, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild, ChangeDetectorRef } from "@angular/core";
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
  UserService,
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

import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilepondPluginImagePreview, FilepondPluginImageEdit, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

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
    FilePondModule,
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

  playlist: Array<Media> = [];
  homeTemplates: any = [];
  activeLayoutId: any;

  videoFileName: any
  videoFile: any
  selectedVideoOption: any = 'Self-hosted'
  externalLink: any = ''
  videoFormSubmitted: boolean = false
  videoOptions = ['YouTube', 'Vimeo', 'External', 'Self-hosted']
  @ViewChild('myPond', {static: false}) myPond: any;
  pondOptions = {
      class: 'my-filepond',
      multiple: false,
      labelIdle: 'Arrastra y suelta tu archivo o <span class="filepond--label-action" style="color:#00f;text-decoration:underline;"> Navegar </span><div><small style="color:#006999;font-size:12px;">*Subir archivo</small></div>',
      labelFileProcessing: "En curso",
      labelFileProcessingComplete: "Carga completa",
      labelFileProcessingAborted: "Carga cancelada",
      labelFileProcessingError: "Error durante la carga",
      labelTapToCancel: "toque para cancelar",
      labelTapToRetry: "toca para reintentar",
      labelTapToUndo: "toque para deshacer",
      acceptedFileTypes: 'video/mp4',
      server: {
        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          const formData = new FormData();
          let fileExtension = file ? file.name.split('.').pop() : '';
          this.videoFileName = 'homeVideoFile_' + this.userId + '_' + this.getTimestamp() + '.' + fileExtension;
          formData.append('file', file, this.videoFileName);
          localStorage.setItem('home_video_file', 'uploading');
  
          const request = new XMLHttpRequest();
          request.open('POST', environment.api + '/company/course/temp-upload');
  
          request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };
  
          request.onload = function () {
              if (request.status >= 200 && request.status < 300) {
                load(request.responseText);
                localStorage.setItem('home_video_file', 'complete');
              } else {
                error('oh no');
              }
          };
  
          request.send(formData);
  
          return {
            abort: () => {
              request.abort();
              abort();
            },
          };
        },
      },
  };
  pondFiles = [];
  title: string = '';
  description: string = '';
  
  predefinedTemplate: any;
  hasProfileHomeContent: boolean = false;
  profileHomeContentSetting: any = [];
  sectionOptions: any = [];
  user: any;
  customMemberTypeId: any;
  customMemberType: any = [];
  selectedProfile: any = '';
  profileHomeContent: any = [];

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
  activatedTemplate: boolean = false;
  homeVideoPlaylist: Array<Media> = [];
  homeTemplate: any;
  showVideo: boolean = false
  showTitle: boolean = false
  videoTitle: any
  videoDescription: any
  templateVideoFile: any
  showCourses: boolean = false
  showEvents: boolean = false

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private cd: ChangeDetectorRef
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
    this.initializeTemplates();
    this.getLandingTemplates();
  }

  initializeTemplates() {
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

  getCustomMemberTypes(member_types) {
    this.customMemberType = member_types;
    this.profileHomeContent.push({
      id: 0,
      type: 'General',
      type_en: '',
      type_fr: '',
      type_de: '',
      type_eu: '',
      type_ca: '',
      video_title: this.videoTitle,
      video_description: this.videoDescription,
      video_file: this.templateVideoFile,
      selected_video_option: this.selectedVideoOption,
      has_courses: 0,
      has_events: 0
    })
    this.customMemberType?.forEach(cmt => {
      this.profileHomeContent.push({
        id: cmt.id,
        type: cmt.type,
        type_en: cmt.type_en,
        type_fr: cmt.type_fr,
        type_de: cmt.type_de,
        type_eu: cmt.type_eu,
        type_ca: cmt.type_ca,
        video_title: '',
        video_description: '',
        video_file: '',
        selected_video_option: '',
        has_courses: 0,
        has_events: 0
      })
    })
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

        if(this.predefinedTemplate?.has_video && this.predefinedTemplate?.video_file) {
          this.homeVideoPlaylist = [
            {
              title: this.title,
              src: `${environment.api}/get-course-unit-file/${this.predefinedTemplate?.video_file}`,
              type: 'video/mp4',
              poster: `${environment.api}/get-image-company/video-tutorials.png`
            },
          ];
        }
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
          this.formatFeatures(companyFeatures, response['settings']);
          this.homePersonalizeSettings = response['settings'];
          this.initializeVideoTutorials(this.homePersonalizeSettings);
          this.getCustomMemberTypes(response['member_types']);
          this.initializeHomeTemplate(response['template'], response['home_template_mapping']);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializeVideoTutorials(settings) {
    if(settings?.videos?.length > 0) {
      settings?.videos.forEach(video => {
        this.playlist.push({
          title: video?.title,
          src: `${environment.api}/get-course-unit-file/${video?.video}`,
          type: 'video/mp4',
          poster: `${environment.api}/get-image-company/${video?.poster}`
        })
      })
    }
  }

  initializeHomeTemplate(template, home_template_mapping) {
    this.homeTemplate = (home_template_mapping)?.filter(tmp => {
      return !tmp.custom_member_type_id
    })
    this.homeTemplate = this.homeTemplate[0]

    let custom_member_template = (home_template_mapping)?.filter(tmp => {
      return tmp.custom_member_type_id
    })

    this.profileHomeContent?.forEach(phc => {
      if(custom_member_template?.title) {
        let cmt = custom_member_template
        if(phc.id == cmt.custom_member_type_id){
          phc.video_title = cmt.video_title
          phc.video_description = cmt.video_description
          phc.video_file = cmt.video_file,
          phc.has_courses = cmt.has_courses ? 1 : 0,
          phc.has_events = cmt.has_events ? 1 : 0
        }

        if(phc.video_file) {
          if(phc.video_file.indexOf('.mp4') >= 0) {
            phc.selected_video_option = 'Self-hosted'
          } else if(phc.video_file.indexOf('youtube') >= 0) {
            phc.selected_video_option = 'YouTube'
          } else if(phc.video_file.indexOf('vimeo') >= 0) {
            phc.selected_video_option = 'Vimeo'
          } else {
            phc.selected_video_option = 'External'
          }
        }
      } else {
        custom_member_template?.forEach(cmt => {
          if(phc.id == cmt.custom_member_type_id){
            phc.video_title = cmt.video_title
            phc.video_description = cmt.video_description
            phc.video_file = cmt.video_file,
            phc.has_courses = cmt.has_courses ? 1 : 0,
            phc.has_events = cmt.has_events ? 1 : 0
          }

          if(phc.video_file) {
            if(phc.video_file.indexOf('.mp4') >= 0) {
              phc.selected_video_option = 'Self-hosted'
            } else if(phc.video_file.indexOf('youtube') >= 0) {
              phc.selected_video_option = 'YouTube'
            } else if(phc.video_file.indexOf('vimeo') >= 0) {
              phc.selected_video_option = 'Vimeo'
            } else {
              phc.selected_video_option = 'External'
            }
          }
        })
      }
      
    })

    if(this.homeTemplate) {
        this.showTitle = this.homeTemplate.has_title == 1 ? true : false
        this.showVideo = this.homeTemplate.has_video == 1 ? true : false
        this.showCourses = this.homeTemplate.has_courses == 1 ? true : false
        this.showEvents = this.homeTemplate.has_events == 1 ? true : false
        this.videoTitle = this.homeTemplate.video_title
        this.videoDescription = this.homeTemplate.video_description
        this.templateVideoFile = this.homeTemplate.video_file
        this.profileHomeContent[0].video_title = this.homeTemplate.video_title
        this.profileHomeContent[0].video_description = this.homeTemplate.video_description
        this.profileHomeContent[0].video_file = this.homeTemplate.video_file
        this.profileHomeContent[0].has_title = this.homeTemplate.has_title
        this.profileHomeContent[0].has_video = this.homeTemplate.has_video
        this.profileHomeContent[0].has_courses = this.homeTemplate.has_courses
        this.profileHomeContent[0].has_events = this.homeTemplate.has_events


        if(this.homeTemplate.video_file) {
            if(this.homeTemplate.video_file.indexOf('.mp4') >= 0) {
                this.selectedVideoOption = 'Self-hosted'
            } else if(this.homeTemplate.video_file.indexOf('youtube') >= 0) {
                this.selectedVideoOption = 'YouTube'
                this.externalLink = this.homeTemplate.video_file
            } else if(this.homeTemplate.video_file.indexOf('vimeo') >= 0) {
                this.selectedVideoOption = 'Vimeo'
                this.externalLink = this.homeTemplate.video_file
            } else {
                this.selectedVideoOption = 'External'
                this.externalLink = this.homeTemplate.video_file
            }
            this.profileHomeContent[0].selected_video_option = this.selectedVideoOption
        }
    }
  }

  formatFeatures(features, settings) {
    features = features?.map((item) => {
      let activated_section = settings?.modules?.find(f => f.module_id == item?.id);
      return {
        ...item,
        checked: activated_section ? true : false,
        id: item?.id,
        title: this.getFeatureTitle(item),
        order: activated_section ? activated_section?.module_order : 'latest'
      };
    });
    if(features?.length > 0) {
      features = features.sort((a, b) => {
        return a.sequence - a.sequence;
      });
    }

    this.features = features;
    this.formatSections()
  }

  formatSections() {
    let activatedFeatures = this.features?.filter(feature => {
      return feature.checked
    })

    this.includedFeatures = activatedFeatures;
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

  public getTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();
    return timestamp;
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  } 

  saveContentTitleDescription() {
    let video_file_status = localStorage.getItem('home_video_file');
    let video_file = video_file_status == 'complete' ? this.videoFileName : '';

    let params = {
      id: 2,
      custom_member_type_id: this.selectedProfile || 0,
      company_id: this.companyId,
      video_title: this.hasProfileHomeContent ? this.profileHomeContent[0].video_title : (this.title || this.videoTitle),
      video_description: this.hasProfileHomeContent ? this.profileHomeContent[0].video_description : (this.description || this.videoDescription),
      video_file: (video_file || this.externalLink) || this.videoFile,
      profile_content: this.hasProfileHomeContent ? this.profileHomeContent : '',
      has_video: this.template?.has_video,
      has_title: this.template?.has_title
    }

    this._companyService.updateHomeVideoSettings(
        params,
      ).subscribe(
        response => {
            localStorage.removeItem('home_video_file');
            this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
            this.refreshCompanies('content');
        },
        error => {
            this.open(this._translateService.instant('dialog.error'), '')
        }
    )
  }

  saveContentEditor() {
    this.emailEditor?.exportHtml((data) => {
      let params
      const source = JSON.stringify(data['design']);
      const html = data['html'];
      const body = data['chunks']['body'];
      const css = data['chunks']['css'];
      if(this.language == "en"){
        this.source = source
        this.body = body
        this.html = html
        this.css = css
      } else if(this.language == "es"){
        this.source_es = source
        this.body_es = body
        this.html_es = html
        this.css_es = css
      } else if(this.language == "eu"){
        this.source_eu = source
        this.body_eu = body
        this.html_eu = html
        this.css_eu = css
      } else if(this.language == "de"){
        this.source_de = source
        this.body_de = body
        this.html_de = html
        this.css_de = css
      } else if(this.language == "ca"){
        this.source_ca = source
        this.body_ca = body
        this.html_ca = html
        this.css_ca = css
      } else if(this.language == "fr"){
        this.source_fr = source
        this.body_fr = body
        this.html_fr = html
        this.css_fr = css
      }

      params = {
        source: this.source,
        html: this.html,
        body: this.body,
        css: this.css,
        source_es: this.source_es,
        html_es: this.html_es,
        body_es: this.body_es,
        css_es: this.css_es,
        source_eu: this.source_eu,
        html_eu: this.html_eu,
        body_eu: this.body_eu,
        css_eu: this.css_eu,
        source_fr: this.source_fr,
        html_fr: this.html_fr,
        body_fr: this.body_fr,
        css_fr: this.css_fr,
        source_de: this.source_de,
        html_de: this.html_de,
        body_de: this.body_de,
        css_de: this.css_de,
        source_ca: this.source_ca,
        html_ca: this.html_ca,
        body_ca: this.body_ca,
        css_ca: this.css_ca,
      }

      this._companyService.editCompanyTemplate(this.template?.id, this.companyId, params)
        .subscribe(
          response => {
            this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
          },
          error => {
            console.log(error)
          }
        )
    });
  }

  handleModuleChecked(feature) {
    this.updateFeatures();
  }

  updateFeatures() {
    this.includedFeatures = this.features?.filter(f => {
      return f.checked
    })
  }

  handleActivate(id) {
    let params = {
      company_id: this.companyId,
      layout_id: id,
    }
    this._companyService.activateHomeTemplate(params)
    .subscribe(
      async response => {
        this.activeLayoutId = id;
        this.refreshCompanies('template');
        this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
      },
      error => {
        console.log(error)
      }
    )
  }

  async refreshCompanies(mode) {
    this.companies = get(await this._companyService.getCompanies().toPromise(), 'companies');
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
      this.company = company[0];
      this.refreshHomeTemplates(mode);
    }
  }

  refreshHomeTemplates(mode) {
    this.homeTemplates = [];
    this.initializeTemplates();

    switch(mode) {
      case 'template':
        this.isVideoTutorialsStep = true;
        this.isVideoTutorialsStepCompleted = false;
        this.isTemplateStep = false;

        setTimeout(() => {
          this.isVideoTutorialsStep = false;
          this.isVideoTutorialsStepCompleted = true;
          this.isTemplateStep = true;
          this.cd.detectChanges();
        }, 100)
        break;
      case 'content':
        this.isTemplateStep = true;
        this.isTemplateStepCompleted = false;
        
        if(this.activeLayoutId != 1) {  
          this.isContentStep = false;
        } else {
          this.goToSectionsStep();
        }

        setTimeout(() => {
          this.goToContentStep() 
          this.cd.detectChanges();
        }, 100)
        break;
    }
  }

  saveSections() {
    let modules = this.includedFeatures?.filter(feature => {
      return feature?.checked
    })
    let params = {
      company_id: this.companyId,
      modules,
    }
    this._companyService.editHomeTemplateSections(params)
    .subscribe(
      async response => {
        this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
      },
      error => {
        console.log(error)
      }
    )
  }

  handleProfileContent(event) {
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