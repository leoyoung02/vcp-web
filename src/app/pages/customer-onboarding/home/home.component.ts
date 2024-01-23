import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { Router } from "@angular/router";
import {
  LocalService,
  CompanyService,
  UserService,
} from "src/app/share/services";
import { SearchComponent } from "@share/components/search/search.component";
import { NoAccessComponent, PageTitleComponent } from "@share/components";
import { NgxPaginationModule } from "ngx-pagination";
import { CustomerCardComponent } from "@share/components/card/customer/customer.component";
import { environment } from "@env/environment";
import { Subject, takeUntil } from "rxjs";
import get from "lodash/get";

@Component({
  standalone: true,
  imports: [
        CommonModule, 
        TranslateModule, 
        NgxPaginationModule,
        SearchComponent, 
        PageTitleComponent,
        NoAccessComponent,
        CustomerCardComponent,
    ],
    templateUrl: "./home.component.html",
})
export class CustomerOnboardingHomeComponent {
  private destroy$ = new Subject<void>();

  language: any;
  userId: any;
  companyId: any;
  companies: any;
  companyDomain: any;
  companyImage: any;
  primaryColor: any;
  buttonColor: any;

  features: any = [];
  subfeatures: any = [];
  subfeatures2: any = [];
  companyFeatures: any = [];
  allCompanyFeatures: any = [];
  isPlanEnabled: boolean = false;
  isClubEnabled: boolean = false;
  isTutorsEnabled: boolean = false;
  isDiscountEnabled: boolean = false;
  isCityAgendaEnabled: boolean = false;
  isServiceEnabled: boolean = false;
  isCourseEnabled: boolean = false;
  isBuddyEnabled: boolean = false;
  isTestimonialsEnabled: boolean = false;
  canLinkQuizToCourse: boolean = false;
  hasCoursePayment: boolean = false;
  hasCourseCategories: boolean = false;
  hasCourseCustomSections: boolean = false;
  hasMemberCommissions: boolean = false;
  isServicesEnabled: boolean = false;
  isBlogEnabled: boolean = false;
  hasBuddies: boolean = false;
  hasJobOffers: boolean = false;
  hasAffiliates: boolean = false;
  planTitle: any;
  clubTitle: any;
  discountTitle: any;
  cityAgendaTitle: any;
  contestTitle: any;
  courseTitle: any;
  servicesTitle: any;
  jobOffersTitle: any;
  buddiesTitle: any;
  tutorsTitle: any;
  blogTitle: any;

  otherSettings: any;
  otherSettingsCategories: any;
  hasMemberContract: boolean = false;
  hasRegistrationFields: boolean = false;
  canShareRegistrationLink: boolean = false;
  hasCustomInvoice: boolean = false;
  hasCustomMemberTypeSettings: boolean = false;
  hasProfileFields: boolean = false;
  hasGuestAccess: boolean = false;
  hasInquiryForm: boolean = false;
  hasActivityFeed: boolean = false;
  hasSurveys: boolean = false;
  hasQuizzes: boolean = false;
  hasOneToOne: boolean = false;
  hasInvitations: boolean = false;
  hasCRM: boolean = false;

  searchText: any = "";
  search: any = "";
  placeholderText: any = "";
  isInitialLoad: boolean = false;
  isloading: boolean = true;
  languageChangeSubscription: any;
  menuColor: any;
  testimonialsTitle: any;
  user: any;

