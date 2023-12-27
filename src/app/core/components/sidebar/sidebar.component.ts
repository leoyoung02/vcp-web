import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  inject,
} from "@angular/core";
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { AuthService, MenuService } from "src/app/core/services";
import { LocalService } from "@share/services";
import { LogoComponent } from "../logo/logo.component";
import { COMPANY_IMAGE_URL } from "@lib/api-constants";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { initFlowbite } from "flowbite";
import { MenuIcon } from "@lib/interfaces";
import {
  faGear,
  faSearch,
  faGlobe,
  faBell,
  faHome,
  faCalendarAlt,
  faUsers,
  faUserFriends,
  faSitemap,
  faCity,
  faChalkboardTeacher,
  faEdit,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { FormsModule } from "@angular/forms";
import menuIconsData from "src/assets/data/menu-icons.json";
import { environment } from "@env/environment";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    LogoComponent,
  ],
  templateUrl: "./sidebar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  menus$ = inject(MenuService).menus$;
  menuIcons: MenuIcon[] = menuIconsData;

  @Input() menus: any;
  @Input() company: any;
  @Input() otherSettings: any;
  @Input() username: any;
  @Input() isAdmin: any;
  @Input() languages: any;
  @Input() language: any;
  @Input() imageSrc: any;
  @Input() userid: any;
  @Input() notifications: any;
  @Input() popupNotifications: any;
  @Input() canManageEvents: any;
  @Input() customMemberTypeName: any;
  @Input() expireDays: any;
  @Input() expireDaysDiff: any;
  @Input() cancelDays: any;
  @Input() memberTypeExpirations: any;
  @Input() currentUser: any;
  @Input() isTutorUser: any;
  @Input() hasEventCalendar: any;
  @Input() hasTutors: any;
  @Input() canCreateCourse: any;
  @Input() coursesTitle: any;
  @Input() tutorManageStudentAccess: any;
  @Input() hasCreditSetting: any;
  @Input() hasCreditPackageSetting: any;
  @Input() myActivitiesTitle: any;
  @Input() myClubsTitle: any;
  @Input() buttonColor: any;
  @Input() hoverColor: any;
  @Input() logoSource: any;
  @Input() isUESchoolOfLife: any;
  @Input() refreshedMenu: any;
  @Output() changeLanguage = new EventEmitter();

  logoSrc: string = COMPANY_IMAGE_URL;
  companyName: any;
  primaryColor: any;
  menuColor: any;
  courseWallButton: any;
  navMenus: any = [];
  gearIcon = faGear;
  searchIcon = faSearch;
  globeIcon = faGlobe;
  bellIcon = faBell;
  homeIcon = faHome;
  planIcon = faCalendarAlt;
  clubIcon = faUsers;
  memberIcon = faUserFriends;
  employmentIcon = faSitemap;
  serviceIcon = faCity;
  courseIcon = faChalkboardTeacher;
  blogIcon = faEdit;
  graduationCapIcon = faGraduationCap;

  navigationSubscription;
  hasActivityFeed: boolean = false;
  showProfileButton: boolean = false;
  insertSmartlookScript: any;
  insertFacebookPixelScript: any;
  insertLinkedInScript: any;
  hasCRM: boolean = false;
  hasInvitations: boolean = false;
  myActivities: any = [];
  courseWallPrefix: any;
  courseWallPrefixTextValue: string = "";
  courseWallPrefixTextValueEn: string = "";
  courseWallPrefixTextValueFr: string = "";
  courseWallPrefixTextValueEu: string = "";
  courseWallPrefixTextValueCa: string = "";
  courseWallPrefixTextValueDe: string = "";
  hasCourseWallDropdown: boolean = false;
  courseWallDropdownMenu: any = {};
  selectedTab: any = "home";
  isMyClubsActive: boolean = false;
  isMyActivitiesActive: boolean = false;
  myClubs: any;
  hasCRMFeature: boolean = false;
  currentWallId: any;
  wallSelected: boolean = false;
  collapsed: boolean = true;
  search: any;
  menuOpened: boolean = false;
  menuHover: boolean = false;
  hoveredMenuPath: any;
  searchHover: boolean = false;
  settingsHover: boolean = false;
  wallMenuOpened: boolean = false;
  wallMenuHover: boolean = false;
  languageHover: boolean = false;
  hoveredCourseWallPath: any;
  courseWallHover: any;
  hasGenericWallDropdown: boolean = false;
  genericWallDropdownMenu: any;

  constructor(
    private _router: Router, 
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _localService: LocalService,
  ) {
    this.navigationSubscription = this._router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.wallSelected = false;
        this.currentWallId = null;
        var splitRowObject = this._router.url?.split("/");
        if (this._router.url?.indexOf("activity-feed/wall") >= 0) {
          if (this._router.url == "/activity-feed/wall/0") {
          } else {
            this.wallSelected = true;
          }
          this.currentWallId = this._router.url?.replace(
            "/activity-feed/wall/",
            ""
          );
        }
        let route = "home";
        if (splitRowObject.length > 1) {
          route = splitRowObject[1];
        } else {
        }
        this.selectedTab = route || "home";
      }
    });
  }

  async ngOnInit() {
    this.companyName = this.company.entity_name;
    this.menuColor = this.company.menu_color || "#ffffff";
    this.primaryColor = this.company.primary_color || this.company.button_color;
    this.buttonColor = this.company.button_color || this.company.primary_color;
    this.logoSrc = `${COMPANY_IMAGE_URL}/${this.company?.image}`;
    this.courseWallButton = this.company?.course_wall_button;
    this.courseWallPrefix = this.company?.course_wall_prefix;
    this.courseWallPrefixTextValue = this.company?.course_wall_prefix_text;
    this.courseWallPrefixTextValueEn = this.company?.course_wall_prefix_text_en;
    this.courseWallPrefixTextValueFr = this.company?.course_wall_prefix_text_fr;
    this.courseWallPrefixTextValueEu = this.company?.course_wall_prefix_text_eu;
    this.courseWallPrefixTextValueCa = this.company?.course_wall_prefix_text_ca;
    this.courseWallPrefixTextValueDe = this.company?.course_wall_prefix_text_de;
    this.getCourseWallMenuText();

    setTimeout(() => {
      initFlowbite();
    }, 1000)
  }

  getCourseWallMenuText() {
    return this.courseWallPrefix ? this.language == 'en' ? (this.courseWallPrefixTextValueEn || this.courseWallPrefixTextValue) : (this.language == 'fr' ? (this.courseWallPrefixTextValueFr || this.courseWallPrefixTextValue) : 
        (this.language == 'eu' ? (this.courseWallPrefixTextValueEu || this.courseWallPrefixTextValue) : (this.language == 'ca' ? (this.courseWallPrefixTextValueCa || this.courseWallPrefixTextValue) : 
        (this.language == 'de' ? (this.courseWallPrefixTextValueDe || this.courseWallPrefixTextValue) : this.courseWallPrefixTextValue)
      ))
    ) : this._translateService.instant('sidebar.activityfeed');
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChange) {
    let menuChange = changes["menus"];
    if (menuChange?.currentValue?.length > 0) {
      let menus = menuChange.currentValue;
      let navmenus = menus?.filter((cw) => {
        return cw.course_wall != 11;
      });
      this.navMenus = navmenus;
      this.checkCourseWalls(menuChange.currentValue);
    }

    let otherSettingsChange = changes["otherSettings"];
    if (otherSettingsChange?.currentValue?.length > 0) {
      this.getSettings();
    }

    let refreshedMenuChange = changes["refreshedMenu"];
    if (refreshedMenuChange && 
      (refreshedMenuChange?.previousValue != refreshedMenuChange?.currentValue ||
      refreshedMenuChange?.currentValue == true)
    ) {
      let menus = this.menus;
      if(menus?.length == 0) {
        this.refreshWallMenus(menus);
      } else {
        this.refreshWallMenus(menus);
      }
    }
  }

  refreshWallMenus(menus) {
    let local_menus = this._localService.getLocalStorage(environment.lsmenus);
    if(local_menus) {
      menus = JSON.parse(local_menus);
    }
    if(menus?.length > 0) {
      this.checkCourseWalls(menus);
    }
  }

  getSettings() {
    if (this.otherSettings) {
      this.otherSettings.forEach((m) => {
        if (m.title_es == "General") {
          if (m.content) {
            let hasActivityFeedSettings = m.content.filter((c) => {
              return c.title_en.indexOf("Activity feed") >= 0;
            });
            if (hasActivityFeedSettings && hasActivityFeedSettings[0]) {
              this.hasActivityFeed =
                hasActivityFeedSettings[0].active == 1 ? true : false;
            }

            let profileButtonSettings = m.content.filter((c) => {
              return c.title_en.indexOf("My Profile") >= 0;
            });

            if (profileButtonSettings && profileButtonSettings[0]) {
              this.showProfileButton =
                profileButtonSettings[0].active == 1 ? true : false;
            }
          }
        }

        if (m.title_es == "Módulos") {
          if (m.content) {
            let crmSettings = m.content.filter((c) => {
              return c.title_en == "CRM";
            });
            if (crmSettings && crmSettings[0]) {
              this.hasCRM = crmSettings[0].active == 1 ? true : false;
            }

            let inviteSettings = m.content.filter((c) => {
              return c.title_en == "Your Activity: Invitations";
            });
            if (inviteSettings && inviteSettings[0]) {
              this.hasInvitations =
                inviteSettings[0].active == 1 ? true : false;
            }
          }
        }
      });
    }
  }

  checkCourseWalls(menus) {
    if (menus?.length > 0) {
      let generic_wall_dropdown_row = menus?.filter((cw) => {
        return cw.path == '/activity-feed-0';
      });
      if(generic_wall_dropdown_row?.length > 0) {
        this.hasGenericWallDropdown = true;
        this.genericWallDropdownMenu = generic_wall_dropdown_row[0];
      }

      let course_wall_dropdown_row = menus?.filter((cw) => {
        return cw.course_wall == 11 || cw.course_wall == 1;
      });
      if (course_wall_dropdown_row?.length > 0 && !this.hasGenericWallDropdown) {
        this.hasCourseWallDropdown = true;
        this.courseWallDropdownMenu = course_wall_dropdown_row[0];
        if(this.courseWallDropdownMenu?.subs?.length > 0) {
        } else {
          let menu_items = [
            this.courseWallDropdownMenu
          ];
          this.courseWallDropdownMenu['subs'] = menu_items;
        }
      }

      setTimeout(() => {
        initFlowbite();
      }, 500);
    }
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(["/auth/login"]);
  }

  getLanguageTitle(language) {
    return this.language == "en"
      ? language.name_EN
      : this.language == "fr"
      ? language.name_FR || language.name_ES
      : this.language == "eu"
      ? language.name_EU || language.name_ES
      : this.language == "ca"
      ? language.name_CA || language.name_ES
      : this.language == "de"
      ? language.name_DE || language.name_ES
      : language.name_ES;
  }

  useLanguage(lang) {
    this.language = lang;
    this.changeLanguage.emit(lang);
    this.languageHover = false;
  }

  hasAccess(path) {
    let access = true;
    if (this.menus && this.menus.length) {
      let feature =
        this.menus &&
        this.menus.filter((m) => {
          return m.path == path;
        });
      if (feature && feature.length > 0) {
      } else {
        access = false;
      }
    }

    return access;
  }

  getCourseWallMenus(menus) {
    let mnus = [];
    if (menus?.length > 0) {
      mnus = menus.filter((mnu) => {
        return mnu.course_wall == 1;
      });
    }
    return mnus;
  }

  goToCourseWall(menu) {
    let id = menu.path.replace("activity-feed-", "");
    this.selectedTab = id;
    this._router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this._router.navigate([`/activity-feed/wall/${id}`]));
  }

  getCourseWallName(wall) {
    return this.language == "en"
      ? wall.name
        ? wall.name || wall.title
        : wall.name_ES
      : this.language == "fr"
      ? wall.name_FR
        ? wall.name_FR || wall.name_ES
        : wall.name_ES
      : this.language == "eu"
      ? wall.name_EU
        ? wall.name_EU || wall.name_ES
        : wall.name_ES
      : this.language == "ca"
      ? wall.name_CA
        ? wall.name_CA || wall.name_ES
        : wall.name_ES
      : this.language == "de"
      ? wall.name_DE
        ? wall.name_DE || wall.name_ES
        : wall.name_ES
      : wall.name_ES;
  }

  getCourseWallPrefix() {
    return this.language == "en"
      ? this.courseWallPrefixTextValue
        ? this.courseWallPrefixTextValue
        : this.courseWallPrefixTextValue
      : this.language == "fr"
      ? this.courseWallPrefixTextValueFr
        ? this.courseWallPrefixTextValueFr || this.courseWallPrefixTextValue
        : this.courseWallPrefixTextValue
      : this.language == "eu"
      ? this.courseWallPrefixTextValueEu
        ? this.courseWallPrefixTextValueEu || this.courseWallPrefixTextValue
        : this.courseWallPrefixTextValue
      : this.language == "ca"
      ? this.courseWallPrefixTextValueCa
        ? this.courseWallPrefixTextValueCa || this.courseWallPrefixTextValue
        : this.courseWallPrefixTextValue
      : this.language == "de"
      ? this.courseWallPrefixTextValueDe
        ? this.courseWallPrefixTextValueDe || this.courseWallPrefixTextValue
        : this.courseWallPrefixTextValue
      : this.courseWallPrefixTextValue;
  }

  goToManageStudents() {
    this._router.navigate([]).then((result) => {
      window.open("/settings/students-management", "_blank");
    });
  }

  getMenuIcon(menu) {
    let menuItem = this.menuIcons.filter((mnu) => {
      return mnu.path == menu.path;
    });

    let iconImage = "";
    if (menuItem && menuItem.length > 0) {
      iconImage = this.menuColor == '#000000' && menuItem[0].icondark ? menuItem[0].icondark : menuItem[0].icon
    }

    return iconImage;
  }

  getMenuFaCode(menu) {
    let menuItem = this.menuIcons.filter((mnu) => {
      return mnu.path == menu.path;
    });

    let iconImage = "";
    if (menuItem && menuItem.length > 0) {
      iconImage = menuItem[0]["facode"];
    }

    return iconImage;
  }

  getMenuFaIcon(menu) {
    let menuItem = this.menuIcons.filter((mnu) => {
      return mnu.path == menu.path;
    });

    let path = "";
    if (menuItem && menuItem.length > 0) {
      path = menuItem[0]["path"];
    }

    let icon;
    switch (path) {
      case "home":
        icon = this.homeIcon;
        break;
      case "plans":
        icon = this.planIcon;
        break;
      case "clubs":
      case "discounts":
        icon = this.clubIcon;
        break;
      case "employmentchannel":
      case "startups":
        icon = this.employmentIcon;
        break;
      case "cityguide":
      case "services":
        icon = this.serviceIcon;
        break;
      case "members":
      case "tutors":
        icon = this.memberIcon;
        break;
      case "courses":
      case "dashboard":
        icon = this.courseIcon;
        break;
      case "blog":
        icon = this.blogIcon;
        break;
      default:
        icon = null;
    }

    return icon;
  }

  getMenuTitle(menu) {
    let text = menu?.new_url == 1 && this.isUESchoolOfLife ? 'Vida Universitaria' :
      (this.language == "en"
        ? menu.name
        : this.language == "fr"
        ? menu.name_FR || menu.name_ES
        : this.language == "eu"
        ? menu.name_EU || menu.name_ES
        : this.language == "ca"
        ? menu.name_CA || menu.name_ES
        : this.language == "de"
        ? menu.name_DE || menu.name_ES
        : menu.name_ES);

    if(this.isUESchoolOfLife && text?.indexOf('de Vida Universitaria') >= 0) {
      text = text?.replace('de Vida Universitaria', 'de School of Life')
    }

    return text;
  }

  changeSelectedTab(path) {
    this.selectedTab = path;
  }

  toggleSidebar(mode: string = '', menu: any) {
    if(mode == 'icon') {
      if(menu?.path) {
        this.selectedTab = menu?.path;
      } else {
        if((menu == 'settings' || menu == 'language') && !menu?.path) {
          this.selectedTab = menu;
        }
      }
    } else {
      this.collapsed = !this.collapsed;
    }
    setTimeout(() => {
      initFlowbite();
    }, 100)
  }

  openUrl(link) {
    window.open(link, "_blank");
  }

  handleKeyPressed() {
    this.toggleSidebar('', {});
  }

  navigateToPage(menu) {
    if(menu?.new_button == 1 || menu?.new_url == 1) {
      this.openUrl(menu?.new_url == 1 && this.isUESchoolOfLife ? `https://${this.company?.url}` : menu?.path);
    } else {
      let link = menu?.path == 'home' ? '/' : menu?.path
      this._router.navigate([link])
    }
  }

  toggleHover(event) {
   this.menuOpened = event;
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  toggleMenuHover(event, menu) {
    this.hoveredMenuPath = menu.path;
    this.menuHover = event;
  }

  toggleSearchHover(event) {
    this.searchHover = event;
  }

  toggleSettingsHover(event) {
    this.settingsHover = event;
  }

  toggleWallMenuHover(event) {
    this.wallMenuHover = event;
  }

  toggleLanguageHover(event) {
    this.languageHover = event;
  }

  toggleCourseWallHover(event, menu) {
    this.hoveredCourseWallPath = menu.path;
    this.courseWallHover = event;
  }
}