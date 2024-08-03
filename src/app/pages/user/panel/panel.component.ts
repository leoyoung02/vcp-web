import { CommonModule, Location } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { 
  BreadcrumbComponent, 
  PageTitleComponent, 
  PanelMenuComponent, 
  PersonalInformationComponent, 
  PricePerServiceComponent, 
  RadialProgressComponent,
  ToastComponent 
} from "@share/components";
import { AuthService } from "@lib/services";
import { ProfessionalsService } from "@features/services";
import { initFlowbite } from "flowbite";
import { environment } from "@env/environment";
import get from "lodash/get";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    PageTitleComponent,
    BreadcrumbComponent,
    PanelMenuComponent,
    ToastComponent,
    RadialProgressComponent,
    PricePerServiceComponent,
    PersonalInformationComponent,
  ],
  templateUrl: "./panel.component.html"
})
export class UserPanelComponent {
  private destroy$ = new Subject<void>();

  @Input() id!: number;
  @Input() role: any;

  languageChangeSubscription;
  language: any;
  email: any;
  userId: any;
  companyId: any;
  domain: any;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  hoverColor: any;
  pageTitle: any;
  company: any;
  isMobile: boolean = false;

  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";

  menuItems: any = [];
  isAdmin: boolean = false;
  selectedMenu: any;

  showConfirmationModal: boolean = false;
  selectedItem: any;
  confirmTitle: any;
  confirmDescription: any;
  acceptText: string = "";
  cancelText: any = "";
  confirmMode: string = "";

