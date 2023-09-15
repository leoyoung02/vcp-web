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
import { environment } from "@env/environment";
import { Subject, takeUntil } from "rxjs";
import get from "lodash/get";

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, SearchComponent],
  templateUrl: "./main.component.html",
})
export class MainComponent {
  private destroy$ = new Subject<void>();

  language: any;
  userId: any;
  companyId: any;
  companies: any;
  companyDomain: any;
  companyImage: any;
  primaryColor: any;
  buttonColor: any;
  termsAndConditions: any;
  privacyPolicy: any;
  showLogo: any;
  search: any;
  selectedContent: any;
  isloading: boolean = true;
  skeletonItems: any = [];
  mainMenuItems: any = [];
  allMainMenuItems: any = [];

  features: any = [];
  subfeatures: any = [];
  subfeatures2: any = [];
  companyFeatures: any = [];
  allCompanyFeatures: any = [];
  isPlanEnabled: boolean = false;
  isClubEnabled: boolean = false;
  isTutorsEnabled: boolean = false;
  hasSubgroups: boolean = false;
  isDiscountEnabled: boolean = false;
  isBlogEnabled: boolean = false;
  isServiceEnabled: boolean = false;
  isCourseEnabled: boolean = false;
  isBuddyEnabled: boolean = false;
  canLinkQuizToCourse: boolean = false;
  hasCoursePayment: boolean = false;
  hasCourseCategories: boolean = false;
  isAdvancedCourse: boolean = false;
  hasCourseCustomSections: boolean = false;
  canLockUnlockModules: boolean = false;
  countryDropdown: boolean = false;
  hasMemberCommissions: boolean = false;
  isServicesEnabled: boolean = false;
  hasBuddies: boolean = false;
  hasJobOffers: boolean = false;
  hasAffiliates: boolean = false;
  planTitle: any;
  clubTitle: any;
  subgroupsTitle: any;
  discountTitle: any;
  blogTitle: any;
  contestTitle: any;
  courseTitle: any;
  servicesTitle: any;
  jobOffersTitle: any;
  buddiesTitle: any;
  tutorsTitle: any;

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
  showContactUs: boolean = false;
  canCreateLandingPages: boolean = false;
  roles: any;
  me: any;
  hasAccess: boolean = false;
  isAccessChecked: boolean = false;
  isInitialLoad = true;

  company_subfeatures = [];
  subfeature_id_global: number = 0;
  feature_global: string = "";
  allSettings: any[] = [];

  showEmailSettingsModal: boolean = false;
  emailFrom: any = "";
  emailSenderName: any = "";