  createHover: boolean = false;
  superAdmin: boolean = false;
  p: any = 1;

  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService
  ) {}

  async ngOnInit() {
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

    let companies = this._localService.getLocalStorage(environment.lscompanies)
      ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
      : "";

    let company = this._companyService.getCompany(companies);
    if (company && company[0]) {
      this.companyId = company[0].id;
      this.companyDomain = company[0].domain;
      this.companyImage = company[0].image;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color;
      this.menuColor = company[0].menu_color
        ? company[0].menu_color
        : "#ffffff";
    }

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.rerenderList();
        }
      );

    this.initializePage();
  }

  rerenderList() {
    if (!this.isInitialLoad) {
      this.initializePage();
    }
  }

  async initializePage() {
    this.initializeSearch();
    this.loadCustomers();
    this.continueDataLoading();
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  async loadCustomers() {
    let all_companies =  get(
        await this._companyService.getCompanies().toPromise(),
        "companies"
    );
    all_companies = all_companies?.filter(company => {
        return company.active == 1
    });
    this.companies = this.formatCompanies(all_companies);
    this.user = this._localService.getLocalStorage(environment.lsuser);
    this.isloading = false;
    this.isInitialLoad = false;
  }

  formatCompanies(companies) {
    companies = companies?.map((item) => {
        return {
          ...item,
          id: item?.id,
          path: `/customers/details/${item.id}`,
          image: `${environment.api}/get-image-company/${item.image}`,
        };
    });
  
    return companies;
  }

  continueDataLoading() {
    this.getCompanyFeatures();
    this.getOtherSettings();
  }

  getCompanyFeatures() {
    this._companyService
      .getFeaturesList(this.companyDomain)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.companyFeatures = response;
          this.companyFeatures = this.companyFeatures?.filter((f) => {
            return f.id != 22;
          });
          if (this.companyId == 12) {
            this.companyFeatures = this.companyFeatures?.filter((f) => {
              return f.feature_name != "Services";
            });
          }

          let companyFeatures = this.companyFeatures;
          if (companyFeatures) {
            let planFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Plans" && f.status == 1;
            });
            if (planFeature?.length > 0) {
              this.isPlanEnabled = true;
              this.planTitle =
                this.language == "en"
                  ? planFeature[0].name_en || planFeature[0].feature_name
                  : this.language == "fr"
                  ? planFeature[0].name_fr || planFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? planFeature[0].name_eu || planFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? planFeature[0].name_ca || planFeature[0].feature_name_CA
                  : this.language == "de"
                  ? planFeature[0].name_de || planFeature[0].feature_name_DE
                  : planFeature[0].name_es || planFeature[0].feature_name_ES;
            }

            let clubFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Clubs" && f.status == 1;
            });
            if (clubFeature?.length > 0) {
              this.isClubEnabled = true;
              this.clubTitle =
                this.language == "en"
                  ? clubFeature[0].name_en || clubFeature[0].feature_name
                  : this.language == "fr"
                  ? clubFeature[0].name_fr || clubFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? clubFeature[0].name_eu || clubFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? clubFeature[0].name_ca || clubFeature[0].feature_name_CA
                  : this.language == "de"
                  ? clubFeature[0].name_de || clubFeature[0].feature_name_DE
                  : clubFeature[0].name_es || clubFeature[0].feature_name_ES;
            }

            let discountFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Discounts" && f.status == 1;
            });
            if (discountFeature?.length > 0) {
              this.isDiscountEnabled = true;
              this.discountTitle =
                this.language == "en"
                  ? discountFeature[0].name_en ||
                    discountFeature[0].feature_name
                  : this.language == "fr"
                  ? discountFeature[0].name_fr ||
                    discountFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? discountFeature[0].name_eu ||
                    discountFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? discountFeature[0].name_ca ||
                    discountFeature[0].feature_name_CA
                  : this.language == "de"
                  ? discountFeature[0].name_de ||
                    discountFeature[0].feature_name_DE
                  : discountFeature[0].name_es ||
                    discountFeature[0].feature_name_ES;
            }

            // Check if city agenda is activated, otherwise just add here for testing
            let cityAgendaFeature = companyFeatures.filter((f) => {
              return (
                f.feature_name == "City Agenda" &&
                (f.status == 1 || this.companyId == 32)
              );
            });
            if (cityAgendaFeature?.length > 0) {
              this.isCityAgendaEnabled = true;
              this.cityAgendaTitle =
                this.language == "en"
                  ? cityAgendaFeature[0].name_en ||
                    cityAgendaFeature[0].feature_name
                  : this.language == "fr"
                  ? cityAgendaFeature[0].name_fr ||
                    cityAgendaFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? cityAgendaFeature[0].name_eu ||
                    cityAgendaFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? cityAgendaFeature[0].name_ca ||
                    cityAgendaFeature[0].feature_name_CA
                  : this.language == "de"
                  ? cityAgendaFeature[0].name_de ||
                    cityAgendaFeature[0].feature_name_DE
                  : cityAgendaFeature[0].name_es ||
                    cityAgendaFeature[0].feature_name_ES;
            }

            let courseFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Courses" && f.status == 1;
            });
            if (courseFeature?.length > 0) {
              this.isCourseEnabled = true;
              this.courseTitle =
                this.language == "en"
                  ? courseFeature[0].name_en || courseFeature[0].feature_name
                  : this.language == "fr"
                  ? courseFeature[0].name_fr || courseFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? courseFeature[0].name_eu || courseFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? courseFeature[0].name_ca || courseFeature[0].feature_name_CA
                  : this.language == "de"
                  ? courseFeature[0].name_de || courseFeature[0].feature_name_DE
                  : courseFeature[0].name_es ||
                    courseFeature[0].feature_name_ES;
            }

            let jobOffersFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Employment Channel" && f.status == 1;
            });
            if (jobOffersFeature?.length > 0) {
              this.hasJobOffers = true;
              this.jobOffersTitle =
                this.language == "en"
                  ? jobOffersFeature[0].name_en ||
                    jobOffersFeature[0].feature_name
                  : this.language == "fr"
                  ? jobOffersFeature[0].name_fr ||
                    jobOffersFeature[0].feature_name_fr
                  : this.language == "eu"
                  ? jobOffersFeature[0].name_eu ||
                    jobOffersFeature[0].feature_name_eu
                  : this.language == "ca"
                  ? jobOffersFeature[0].name_ca ||
                    jobOffersFeature[0].feature_name_ca
                  : this.language == "de"
                  ? jobOffersFeature[0].name_de ||
                    jobOffersFeature[0].feature_name_de
                  : jobOffersFeature[0].name_es ||
                    jobOffersFeature[0].feature_name_es;
            }

            let tutorsFeature = companyFeatures.filter((f) => {
              return f.feature_name == "Tutors" && f.status == 1;
            });
            if (tutorsFeature?.length > 0) {
              this.isTutorsEnabled = true;
              this.tutorsTitle =
                this.language == "en"
                  ? tutorsFeature[0].name_en || tutorsFeature[0].feature_name
                  : this.language == "fr"
                  ? tutorsFeature[0].name_fr || tutorsFeature[0].feature_name_FR
                  : this.language == "eu"
                  ? tutorsFeature[0].name_eu || tutorsFeature[0].feature_name_EU
                  : this.language == "ca"
                  ? tutorsFeature[0].name_ca || tutorsFeature[0].feature_name_CA
                  : this.language == "de"
                  ? tutorsFeature[0].name_de || tutorsFeature[0].feature_name_DE
                  : tutorsFeature[0].name_es ||
                    tutorsFeature[0].feature_name_ES;
            }
          }

          let testimonialFeature = companyFeatures?.filter((f) => {
            return f.feature_name == "Testimonials" && f.status == 1;
          });
          if (testimonialFeature?.length > 0) {
            this.isTestimonialsEnabled = true;
            this.testimonialsTitle =
              this.language == "en"
                ? testimonialFeature[0].name_en ||
                  testimonialFeature[0].feature_name
                : this.language == "fr"
                ? testimonialFeature[0].name_fr ||
                  testimonialFeature[0].feature_name_FR
                : this.language == "eu"
                ? testimonialFeature[0].name_eu ||
                  testimonialFeature[0].feature_name_EU
                : this.language == "ca"
                ? testimonialFeature[0].name_ca ||
                  testimonialFeature[0].feature_name_CA
                : this.language == "de"
                ? testimonialFeature[0].name_de ||
                  testimonialFeature[0].feature_name_DE
                : testimonialFeature[0].name_es ||
                  testimonialFeature[0].feature_name_ES;
          }

          let servicesFeature = companyFeatures?.filter((f) => {
            return f.feature_name == "Services" && f.status == 1;
          });
          if (servicesFeature?.length > 0) {
            this.isServicesEnabled = true;
            this.servicesTitle =
              this.language == "en"
                ? servicesFeature[0].name_en || servicesFeature[0].feature_name
                : this.language == "fr"
                ? servicesFeature[0].name_fr ||
                  servicesFeature[0].feature_name_FR
                : this.language == "eu"
                ? servicesFeature[0].name_eu ||
                  servicesFeature[0].feature_name_EU
                : this.language == "ca"
                ? servicesFeature[0].name_ca ||
                  servicesFeature[0].feature_name_CA
                : this.language == "de"
                ? servicesFeature[0].name_de ||
                  servicesFeature[0].feature_name_DE
                : servicesFeature[0].name_es ||
                  servicesFeature[0].feature_name_ES;
          }

          let blogFeature = companyFeatures?.filter((f) => {
            return f.feature_name == "Blog" && f.status == 1;
          });
          if (blogFeature?.length > 0) {
            this.isBlogEnabled = true;
            this.blogTitle =
              this.language == "en"
                ? blogFeature[0].name_en || blogFeature[0].feature_name
                : this.language == "fr"
                ? blogFeature[0].name_fr || blogFeature[0].feature_name_FR
                : this.language == "eu"
                ? blogFeature[0].name_eu || blogFeature[0].feature_name_EU
                : this.language == "ca"
                ? blogFeature[0].name_ca || blogFeature[0].feature_name_CA
                : this.language == "de"
                ? blogFeature[0].name_de || blogFeature[0].feature_name_DE
                : blogFeature[0].name_es || blogFeature[0].feature_name_ES;
          }

          this.companyFeatures =
            this.companyFeatures &&
            this.companyFeatures.sort((a, b) => {
              return a.sequence - b.sequence;
            });
          this.allCompanyFeatures = this.companyFeatures;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getOtherSettings() {
    this._companyService
      .getOtherSettings(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.otherSettings = response["other_settings"];

          let other_settings: any[] = [];
          if (this.otherSettings) {
            this.otherSettings.forEach((setting) => {
              let section_title = setting.title_en;
              let cont: any[] = [];
              let content = setting.content;
              if (content) {
                content.forEach((c) => {
                  if (
                    (section_title == "Registration/Services" &&
                      c.title_en ==
                        "Require subscription during registration with Stripe payment") ||
                    (section_title == "Registration/Services" &&
                      c.title_en == "STRIPE Secret API Key") ||
                    (section_title == "Registration/Services" &&
                      c.title_en == "Stripe Monthly Subscription API ID") ||
                    (section_title == "Registration/Services" &&
                      c.title_en == "Monthly Subscription Fee") ||
                    (section_title == "Registration/Services" &&
                      c.title_en == "STRIPE Publishable API Key") ||
                    (section_title == "Registration/Services" &&
                      c.title_en ==
                        "Require Stripe payment on specific member types") ||
                    (section_title == "Registration/Services" &&
                      c.title_en == "Custom member type expiration")
                  ) {
                    // Skip
                  } else {
                    cont.push(c);
                  }
                });
              }

              other_settings.push({
                active: setting.active,
                content: cont,
                created_at: setting.created_at,
                id: setting.id,
                title_en: setting.title_en,
                title_es: setting.title_es,
              });
            });
          }

          this.otherSettings = other_settings;

          if (this.otherSettings) {
            this.otherSettings.forEach((m) => {
              if (m.title_es == "Registro / Servicios") {
                if (m.content) {
                  let memberContractSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Member contract") >= 0;
                  });
                  if (memberContractSettings && memberContractSettings[0]) {
                    this.hasMemberContract =
                      memberContractSettings[0].active == 1 ? true : false;
                  }

                  let registrationFieldsSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Registration fields") >= 0;
                  });
                  if (
                    registrationFieldsSettings &&
                    registrationFieldsSettings[0]
                  ) {
                    this.hasRegistrationFields =
                      registrationFieldsSettings[0].active == 1 ? true : false;
                  }

                  let shareRegistrationLinkSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Share registration link") >= 0;
                  });
                  if (
                    shareRegistrationLinkSettings &&
                    shareRegistrationLinkSettings[0]
                  ) {
                    this.canShareRegistrationLink =
                      shareRegistrationLinkSettings[0].active == 1
                        ? true
                        : false;
                  }

                  let customInvoiceSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Custom invoice") >= 0;
                  });
                  if (customInvoiceSettings && customInvoiceSettings[0]) {
                    this.hasCustomInvoice =
                      customInvoiceSettings[0].active == 1 ? true : false;
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

              if (m.title_es == "General") {
                if (m.content) {
                  // Check if custom profile fields is enabled
                  let profileFieldsSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Profile fields") >= 0;
                  });

                  if (profileFieldsSettings && profileFieldsSettings[0]) {
                    this.hasProfileFields =
                      profileFieldsSettings[0].active == 1 ? true : false;
                  }

                  let guestAccessSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Guest access") >= 0;
                  });
                  if (guestAccessSettings && guestAccessSettings[0]) {
                    this.hasGuestAccess =
                      guestAccessSettings[0].active == 1 ? true : false;
                  }

                  let inquiryFormSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Inquiry form on Home page") >= 0;
                  });
                  if (inquiryFormSettings && inquiryFormSettings[0]) {
                    this.hasInquiryForm =
                      inquiryFormSettings[0].active == 1 ? true : false;
                  }

                  let hasActivityFeedSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Activity feed") >= 0;
                  });
                  if (hasActivityFeedSettings && hasActivityFeedSettings[0]) {
                    this.hasActivityFeed =
                      hasActivityFeedSettings[0].active == 1 ? true : false;
                  }
                }
              }

              if (m.title_es == "Módulos") {
                if (m.content) {
                  let surveysSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Surveys") >= 0;
                  });
                  if (surveysSettings && surveysSettings[0]) {
                    this.hasSurveys =
                      surveysSettings[0].active == 1 ? true : false;
                  }

                  let quizzesSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Quizzes") >= 0;
                  });
                  if (quizzesSettings && quizzesSettings[0]) {
                    this.hasQuizzes =
                      quizzesSettings[0].active == 1 ? true : false;
                  }

                  let oneToOneSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("One to one") >= 0;
                  });
                  if (oneToOneSettings && oneToOneSettings[0]) {
                    this.hasOneToOne =
                      oneToOneSettings[0].active == 1 ? true : false;
                  }

                  let invitationsSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Invitations") >= 0;
                  });
                  if (invitationsSettings && invitationsSettings[0]) {
                    this.hasInvitations =
                      invitationsSettings[0].active == 1 ? true : false;
                  }

                  let crmSettings = m.content.filter((c) => {
                    return c.title_en == "CRM";
                  });
                  if (crmSettings && crmSettings[0]) {
                    this.hasCRM = crmSettings[0].active == 1 ? true : false;
                  }
                }
              }
            });

            if (!this.hasGuestAccess) {
              this.otherSettings.forEach((s) => {
                if (s.title_es == "General") {
                  if (s.content) {
                    s.content.forEach((c, index) => {
                      if (c.title_en == "Inquiry form on Home page") {
                        s.content.splice(index, 1);
                      }
                    });
                  }
                }
              });
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  handleSearchChanged(event) {
    this.search = event || "";
    this.filterCustomers();
  }

  filterCustomers() {

  }

  toggleCreateHover(event) {
    this.createHover = event;
  }

  handleCreateRoute() {

  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}