  me: any;
  reviews: any = [];
  image: any;
  percentComplete: number = 0;
  receiveEmail: boolean = false;
  termsAndConditions: boolean = false;
  specialtyCategories: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _authService: AuthService,
    private _userService: UserService,
    private _companyService: CompanyService,
    private _professionalsService: ProfessionalsService,
    private _location: Location,
    ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }
    
  async ngOnInit() {
    initFlowbite();
    this.onResize();
    this.email = this._localService.getLocalStorage(environment.lsemail);
    this.language = this._localService.getLocalStorage(environment.lslang);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
      );
    this.domain = this._localService.getLocalStorage(environment.lsdomain);
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
      this.domain = company[0].domain;
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
        this.initializePage();
  }

  async initializePage() {
    this.pageTitle = this._translateService.instant("user-panel.userpanel");
    this.getProfile();
    this.initializeBreadcrumb();
    this.checkAdminPermissions();
  }

  getProfile() {
    this._professionalsService
      .getPanelProfile(this.id, this.role)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.me = data?.profile;
          this.image = `${environment.api}/${this.me?.image}`;
          if(this.role == 'professional') { this.initializeProfessionalProfile(data); }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializeProfessionalProfile(data) {
    this.reviews = this.formatReviews(data?.reviews);
    this.specialtyCategories = this.formatSpecialties(data);
    this.percentComplete = 60;
  }

  formatReviews(reviews) {
    let result: any[] = [];

    let startNum = 5;
    for(var i = 0; i < startNum; i++) {
      let rating = startNum - i;
      let cnt = reviews?.filter(review => {
        return review.rating == rating
      })
      let percentage = cnt?.length > 0 ? ((cnt?.length / reviews?.length) * 100) : 0;
      result.push({
        rating,
        percentage,
      })
    }

    return result;
  }

  formatSpecialties(data) {
    let list: any[] = [];

    list = data?.subcategory_mapping?.filter(subcategory => {
      return subcategory.professional_id == data?.profile?.id
    })?.map((row) => {
      return {
        id: row.id,
        category_image: row.category_image,
      }
    })

    let specialtyCategories: any[] = [];
    if(list?.length > 0) {
      list?.forEach(i => {
        let match = specialtyCategories.some(
          (a) => a.category_image == i.category_image
        );

        if(i.category_image && !match) {
          specialtyCategories.push({
            image: `${environment.api}/v3/image/professionals/category/${i.category_image}`,
          })
        }
      })
    }
    
    return specialtyCategories;
  }

  initializeBreadcrumb() {
    this.level1Title = this._translateService.instant("company-settings.home");
    this.level2Title = "";
    this.level3Title = "";
    this.level4Title = "";
  }

  checkAdminPermissions() {
    this._userService.isAdminById(this.userId).subscribe((res: any) => {
      this.isAdmin = res.isAdmin ? true : false;
      this.initializeMenu();
    })
  }

  initializeMenu() {
    this.menuItems = [
      {
        index: 0,
        text: this._translateService.instant('user-panel.personalinformation'),
        subtext: this._translateService.instant('user-panel.transactionsdesc'),
        action: 'personal-info',
        show_right_content: true,
      }
    ]

    if(this.role == 'professional') {
      this.menuItems.push({
        index: 1,
        text: this._translateService.instant('user-panel.aboutme'),
        subtext: this._translateService.instant('user-panel.aboutmedesc'),
        action: 'about-me',
        show_right_content: true,
      })
      this.menuItems.push({
        index: 2,
        text: this._translateService.instant('user-panel.createdservices'),
        subtext: this._translateService.instant('user-panel.createdservicesdesc'),
        action: 'services-created',
        show_right_content: true,
      })
    } else {
      this.menuItems.push({
        index: 1,
        text: this._translateService.instant('user-panel.servicesacquired'),
        subtext: this._translateService.instant('user-panel.servicesacquireddesc'),
        action: 'services-acquired',
        show_right_content: true,
      })
      this.menuItems.push({
        index: 2,
        text: this._translateService.instant('user-panel.availablebalance'),
        subtext: this._translateService.instant('user-panel.availablebalancedesc'),
        action: 'available-balance',
        show_right_content: true,
      })
    }

    this.menuItems.push({
      index: 3,
      text: this._translateService.instant('user-panel.transactions'),
      subtext: this._translateService.instant('user-panel.transactionsdesc'),
      action: 'transactions',
      show_right_content: true,
    })
    this.menuItems.push({
      index: 4,
      text: this._translateService.instant('notification-popup.notifications'),
      subtext: this._translateService.instant('user-panel.notificationsdesc'),
      action: 'notifications',
      show_right_content: true,
    })

    if(this.isAdmin) {
      this.menuItems.push({
        index: 5,
        text: this._translateService.instant('company-settings.settings'),
        subtext: '',
        action: 'settings',
        show_right_content: false,
      });
    }

    this.menuItems.push({
      index: 6,
      text: this._translateService.instant('user-popup.logout'),
      subtext: '',
      action: 'logout',
      show_right_content: false,
    });
    this.menuItems.push({
      index: 7,
      text: this._translateService.instant('user-panel.deleteaccount'),
      subtext: this._translateService.instant('user-panel.deletteaccountdesc'),
      action: 'delete-account',
      show_right_content: true,
    });

    this.initializeMenuDetails(this.menuItems?.length > 0 ? this.menuItems[0] : {});
  }

  initializeMenuDetails(menu) {
    this.level2Title = menu?.text || '';
    this.selectedMenu = menu;
  }

  handleMenuClick(event) {
    this.showConfirmationModal = false;
    this.initializeMenuDetails(event);

    switch(event?.action) {
      case 'settings':
        this.navigateToPage('/settings');
        break;
      case 'transactions':
        // this.navigateToPage('/users/my-transactions');
        break;
      case 'logout':
        this.confirmLogout(event);
        break;
    }
  }

  navigateToPage(link) {
    this._router.navigate([link]);
  }

  confirmLogout(event) {
    this.showConfirmationModal = false;
    this.confirmMode = event?.action;
    this.confirmTitle = this._translateService.instant(
        "user-panel.confirmlogout"
    );
    this.confirmDescription = this._translateService.instant(
        "user-panel.confirmlogoutdesc"
    );
    this.acceptText = "OK";
    setTimeout(() => (this.showConfirmationModal = true));
  }

  confirm() {
    if(this.confirmMode == 'logout') {
      this.logout();
    }
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(["/auth/login"]);
  }

  handleGoBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}