  searchText: any = "";
  placeholderText: any = "";
  isLoading: boolean = false;
  languageChangeSubscription: any;

  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService
  ) {}

  async ngOnInit() {
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
      this.companyId = company[0].id;
      this.companyDomain = company[0].domain;
      this.companyImage = company[0].image;
      this.primaryColor = company[0].primary_color;
      (this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color),
        (this.termsAndConditions = company[0].terms_and_conditions);
      this.privacyPolicy = company[0].policy;
      this.showLogo = company[0].show_logo_on_member_select;
      this.emailFrom = company[0].email_from;
      this.emailSenderName =
        company[0].email_sender_name || company[0].email_from;
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

  getAllCategorySettingList() {
    this._companyService
      .getAllCategorySettingsList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        let allSettings = data["settings"];

        let cookies_policy = {};
        cookies_policy["category_" + this.language] =
          this._translateService.instant("company-settings.personalsettings");
        cookies_policy["title_" + this.language] =
          this._translateService.instant("footer.cookies_policy");
        cookies_policy["description_" + this.language] =
          this._translateService.instant("footer.cookies_policy_desc");
        allSettings.push(cookies_policy);

        let termsandconditions = {};
        termsandconditions["category_" + this.language] =
          this._translateService.instant("company-settings.personalsettings");
        termsandconditions["title_" + this.language] =
          this._translateService.instant("register.termsandconditions");
        termsandconditions["description_" + this.language] =
          this._translateService.instant(
            "company-settings.termsandconditionsdesc"
          );
        allSettings.push(termsandconditions);

        let privacy_policy = {};
        privacy_policy["category_" + this.language] =
          this._translateService.instant("company-settings.personalsettings");
        privacy_policy["title_" + this.language] =
          this._translateService.instant("footer.privacy_policy");
        privacy_policy["description_" + this.language] =
          this._translateService.instant("company-settings.privacypolicydesc");
        allSettings.push(privacy_policy);

        let favicon = {};
        favicon["category_" + this.language] = this._translateService.instant(
          "company-settings.customizedesign"
        );
        favicon["title_" + this.language] = "favicon";
        favicon["description_" + this.language] =
          this._translateService.instant("landing.favicondesc");
        allSettings.push(favicon);

        let logo = {};
        logo["category_" + this.language] = this._translateService.instant(
          "company-settings.customizedesign"
        );
        logo["title_" + this.language] = this._translateService.instant(
          "settings.company_logo"
        );
        logo["description_" + this.language] = this._translateService.instant(
          "company-settings.recommendedsize"
        );
        allSettings.push(logo);

        let logo_page = {};
        logo_page["category_" + this.language] = this._translateService.instant(
          "company-settings.customizedesign"
        );
        logo_page["title_" + this.language] = this._translateService.instant(
          "settings.logo_entreprise"
        );
        logo_page["description_" + this.language] =
          this._translateService.instant("company-settings.recommendedsize");
        allSettings.push(logo_page);

        let headerlogosize = {};
        headerlogosize["category_" + this.language] =
          this._translateService.instant("company-settings.customizedesign");
        headerlogosize["title_" + this.language] =
          this._translateService.instant("company-settings.headerlogosize");
        headerlogosize["description_" + this.language] =
          this._translateService.instant("company-settings.headerlogosizedesc");
        allSettings.push(headerlogosize);

        let footerlogosize = {};
        footerlogosize["category_" + this.language] =
          this._translateService.instant("company-settings.customizedesign");
        footerlogosize["title_" + this.language] =
          this._translateService.instant("company-settings.footerlogosize");
        footerlogosize["description_" + this.language] =
          this._translateService.instant("company-settings.footerlogosizedesc");
        allSettings.push(footerlogosize);

        let company_banner = {};
        company_banner["category_" + this.language] =
          this._translateService.instant("company-settings.customizedesign");
        company_banner["title_" + this.language] =
          this._translateService.instant("settings.company_banner");
        company_banner["description_" + this.language] =
          this._translateService.instant("company-settings.recommendedsize");
        allSettings.push(company_banner);

        let qaaccess = {};
        qaaccess["category_" + this.language] = this._translateService.instant(
          "company-settings.wall"
        );
        qaaccess["title_" + this.language] = this._translateService.instant(
          "settings.qaaccesssetting"
        );
        qaaccess["description_" + this.language] =
          this._translateService.instant("settings.qaaccesssettingdesc");
        allSettings.push(qaaccess);

        let generalmemberreplysetting = {};
        generalmemberreplysetting["category_" + this.language] =
          this._translateService.instant("company-settings.wall");
        generalmemberreplysetting["title_" + this.language] =
          this._translateService.instant("settings.generalmemberreplysetting");
        generalmemberreplysetting["description_" + this.language] =
          this._translateService.instant(
            "settings.generalmemberreplysettingdesc"
          );
        allSettings.push(generalmemberreplysetting);

        let status = {};
        status["category_" + this.language] = this._translateService.instant(
          "company-settings.personalizehometemplate"
        );
        status["title_" + this.language] = this._translateService.instant(
          "company-settings.status"
        );
        status["description_" + this.language] = this._translateService.instant(
          "company-settings.statusdeschome"
        );
        allSettings.push(status);

        let hometemplate = {};
        hometemplate["category_" + this.language] =
          this._translateService.instant(
            "company-settings.personalizehometemplate"
          );
        hometemplate["title_" + this.language] = this._translateService.instant(
          "company-settings.hometemplate"
        );
        hometemplate["description_" + this.language] =
          this._translateService.instant("company-settings.hometemplatedesc");
        allSettings.push(hometemplate);

        let predefinedhometemplate = {};
        predefinedhometemplate["category_" + this.language] =
          this._translateService.instant(
            "company-settings.personalizehometemplate"
          );
        predefinedhometemplate["title_" + this.language] =
          this._translateService.instant(
            "company-settings.predefinedhometemplate"
          );
        predefinedhometemplate["description_" + this.language] =
          this._translateService.instant(
            "company-settings.predefinedhometemplatedesc"
          );
        allSettings.push(predefinedhometemplate);

        this.allSettings = allSettings;
        this.isLoading = true;
      });
  }

  rerenderList() {
    if (!this.isInitialLoad) {
      this.initializePage();
    }
    // this.isLoading = true;
    // this.isLoading = false;
  }

  async initializePage() {
    if (this.userId) {
      this.getUserDetails();
    } else {
      this.continueDataLoading();
    }
  }

  getUserDetails() {
    this._userService
      .getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.me = data.CompanyUser;
          this.continueDataLoading();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  continueDataLoading() {
    this.getUserRole();
    this.getMainMenuItems();
    this.getCompanyFeatures();
    this.getOtherSettings();
    this.getAllCategorySettingList();
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
    this.isloading = false;
    this.isInitialLoad = false;
  }

  getUserRole() {
    if (this.userId) {
      this._userService
        .getUserRole(this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            this.roles = data.role;
            if (this.roles) {
              this.roles.forEach((role) => {
                if (role.role == "Super Admin") {
                  this.hasAccess = true;
                }
              });
            }

            this.isAccessChecked = true;
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.isAccessChecked = true;
    }
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

            let cityAgendaFeature = companyFeatures.filter((f) => {
              return f.feature_name == "City Agenda" && f.status == 1;
            });
            if (cityAgendaFeature?.length > 0) {
              this.blogTitle =
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
              if (
                this.blogTitle != "Services" &&
                this.blogTitle != "Servicios" &&
                this.blogTitle != "Services" &&
                this.blogTitle != "Áreas"
              ) {
                this.isBlogEnabled = true;
              }
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

          this.companyFeatures =
            this.companyFeatures &&
            this.companyFeatures.sort((a, b) => {
              return a.sequence - b.sequence;
            });
          this.allCompanyFeatures = this.companyFeatures;
          this.includeFeaturesSubmenuItems();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getMainMenuItems() {
    this.mainMenuItems = [
      {
        icon: "./assets/images/new-design/icons/General.png",
        text: this._translateService.instant("company-settings.general"),
        value: "Others",
        submenus: [
          {
            text: this._translateService.instant(
              "company-settings.personalsettings"
            ),
            value: "Personal settings",
          },
          {
            text: this._translateService.instant(
              "company-settings.companydetails"
            ),
            value: "Company details",
          },
          {
            text: this._translateService.instant(
              "company-settings.customizedesign"
            ),
            value: "Customize design",
          },
        ],
      },
      {
        icon: "./assets/images/new-design/icons/User.png",
        text: this._translateService.instant("company-settings.users"),
        value: "Users",
        submenus: [
          {
            text: this._translateService.instant("company-settings.members"),
            value: "Users",
          },
          // {
          //   text: this._translateService.instant("guests.guests"),
          //   value: "Guests",
          // },
          // {
          //   text: this._translateService.instant(
          //     "company-settings.userprofiles"
          //   ),
          //   value: "Profile",
          // },
        ],
      },
      // {
      //   icon: "./assets/images/new-design/icons/General.png",
      //   text: this._translateService.instant("company-settings.channels"),
      //   value: "Channels",
      //   submenus: [
      //     {
      //       text: this._translateService.instant("company-settings.email"),
      //       value: "Notifications",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.wall"),
      //       value: "Wall",
      //     },
      //   ],
      // },
      {
        icon: "./assets/images/new-design/icons/Personalization.png",
        text: this._translateService.instant(
          "company-settings.personalization"
        ),
        value: "Personalization",
        submenus: [
          {
            text: this._translateService.instant("company-settings.modules"),
            value: "Features",
          },
          // {
          //   text: this._translateService.instant("company-settings.agenda"),
          //   value: "Dashboard",
          // },
        ],
      },
      {
        icon: "./assets/images/new-design/icons/Channels.png",
        text: this._translateService.instant("company-settings.adminaccess"),
        value: "AdminAccess",
        submenus: [
          // {
          //   text: this._translateService.instant(
          //     "company-settings.personalizehometemplate"
          //   ),
          //   value: "Customize home screen",
          // },
          // {
          //   text: this._translateService.instant(
          //     "company-settings.registration"
          //   ),
          //   value: "Registration",
          // },
          {
            text: this._translateService.instant(
              "company-settings.membertypes"
            ),
            value: "MemberTypes",
          },
        ],
      },
      // {
      //   icon: "./assets/images/new-design/icons/General.png",
      //   text: this._translateService.instant("company-settings.invoice"),
      //   value: "AdminAccess",
      //   submenus: [
      //     {
      //       text: this._translateService.instant("company-settings.invoices"),
      //       value: "Invoices",
      //     },
      //     {
      //       text: this._translateService.instant(
      //         "company-settings.membercommissions"
      //       ),
      //       value: "Member Commissions",
      //     },
      //     {
      //       text: this._translateService.instant(
      //         "company-settings.affiliationcommissions"
      //       ),
      //       value: "Affiliate Commissions",
      //     },
      //     {
      //       text: "MLM",
      //       value: "MLM",
      //     },
      //     {
      //       text: "Stripe",
      //       value: "Stripe",
      //     },
      //     {
      //       text: this._translateService.instant("members.offers"),
      //       value: "Offers",
      //     },
      //   ],
      // },
      {
        icon: "./assets/images/new-design/icons/Channels.png",
        text: this._translateService.instant("company-settings.tools"),
        value: "Tools",
        submenus: [
          // {
          //   text: this._translateService.instant("company-settings.inquiries"),
          //   value: "Surveys Home",
          // },
          // {
          //   text: this._translateService.instant("company-settings.surveys"),
          //   value: "Surveys",
          // },
          {
            text: this._translateService.instant("company-settings.reports"),
            value: "Reports",
          },
          // {
          //   text: this._translateService.instant(
          //     "company-settings.landingscaptacion"
          //   ),
          //   value: "Landings",
          // },
          // {
          //   text: this._translateService.instant(
          //     "company-settings.gamification"
          //   ),
          //   value: "Gamification",
          // },
          // {
          //   text: this._translateService.instant(
          //     "company-settings.supporttickets"
          //   ),
          //   value: "Support Tickets",
          // },
        ],
      },
      // {
      //   icon: "./assets/images/new-design/icons/General.png",
      //   text: this._translateService.instant("company-settings.affiliation"),
      //   value: "Affiliations",
      //   submenus: [
      //     {
      //       text: this._translateService.instant("company-settings.affiliates"),
      //       value: "Affiliates",
      //     },
      //     {
      //       text: this._translateService.instant(
      //         "company-settings.rrsstemplates"
      //       ),
      //       value: "RRSS Templates",
      //     },
      //   ],
      // },
      {
        icon: "./assets/images/new-design/icons/Channels.png",
        text: this._translateService.instant("company-settings.communication"),
        value: "Communication",
        submenus: [
          // {
          //   text: this._translateService.instant(
          //     "company-settings.notificationssettings"
          //   ),
          //   value: "Notifications Settings",
          // },
          // {
          //   text: this._translateService.instant("sidebar.yourmessages"),
          //   value: "Notifications List",
          // },
          {
            text: this._translateService.instant(
              "company-settings.automaticemails"
            ),
            value: "Automated Emails",
          },
        ],
      },
      // {
      //   icon: "./assets/images/new-design/icons/Channels.png",
      //   text: this._translateService.instant(
      //     "company-settings.dataadministration"
      //   ),
      //   value: "Data Administration",
      //   submenus: [
      //     {
      //       text: this._translateService.instant("company-settings.import"),
      //       value: "Import",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.export"),
      //       value: "Export",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.databackup"),
      //       value: "Data Backup",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.storage"),
      //       value: "Storage",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.recyclebin"),
      //       value: "Recycle Bin",
      //     },
      //     {
      //       text: this._translateService.instant("company-settings.audittrail"),
      //       value: "AuditTrail",
      //     },
      //   ],
      // },
      {
        icon: "./assets/images/new-design/icons/General.png",
        text: this._translateService.instant(
          "company-settings.managementsection"
        ),
        value: "ManagementSection",
        submenus: [],
      },
      // {
      //   icon: "./assets/images/new-design/icons/Channels.png",
      //   text: this._translateService.instant("company-settings.others"),
      //   value: "Others All",
      //   submenus: [
      //     {
      //       text: this._translateService.instant("company-settings.gatracking"),
      //       value: "Google Analytics Tracking ID",
      //     },
      //     {
      //       text: "Facebook Pixel",
      //       value: "Facebook Pixel",
      //     },
      //     {
      //       text: "Smartlook",
      //       value: "Smartlook",
      //     },
      //     {
      //       text: "Meta data",
      //       value: "Meta data",
      //     },
      //   ],
      // },
    ];
  }

  includeFeaturesSubmenuItems() {
    if (this.mainMenuItems) {
      this.mainMenuItems.forEach((mi) => {
        // if (mi.value == "Personalization") {
        //   if (this.isPlanEnabled) {
        //     let match =
        //       mi.submenus && mi.submenus.some((a) => a.value === "Events");
        //     if (!match) {
        //       mi.submenus.push({
        //         text: `${this._translateService.instant(
        //           "company-settings.parameterize"
        //         )} ${this.planTitle}`,
        //         value: "Events",
        //       });
        //     }
        //   }
        //   if (this.isClubEnabled) {
        //     let match =
        //       mi.submenus && mi.submenus.some((a) => a.value === "Groups");
        //     if (!match) {
        //       mi.submenus.push({
        //         text: `${this._translateService.instant(
        //           "company-settings.parameterize"
        //         )} ${this.clubTitle}`,
        //         value: "Groups",
        //       });
        //     }
        //   }
        // }

        if (mi.value == "ManagementSection") {
          if (this.isPlanEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Events");
            if (!match) {
              mi.submenus.push({
                text: this.planTitle,
                value: "Events",
              });
            }
          }
          if (this.isClubEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Groups");
            if (!match) {
              mi.submenus.push({
                text: this.clubTitle,
                value: "Groups",
              });
            }
          }
          if (this.hasActivityFeed) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Posts");
            if (!match) {
              mi.submenus.push({
                text: this._translateService.instant("company-settings.posts"),
                value: "Posts",
              });
            }
          }
          if (this.isBlogEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Content");
            if (!match) {
              mi.submenus.push({
                text: this.blogTitle,
                value: "Content",
              });
            }
          }
          if (this.isCourseEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Courses");
            if (!match) {
              mi.submenus.push({
                text: this.courseTitle,
                value: "Courses",
              });
            }
          }
          if (this.hasJobOffers) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "JobOffers");
            if (!match) {
              mi.submenus.push({
                text: this.jobOffersTitle,
                value: "JobOffers",
              });
            }
          }

          if (this.hasActivityFeed) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Posts");
            if (!match) {
              mi.submenus.push({
                text: this._translateService.instant("company-settings.posts"),
                value: "Posts",
              });
            }
          }
          if (this.isDiscountEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Discounts");
            if (!match) {
              mi.submenus.push({
                text: this.discountTitle,
                value: "Discounts",
              });
            }
          }

          let cities_match =
            mi.submenus && mi.submenus.some((a) => a.value === "Cities");
          if (!cities_match) {
            mi.submenus.push({
              text: this._translateService.instant("company-settings.cities"),
              value: "Cities",
            });
          }

          if (this.hasCustomInvoice) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Invoices");
            if (!match) {
              mi.submenus.push({
                text: this._translateService.instant(
                  "company-settings.invoices"
                ),
                value: "Invoices",
              });
            }
          }

          if (this.isTutorsEnabled) {
            let match =
              mi.submenus && mi.submenus.some((a) => a.value === "Discounts");
            if (!match) {
              mi.submenus.push({
                text: this.tutorsTitle,
                value: "Tutors",
              });
            }
          }
        }
      });
    }

    this.allMainMenuItems = this.mainMenuItems;
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

                  let contactUsSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Contact Us") >= 0;
                  });
                  if (contactUsSettings && contactUsSettings[0]) {
                    this.showContactUs =
                      contactUsSettings[0].active == 1 ? true : false;
                  }

                  let landingPagesSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Landing pages") >= 0;
                  });
                  if (landingPagesSettings && landingPagesSettings[0]) {
                    this.canCreateLandingPages =
                      landingPagesSettings[0].active == 1 ? true : false;
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

            this.getSettingsCategories();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getSettingsCategories() {
    this._companyService
      .getOtherSettingsCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          let other_categories = response["categories"];
          if (other_categories) {
            let isPlanEnabled;
            let isClubEnabled;
            let companyFeatures = this._localService.getLocalStorage(
              environment.lsfeatures
            )
              ? JSON.parse(
                  this._localService.getLocalStorage(environment.lsfeatures)
                )
              : "";
            if (companyFeatures) {
              let planFeature = companyFeatures.filter((f) => {
                return f.feature_name == "Plans" && f.status == 1;
              });
              if (planFeature?.length > 0) {
                isPlanEnabled = true;
              }

              let clubFeature = companyFeatures.filter((f) => {
                return f.feature_name == "Clubs" && f.status == 1;
              });
              if (clubFeature?.length > 0) {
                isClubEnabled = true;
              }
              if (!isPlanEnabled) {
                other_categories = other_categories.filter((setting) => {
                  return setting.category_en != "Events";
                });
              }

              if (!isClubEnabled) {
                other_categories = other_categories.filter((setting) => {
                  return setting.category_en != "Clubs";
                });
              }
            }
          }
          console.log(other_categories);
          this.otherSettingsCategories = other_categories;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  includeSettingsMenuItems() {
    this.mainMenuItems.push({
      icon: "./assets/images/new-design/icons/General.png",
      text: this._translateService.instant("company-settings.reports"),
      value: "Reports",
    });
    if (this.hasInvitations) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/User.png",
        text: this._translateService.instant("user-popup.guests"),
        value: "Guests",
      });
    }
    if (this.hasSurveys) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this._translateService.instant("company-settings.surveys"),
        value: "Surveys",
      });
    }
    if (this.hasQuizzes) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this._translateService.instant("your-admin-area.tests"),
        value: "Quizzes",
      });
    }
  }

  includeFeaturesMenuItems() {
    if (this.isPlanEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/Calendar-white.png",
        text: this.planTitle,
        value: "Plans",
      });
    }
    if (this.isClubEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this.clubTitle,
        value: "Clubs",
      });
    }
    if (this.isClubEnabled && this.companyId == 12) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: "GAR",
        value: "Gar",
      });
    }
    if (this.isBlogEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this.blogTitle,
        value: "Content",
      });
    }
    if (this.isDiscountEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/Database.png",
        text: this.discountTitle,
        value: "Discounts",
      });
    }
    if (this.isServicesEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this.servicesTitle,
        value: "Services",
      });
    }
    if (this.isCourseEnabled) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this.courseTitle,
        value: "Courses",
      });
    }
    if (this.hasJobOffers) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this.jobOffersTitle,
        value: "JobOffers",
      });
    }
    if (this.hasAffiliates) {
      this.mainMenuItems.push({
        icon: "./assets/images/new-design/icons/General.png",
        text: this._translateService.instant("company-settings.affiliates"),
        value: "Affiliates",
      });
    }
  }

  showContent(content, menu) {
    if (menu.value == "ManagementSection") {
      console.log("Content: " + content);
      if (content == "Events") {
        this._router.navigate([`/settings/manage-list/plans`]);
      } else if (content == "Groups") {
        this._router.navigate([`/settings/manage-list/clubs`]);
      } else if (content == "JobOffers") {
        this._router.navigate([`/settings/manage-list/canalempleo`]);
      } else if (content == "Cities") {
        this._router.navigate([`/settings/manage-list/cities`]);
      }
      // else if (content == "Courses") {
      //   this._router.navigate([`/settings/courses`]);
      // } else if (content == "Content") {
      //   this._router.navigate([`/settings/blogs`]);
      // } else if (content == "Discounts") {
      //   this._router.navigate([`/settings/discounts`]);
      // } else if (content == "Services") {
      //   this._router.navigate([`/settings/services`]);
      // } else if (content == "Posts") {
      //   this._router.navigate([`/settings/posts`]);
      // } else if (content == "Buddy") {
      //   this._router.navigate([`/settings/buddies`]);
      // } else if (content == "Invoices") {
      //   this._router.navigate([`/settings/member-invoices`]);
      // } else if (content == "Tutors") {
      //   this._router.navigate([`/settings/tutors`]);
      // }
    } else if (menu.value == "Users" && content == "Users") {
      this._router.navigate([`/settings/manage-list/users`]);
    } else if (menu.value == "Tools" && content == "Reports") {
      this._router.navigate([`/settings/reports`]);
    }
    // else if (menu.value == "Users" && content == "Guests") {
    //   this._router.navigate([`/settings/guests`]);
    // } else if (menu.value == "Tools" && content == "Support Tickets") {
    //   this._router.navigate([`/user-settings/support-tickets`]);
    // } else if (menu.value == "Tools" && content == "Surveys") {
    //   this._router.navigate([`/settings/surveys`]);
    // } else if (
    //   menu.value == "Communication" &&
    //   content == "Notifications Settings"
    // ) {
    //   this._router.navigate([`/settings/notification-settings`]);
    // } else if (menu.value == "Data Administration" && content == "Export") {
    //   this._router.navigate([`/settings/database`]);
    // } else if (menu.value == "Data Administration" && content == "AuditTrail") {
    //   this._router.navigate([`/settings/audit-trail`]);
    // } else if (menu.value == "Others All") {
    //   this._router.navigate([`/settings/setting/10`]);
    // } else if (menu.value == "Channels" && content == "Notifications") {
    //   this.showEmailSettingsModal = true;
    // }
    else if (content == "Features") {
      this._router.navigate([`/settings/features`]);
    } else {
      let otherSettingsCategory;
      if (this.otherSettingsCategories) {
        let cat =
          this.otherSettingsCategories &&
          this.otherSettingsCategories.filter((otc) => {
            return (
              otc.category_en == content ||
              otc.category_es == content ||
              otc.category_fr == content
            );
          });
        if (cat && cat[0]) {
          otherSettingsCategory = cat[0];
        }
      }

      if (otherSettingsCategory) {
        this._router.navigate([
          `/settings/setting/${otherSettingsCategory.id}`,
        ]);
      } else if (content == "MemberTypes") {
        this._router.navigate([`/settings/manage-list/membertypes`]);
      } else if (content == "Automated Emails") {
        this._router.navigate([`/settings/setting/9`]);
      }
      // else if (content == "Dashboard") {
      //   this._router.navigate([`/settings/setting/5`]);
      // }
    }
  }

  handleSearchChanged(event) {
    this.search = event || "";
    this.searchSettings();
  }

  searchSettings() {
    let mainMenuItems = this.allMainMenuItems;
    let allSearchSettings = this.allSettings;
    let searchMenuItems: any[] = [];
    const lang = this.language;

    if (this.search && mainMenuItems) {
      const temp = allSearchSettings.filter((item: any) => {
        if (
          (item["category_" + lang] &&
            item["category_" + lang]
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) >= 0) ||
          (item["title_" + lang] &&
            item["title_" + lang]
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) >= 0) ||
          (item["description_" + lang] &&
            item["description_" + lang]
              .toLowerCase()
              .indexOf(this.search.toLowerCase()) >= 0)
        ) {
          return true;
        }
        return false;
      });

      for (const mnu of mainMenuItems) {
        let include = false;

        if (
          mnu.text &&
          mnu.text.toLowerCase().indexOf(this.search.toLowerCase()) >= 0
        ) {
          include = true;
          searchMenuItems.push(mnu);
        }

        if (mnu.submenus && !include) {
          const submenus = mnu.submenus.filter(
            (submenu) =>
              submenu.text?.toLowerCase().indexOf(this.search.toLowerCase()) >=
              0
          );

          if (submenus.length > 0) {
            searchMenuItems.push({ ...mnu, submenus });
            include = true;
          }
        }

        if (mnu.submenus && !include) {
          const submenus = mnu.submenus.filter((submenu) =>
            temp.some(
              (b: any) =>
                b["category_" + lang].toLowerCase() ==
                submenu.text.toLowerCase()
            )
          );

          if (submenus.length > 0) {
            searchMenuItems.push({ ...mnu, submenus });
            include = true;
          }
        }
      }
    } else if (!this.search) {
      searchMenuItems = this.allMainMenuItems;
    }

    this.mainMenuItems = searchMenuItems;
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}