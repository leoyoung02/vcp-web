import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppTheme, ThemeService } from "src/app/core/services/theme";
import { Subject, takeUntil } from "rxjs";
import { COURSE_UNIT_IMAGE_URL } from "@lib/api-constants";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "@env/environment";
import { PlansListComponent } from "@features/plans/list/list.component";
import { SafeContentHtmlPipe } from "@lib/pipes";
import { ClubsListComponent } from "@features/clubs/list/list.component";
import { CoursesListComponent } from "@features/courses/list/list.component";
import { JobOffersListComponent } from "@features/job-offers/list/list.component";
import { MasonryComponent } from "@share/components";
import { VideoSectionComponent } from "@share/components/video-section/video-section.component";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    SafeContentHtmlPipe,
    PlansListComponent,
    ClubsListComponent,
    CoursesListComponent,
    JobOffersListComponent,
    MasonryComponent,
    VideoSectionComponent,
  ],
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTheme!: AppTheme | null;

  private readonly _themeService = inject(ThemeService);
  private readonly _destroy$ = new Subject();

  userId: any;
  language: any;
  blogTitle: any;
  offerTitle: any;
  features: any;
  companies: any;
  companyId: any;
  domain: any;
  buttonColor: any;
  primaryColor: any;
  isClubsActivated: boolean = false;
  isDiscountsActivated: boolean = false;
  isCityAgendaActivated: boolean = false;
  isServicesActivated: boolean = false;
  isloading: boolean = true;
  groupsTitle: any = "";
  clubsFeature: any;
  companySlug: any;
  hasLandingTemplate: boolean = false;
  hasPredefinedTemplate: boolean = false;
  hasDefaultPredefinedTemplate: boolean = false;
  predefinedTemplate: any;
  template: any;
  html: any;
  css: any;
  companyTemplate: any;
  hasMobileLimit: boolean = false;
  mobileLimitActivities: number = 4;
  mobileLimitCityAgenda: number = 3;
  mobileLimitClubs: number = 8;
  mobileLimitJobOffers: number = 3;
  mobileLimitDiscounts: number = 4;
  mobileLimitCourses: number = 4;
  mobileLimitStartups: number = 4;
  mobileLimitMembers: number = 4;
  disableActivities: boolean = false;
  disableCityAgenda: boolean = false;
  disableClubs: boolean = false;
  disableJobOffers: boolean = false;
  disableDiscounts: boolean = false;
  disableCourses: boolean = false;
  disableStartups: boolean = false;
  disableMembers: boolean = false;
  menus: any = [];
  menuOrdering: any;
  tempData: any;
  otherSettings: any;
  canShareRegistrationLink: boolean = false;
  showShareRegistrationModal: boolean = false;
  shareLink: any = "";
  currentUser: any;
  registrationLinkCopied: boolean = false;
  registrationLinkPreviewed: boolean = false;
  hover: boolean = false;
  hasCustomMemberTypeSettings: boolean = false;
  superAdmin: boolean = false;
  admin1: boolean = false;
  admin2: boolean = false;
  hasMenuOrdering: boolean = false;
  dashboardDetails: any;
  homeTextValue: any;
  homeTextValueEn: any;
  homeTextValueFr: any;
  homeTextValueEu: any;
  homeTextValueCa: any;
  homeTextValueDe: any;
  newMenuButton: any;
  newMenuButtonTextValue: any;
  newMenuButtonTextValueEn: any;
  newMenuButtonTextValueFr: any;
  newMenuButtonTextValueEu: any;
  newMenuButtonTextValueCa: any;
  newMenuButtonTextValueDe: any;
  newMenuButtonUrl: any;
  hasBuddy: boolean = false;
  hasBuddyMajorRestrictions: boolean = false;
  majorRestriction: any;
  hasBuddyYearRestrictions: boolean = false;
  yearRestriction: any;
  courseSubscriptions: any = [];
  homeActive: boolean = false;
  imageSrc: string = `${COURSE_UNIT_IMAGE_URL}/`;
  customMemberTypeId: any = 0;
  hasProfileHomeContent: boolean = false;
  profileHomeContentSetting: any = [];
  sectionOptions: any = [];
  showEventsCalendar: boolean = false;
  companyName: any;
  company: any;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = theme));

    this.initializePage();
  }

  async initializePage() {
    this.language =
      this._localService.getLocalStorage(environment.lslang) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this._translateService.use(this.language || "es");

    this.companies = this._localService.getLocalStorage(environment.lscompanies)
      ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
      : "";
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
      this.company = company[0];
      this.companyId = company[0].id;
      this.companyName = company[0].entity_name;
      this.domain = company[0].domain;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
      this._localService.setLocalStorage(
        environment.lscompanyId,
        this.companyId
      );
      this._localService.setLocalStorage(environment.lsdomain, this.domain);
      this.homeTextValue = company[0].home_text || "Inicio";
      this.homeTextValueEn = company[0].home_text_en || "Home";
      this.homeTextValueFr = company[0].home_text_fr || "Maison";
      this.homeTextValueEu = company[0].home_text_eu || "Hasi";
      this.homeTextValueCa = company[0].home_text_ca || "Inici";
      this.homeTextValueDe = company[0].home_text_de || "Anfang";
      this.homeActive = company[0].show_home_menu == 1 ? true : false;
      this.newMenuButton = company[0].new_menu_button;
      if (this.newMenuButton == 1) {
        this.newMenuButtonTextValue = company[0].new_menu_button_text;
        this.newMenuButtonTextValueEn = company[0].new_menu_button_text_en;
        this.newMenuButtonTextValueFr = company[0].new_menu_button_text_fr;
        this.newMenuButtonTextValueEu = company[0].new_menu_button_text_eu;
        this.newMenuButtonTextValueCa = company[0].new_menu_button_text_ca;
        this.newMenuButtonTextValueDe = company[0].new_menu_button_text_de;
        this.newMenuButtonUrl = company[0].new_menu_button_url;
      }

      if (company[0].landing_template == 1) {
        this.companySlug = company[0].slug;
        this.hasLandingTemplate = true;
        this.companyTemplate = company[0].template ? company[0].template : "";
        this.getLandingTemplateBySlug(this.companySlug);
      }
      this.getSettingsTitle();
      if(this.userId) {
        this.getUserDetails();
      }

      if (company[0].predefined_template == 1) {
        this.hasPredefinedTemplate = true;
        if (company[0].predefined_template_id == 1) {
          this.hasDefaultPredefinedTemplate = true;
        } else {
          this._userService.getUserById(this.userId).subscribe(
            (response: any) => {
              let user = response ? response.CompanyUser : "";
              this.currentUser = user;
              this.customMemberTypeId = user?.custom_member_type_id;
              this.getPredefinedTemplate(company[0].predefined_template_id);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    }

    this.getMobileLimitSettings();

    // Get all activated features
    this.features = this._localService.getLocalStorage(environment.lsfeatures)
      ? JSON.parse(this._localService.getLocalStorage(environment.lsfeatures))
      : "";
    if (!this.features) {
      this.features = await this._companyService
        .getFeatures(this.domain)
        .toPromise();
    }
    let clubsFeature = this.features.filter((f) => {
      return f.feature_name == "Clubs";
    });
    if (clubsFeature && clubsFeature[0]) {
      this.clubsFeature = clubsFeature[0];
    }
    this.getTitles();

    this.isloading = false;

    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.language = event.lang;
      this.getTitles();
      this.showLandingTemplate();
    });

    this.getOtherSettings();
    this.getMenus();
  }

  async getMenus() {
    this.menus = this._localService.getLocalStorage(environment.lsmenus)
      ? JSON.parse(this._localService.getLocalStorage(environment.lsmenus))
      : [];
    if (this.menus?.length > 0) {
      this.menus = this.menus.sort((a, b) => {
        return a.sequence - b.sequence;
      });
      this.updateDisabledFeatures(this.menus);
    }
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
        this.predefinedTemplate =
          this.predefinedTemplate?.length > 0 ? this.predefinedTemplate[0] : "";
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTitles() {
    if (this.clubsFeature) {
      this.groupsTitle =
        this.language == "en"
          ? this.clubsFeature.name_en ||
            this.clubsFeature.feature_name ||
            this.clubsFeature.name_es ||
            this.clubsFeature.feature_name_ES
          : this.language == "fr"
          ? this.clubsFeature.name_fr ||
            this.clubsFeature.feature_name_FR ||
            this.clubsFeature.name_es ||
            this.clubsFeature.feature_name_ES
          : this.language == "eu"
          ? this.clubsFeature.name_eu ||
            this.clubsFeature.feature_name_EU ||
            this.clubsFeature.name_es ||
            this.clubsFeature.feature_name_ES
          : this.language == "ca"
          ? this.clubsFeature.name_ca ||
            this.clubsFeature.feature_name_CA ||
            this.clubsFeature.name_es ||
            this.clubsFeature.feature_name_ES
          : this.language == "de"
          ? this.clubsFeature.name_de ||
            this.clubsFeature.feature_name_DE ||
            this.clubsFeature.name_es ||
            this.clubsFeature.feature_name_ES
          : this.clubsFeature.name_es || this.clubsFeature.feature_name_ES;
    }
  }

  getSafeVideoUrl(video) {
    let url;
    if (video.indexOf("youtube") >= 0) {
      url = video?.replace("watch?v=", "embed/");

      if (url && url.indexOf("&") > 0) {
        url = url.substring(0, url.indexOf("&"));
      }
    } else if (video.indexOf("vimeo") >= 0) {
      url = video?.replace("vimeo.com/", "player.vimeo.com/video/");
    } else if (video.indexOf("http") >= 0) {
      url = video;
    } else {
      url = this.imageSrc + video;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getOtherSettings() {
    this._companyService.getOtherSettings(this.companyId).subscribe(
      async (response) => {
        this.otherSettings = response["other_settings"];
        if (this.otherSettings) {
          this.otherSettings.forEach((m) => {
            if (m.title_es == "General") {
              if (m.content) {
                let menuOrderSettings = m.content.filter((c) => {
                  return c.title_en.indexOf("Menu items order") >= 0;
                });
                if (menuOrderSettings && menuOrderSettings[0]) {
                  this.hasMenuOrdering =
                    menuOrderSettings[0].active == 1 ? true : false;
                }
              }
            }
            if (m.title_es == "Registro / Servicios") {
              if (m.content) {
                let shareRegistrationLinkSettings = m.content.filter((c) => {
                  return c.title_en.indexOf("Share registration link") >= 0;
                });
                if (
                  shareRegistrationLinkSettings &&
                  shareRegistrationLinkSettings[0]
                ) {
                  this.canShareRegistrationLink =
                    shareRegistrationLinkSettings[0].active == 1 ? true : false;
                  if (this.canShareRegistrationLink && this.userId) {
                    this.getUserDetails();
                  }
                }
              }
            }

            if (m.title_es == "Stripe") {
              if (m.content) {
                let customMemberTypeSettings = m.content.filter((c) => {
                  return (
                    c.title_en.indexOf(
                      "Require Stripe payment on specific member types"
                    ) >= 0
                  );
                });
                if (customMemberTypeSettings && customMemberTypeSettings[0]) {
                  this.hasCustomMemberTypeSettings =
                    customMemberTypeSettings[0].active == 1 ? true : false;
                }
              }
            }
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
        }
    )
  }

  getUserDetails() {
    if (!this.currentUser) {
      this._userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.currentUser = response ? response.CompanyUser : "";
          this.shareLink = this.currentUser ? this.currentUser.tiny_url : "";
          this.getUserRole();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getUserRole() {
    this._userService.getUserRole(this.userId).subscribe(
      (response: any) => {
        let roles = response.role;
        if (roles && roles.length > 0) {
          roles.forEach((role) => {
            if (role.role == "Super Admin") {
              this.superAdmin = true;
            }
            if (role.role == "Admin 1") {
              this.admin1 = true;
            }
            if (role.role == "Admin 2") {
              this.admin2 = true;
            }
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
      : course.title;
  }

  updateDisabledFeatures(menus) {
    let activity =
      menus &&
      menus.filter((menu) => {
        return menu.id == 1 && menu.path == "plans";
      });
    if (!activity || (activity && activity.length == 0)) {
      this.disableActivities = true;
    }

    let club =
      menus &&
      menus.filter((menu) => {
        return menu.id == 5;
      });
    if (!club || (club && club.length == 0)) {
      this.disableClubs = true;
    }

    let joboffers =
      menus &&
      menus.filter((menu) => {
        return menu.id == 18;
      });
    if (!joboffers || (joboffers && joboffers.length == 0)) {
      this.disableJobOffers = true;
    }

    let courses =
      menus &&
      menus.filter((menu) => {
        return menu.id == 11;
      });
    if (!courses || (courses && courses.length == 0)) {
      this.disableCourses = true;
    }

    let members =
      menus &&
      menus.filter((menu) => {
        return menu.id == 15;
      });
    if (!members || (members && members.length == 0)) {
      this.disableMembers = true;
    }
  }

  getMobileLimitSettings() {
    this._companyService
      .getMobileLimitSettingsAll(this.companyId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        let settings = data.mobile_limit_settings;

        let activity_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 1;
          });
        if (activity_limit && activity_limit.length > 0) {
          this.mobileLimitActivities = activity_limit[0].home_limit;
        }

        let cityagenda_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 3;
          });
        if (cityagenda_limit && cityagenda_limit.length > 0) {
          this.mobileLimitCityAgenda = cityagenda_limit[0].home_limit;
        }

        let club_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 5;
          });
        if (club_limit && club_limit.length > 0) {
          this.mobileLimitClubs = club_limit[0].home_limit;
        }

        let joboffers_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 18;
          });
        if (joboffers_limit && joboffers_limit.length > 0) {
          this.mobileLimitJobOffers = joboffers_limit[0].home_limit;
        }

        let discounts_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 4;
          });
        if (discounts_limit && discounts_limit.length > 0) {
          this.mobileLimitDiscounts = discounts_limit[0].home_limit;
        }

        let courses_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 11;
          });
        if (courses_limit && courses_limit.length > 0) {
          this.mobileLimitCourses = courses_limit[0].home_limit;
        }

        let startups_limit =
          settings &&
          settings.filter((s) => {
            return s.feature_id == 15;
          });
        if (startups_limit && startups_limit.length > 0) {
          this.mobileLimitMembers = startups_limit[0].home_limit;
        }
      });
  }

  getLandingTemplateBySlug(slug) {
    this._companyService
      .getLandingTemplateBySlug(slug)
      .pipe(takeUntil(this._destroy$))
      .subscribe((data) => {
        let template = data.template;
        this.companyTemplate = template;
        if (this.companyTemplate) {
          this.showLandingTemplate();
        }
      });
  }

  showLandingTemplate() {
    if (this.companyTemplate) {
      let style = ` <style>
                table{background-color:transparent !important;}  
                .v-row-background-image--outer{background-size:100%;}
                @media (max-width: 767px) { .u-col.u-col-50, .u-col.u-col-100, .u-row.v-row-columns-background-color-background-color{display:block !important;max-width:100% !important;min-width:100% !important;} }
            </style> `;
      const regex = /max-width: 600px;/gi;

      let html_body = "";
      let html_css = "";

      if (this.language == "en") {
        html_body = this.companyTemplate.body;
        html_css = this.companyTemplate.css;
      } else if (this.language == "es") {
        html_body = this.companyTemplate.body_es;
        html_css = this.companyTemplate.css_es;
      } else if (this.language == "eu") {
        html_body = this.companyTemplate.body_eu;
        html_css = this.companyTemplate.css_eu;
      } else if (this.language == "de") {
        html_body = this.companyTemplate.body_de;
        html_css = this.companyTemplate.css_de;
      } else if (this.language == "fr") {
        html_body = this.companyTemplate.body_fr;
        html_css = this.companyTemplate.css_fr;
      } else if (this.language == "de") {
        html_body = this.companyTemplate.body_de;
        html_css = this.companyTemplate.css_de;
      }

      let body = html_body ? html_body.replace(regex, "max-width: 100%;") : "";

      const regex1 = /min-width: 900px;/gi;
      body = body ? body.replace(regex1, "min-width: 100%;") : "";

      this.html = this.sanitizer.bypassSecurityTrustHtml(style + body);
      this.css = this.sanitizer.bypassSecurityTrustStyle(html_css);

      setTimeout(() => {
        const table: any = document.getElementsByTagName("TABLE")[1];
        if (table) {
          var sheet = document.createElement("style");
          sheet.innerHTML =
            ".guest-home.html-container strong, .guest-home.html-container p, .guest-home.html-container h1, .guest-home.html-container h2, .guest-home.html-container h3, .guest-home.html-container h4, .guest-home.html-container h5, .guest-home.html-container span {font-family: " +
            table.style.fontFamily +
            ";} ";
          document.head.appendChild(sheet);
        }
      }, 100);
    }
  }

  shareRegistrationLink() {
    this.registrationLink(true);
  }

  closeShareRegistrationModal() {
    this.registrationLink();
  }

  copyRegistrationLink() {
    this.registrationLinkPreviewed = false;
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = this.shareLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.registrationLinkCopied = true;
  }

  registrationLink(showModal: boolean = false) {
    this.registrationLinkCopied = false;
    this.registrationLinkPreviewed = false;
    this.showShareRegistrationModal = showModal;
  }

  previewRegistrationLink() {
    this.registrationLinkCopied = false;
    this.registrationLinkPreviewed = true;
    window.open(this.shareLink, "_blank");
  }

  hasAccess(path) {
    let access = false;
    let no_menu = false;
    if (!this.menus || this.menus?.length == 0) {
      no_menu = true;
      this.menus = this._localService.getLocalStorage(environment.lsmenus)
        ? JSON.parse(this._localService.getLocalStorage(environment.lsmenus))
        : [];
    }
    if (this.menus?.length > 0) {
      let feature =
        this.menus &&
        this.menus.filter((m) => {
          return m.path == path;
        });
      if (feature && feature.length > 0) {
        access = true;
      }
    }

    if (no_menu && this.menus?.length > 0) {
      this.updateDisabledFeatures(this.menus);
    }

    return access;
  }

  checkSection(menus, index, order) {
    let result = false;

    if (menus && menus.length > 0) {
      let match = menus.some((a) => a.path === "dashboard");
      if (match) {
        if (index > 2 && order == "second") {
          result = true;
        }
      } else {
        if (index > 1 && order == "second") {
          result = true;
        }
      }
    }

    return result;
  }

  hasMenus() {
    let access = false;
    if (!this.menus || this.menus?.length == 0) {
      this.menus = this._localService.getLocalStorage(environment.lsmenus)
        ? JSON.parse(this._localService.getLocalStorage(environment.lsmenus))
        : [];
    }
    if (this.menus?.length > 0) {
      access = true;
    }

    return access;
  }

  handleThemeChange(theme: AppTheme): void {
    this._themeService.setTheme(theme);
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}