import { CommonModule, Location } from "@angular/common";
import { ChangeDetectorRef, Component, HostListener, Input } from "@angular/core";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, ExcelService, LocalService, UserService } from "@share/services";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import {
  AboutMeComponent,
  BarChartComponent,
  BreadcrumbComponent,
  DonutComponent,
  LineChartComponent,
  MultimediaContentComponent,
  PageTitleComponent,
  PanelMenuComponent,
  WithdrawalMethodsComponent,
  PersonalInformationComponent,
  PieChartComponent,
  PricePerServiceComponent,
  RadialProgressComponent,
  SemiDonutComponent,
  StackedBarChartComponent,
  ToastComponent,
  TransactionsComponent,
  WalletComponent
} from "@share/components";
import { AuthService } from "@lib/services";
import { ProfessionalsService } from "@features/services";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { initFlowbite } from "flowbite";
import { environment } from "@env/environment";
import moment from "moment";
import get from "lodash/get";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    MatSnackBarModule,
    PageTitleComponent,
    BreadcrumbComponent,
    PanelMenuComponent,
    ToastComponent,
    RadialProgressComponent,
    PricePerServiceComponent,
    PersonalInformationComponent,
    AboutMeComponent,
    MultimediaContentComponent,
    TransactionsComponent,
    PieChartComponent,
    SemiDonutComponent,
    BarChartComponent,
    DonutComponent,
    StackedBarChartComponent,
    LineChartComponent,
    WalletComponent,
    WithdrawalMethodsComponent,
  ],
  templateUrl: "./panel.component.html"
})
export class UserPanelComponent {
  private destroy$ = new Subject<void>();

  @Input() id!: number;
  @Input() role: any;
  @Input() action: any;

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
  subcategories: any = [];
  gender: any = [];
  languages: any = [];
  supportedLanguages: any = [];
  images: any = [];
  specialties: any = [];
  subcategoryMapping: any = [];
  totalEarnings: any;
  showFilesUpload: boolean = false;
  imageAdded: any;

  startDate: any;
  endDate: any;
  month: any;
  selectedDates: any;
  invoiceTotal: any;
  currentInvoiceTotal: any;
  companyName: any;
  transactions: any = [];
  currentMonth: any;
  
  weekLabels: any = [];
  weekData: any = [];
  monthLabels: any = [];
  monthData: any = [];
  currentDay: any;
  currentYear: any;
  currentDate: any;
  withdrawalMethodsTitle: any;
  withdrawalMethods: boolean = false;
  walletAmount: any;
  walletData: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _authService: AuthService,
    private _userService: UserService,
    private _companyService: CompanyService,
    private _professionalsService: ProfessionalsService,
    private _excelService: ExcelService,
    private _snackBar: MatSnackBar,
    private _location: Location,
    private cd: ChangeDetectorRef
  ) { }

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
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
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
      
      let companyName = company[0].entity_name?.toLowerCase()?.replace(' ', '');
      this.companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);

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
        });

    this.initializePage();
  }

  async initializePage(menu: string = '') {
    this.pageTitle = this._translateService.instant("user-panel.userpanel");
    this.getProfile();
    this.initializeBreadcrumb();
    this.checkAdminPermissions(menu);
  }

  getProfile() {
    this._professionalsService
      .getPanelProfile(this.id, this.role)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.me = data?.profile;
          this.gender = this.formatList(data?.gender);
          this.languages = this.formatList(data?.languages);
          this.supportedLanguages = this.formatList(data?.supported_languages, 'button-group');
          this.images = this.formatImages(data?.images);
          this.image = `${environment.api}/${this.me?.image}`;
          this.receiveEmail = this.me?.receive_email_preference == 1 ? true : false;
          this.termsAndConditions = this.me?.accepted_conditions == 1 ? true : false;
          this.subcategories = this.formatSubcategories(data?.subcategories);
          this.subcategoryMapping = data?.subcategory_mapping;
          this.specialties = this.formatSpecialties(data);
          if (this.role == 'professional') { 
            this.initializeProfessionalProfile(data); 
            this.initializeWallet();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializeProfessionalProfile(data) {
    this.reviews = this.formatReviews(data?.reviews);
    this.specialtyCategories = this.formatSpecialtyCategories(data);
    this.percentComplete = data?.profile_percentage;
    this.totalEarnings = data?.total_earnings;
  }

  formatList(list, mode: string = '') {
    if (mode == 'button-group') {
      let results: any[] = [];

      list?.forEach((language) => {
        results.push({
          id: language.id,
          value: language.code,
          text: this.getItemName(language),
          selected: language.default || language.code == this.language ? true : false,
          code: language.code,
        });
      });

      return results;
    } else {
      return list?.map((item) => {
        return {
          id: item.id,
          name: this.getItemName(item),
        };
      });
    }
  }

  getItemName(item) {
    return item
      ? this.language == "en"
        ? item.name_EN ||
        item.name_ES
        : this.language == "fr"
          ? item.name_FR ||
          item.name_ES
          : this.language == "eu"
            ? item.name_EU ||
            item.name_ES
            : this.language == "ca"
              ? item.name_CA ||
              item.name_ES
              : this.language == "de"
                ? item.name_DE ||
                item.name_ES
                : this.language == "it"
                  ? item.name_IT ||
                  item.name_ES
                  : item.name_ES
      : "";
  }

  formatReviews(reviews) {
    let result: any[] = [];

    let startNum = 5;
    for (var i = 0; i < startNum; i++) {
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

  formatSpecialtyCategories(data) {
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
    if (list?.length > 0) {
      list?.forEach(i => {
        let match = specialtyCategories.some(
          (a) => a.category_image == i.category_image
        );

        if (i.category_image && !match) {
          specialtyCategories.push({
            image: `${environment.api}/v3/image/professionals/category/${i.category_image}`,
          })
        }
      })
    }

    return specialtyCategories;
  }

  formatImages(images) {
    images = images?.map((item) => {
      return {
        image: `${environment.api}/${item.image}`
      };
    });

    let imagesObject: any[] = [];
    if (images?.length > 0) {
      images?.forEach(image => {
        imagesObject.push({
          image: image?.image,
          thumbImage: image?.image,
        })
      });
    }

    return imagesObject;
  }

  saveMultimediaContent() {
    let params = {
      id: this.me?.id,
      company_id: this.companyId,
      images: this.imageAdded,
    }

    this._professionalsService
      .addMultimediaImage(params)
      .subscribe(
        (response) => {
          this.showFilesUpload = true;
          setTimeout(() => {
            this.showFilesUpload = false;
          })

          this.imageAdded = '';
          this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          this.images = this.formatImages(response?.images);
          localStorage.removeItem('professional_gallery_image_file');
          this.cd.detectChanges();
        },
        (error) => {
          this.open(
            this._translateService.instant("dialog.error"),
            ""
          );
        }
      );
  }

  formatSubcategories(list) {
    return list?.map((row) => {
      return {
        id: row.id,
        text: this.getSubcategoryText(row)
      }
    })
  }

  formatSpecialties(item) {
    let filtered_list: any[] = []
    if (this.role == 'professional') {
      filtered_list = this.subcategoryMapping?.filter(subcategory => {
        return subcategory.professional_id == this.me?.id
      })
    } else {
      filtered_list = this.subcategoryMapping?.filter(subcategory => {
        return subcategory.user_id == this.me?.id
      })
    }

    filtered_list = filtered_list?.map((row) => {
      return {
        id: row.professional_subcategory_id,
        text: this.getSubcategoryText(row)
      }
    })

    return filtered_list;
  }

  getSubcategoryText(subcategory) {
    return subcategory
      ? this.language == "en"
        ? subcategory.subcategory_en ||
        subcategory.subcategory_es
        : this.language == "fr"
          ? subcategory.subcategory_fr ||
          subcategory.subcategory_es
          : this.language == "eu"
            ? subcategory.subcategory_eu ||
            subcategory.subcategory_es
            : this.language == "ca"
              ? subcategory.subcategory_ca ||
              subcategory.subcategory_es
              : this.language == "de"
                ? subcategory.subcategory_de ||
                subcategory.subcategory_es
                : this.language == "it"
                  ? subcategory.subcategory_it ||
                  subcategory.subcategory_es
                  : subcategory.subcategory_es
      : "";
  }

  initializeBreadcrumb() {
    this.level1Title = this._translateService.instant("company-settings.home");
    this.level2Title = "";
    this.level3Title = "";
    this.level4Title = "";
  }

  checkAdminPermissions(menu: string = '') {
    this._userService.isAdminById(this.userId).subscribe((res: any) => {
      this.isAdmin = res.isAdmin ? true : false;
      this.initializeMenu(menu);
    })
  }

  initializeMenu(menu: string = '') {
    this.menuItems = [
      {
        index: 0,
        text: this._translateService.instant('user-panel.personalinformation'),
        subtext: this._translateService.instant('user-panel.transactionsdesc'),
        action: 'personal-info',
        show_right_content: true,
      }
    ]

    if (this.role == 'professional' || this.isAdmin) {
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
        this.menuItems.push({
          index: 3,
          text: this._translateService.instant('professionals.wallet'),
          subtext: this._translateService.instant('professionals.walletdesc'),
          action: 'wallet',
          show_right_content: true,
        })
      }
      this.menuItems.push({
        index: 4,
        text: this._translateService.instant('user-panel.transactions'),
        subtext: this._translateService.instant('user-panel.transactionsdesc'),
        alternative_text: this._translateService.instant('user-panel.earnings'),
        action: 'transactions',
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
      index: 5,
      text: this._translateService.instant('notification-popup.notifications'),
      subtext: this._translateService.instant('user-panel.notificationsdesc'),
      action: 'notifications',
      show_right_content: true,
    })

    if (this.isAdmin) {
      this.menuItems.push({
        index: 6,
        text: this._translateService.instant('company-settings.settings'),
        subtext: '',
        action: 'settings',
        show_right_content: false,
      });
    }

    this.menuItems.push({
      index: 7,
      text: this._translateService.instant('user-popup.logout'),
      subtext: '',
      action: 'logout',
      show_right_content: false,
    });
    this.menuItems.push({
      index: 8,
      text: this._translateService.instant('user-panel.deleteaccount'),
      subtext: this._translateService.instant('user-panel.deletteaccountdesc'),
      action: 'delete-account',
      show_right_content: true,
    });

    let initial_menu = this.menuItems?.length > 0 ? this.menuItems[0] : {};
    if (menu) {
      let menu_item = this.menuItems.find((c) => c.action == menu);
      if (menu_item) {
        initial_menu = menu_item
      }
    } else {
      if(this.action) {
        let menu_item = this.menuItems.find((c) => c.action == this.action);
        if (menu_item) {
          initial_menu = menu_item
        }
      }
    }

    if(this.action == 'wallet') { this.initializeWallet(); }
    this.initializeMenuDetails(initial_menu);
  }

  initializeMenuDetails(menu) {
    this.level2Title = menu?.text || '';
    this.selectedMenu = menu;
  }

  handleMenuClick(event) {
    this.showConfirmationModal = false;
    if (event.action != 'logout' && event.action != 'delete-account' && event.action != 'notifications') {
      this.initializeMenuDetails(event)
    };

    switch (event?.action) {
      case 'settings':
        this.navigateToPage('/settings');
        break;
      case 'transactions':
        this.initializeTransactions();
        break;
      case 'wallet':
        this.initializeWallet();
        break;
      case 'notifications':
        this.navigateToPage(`/users/notifications/${this.id}`);
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
    if (this.confirmMode == 'logout') {
      this.logout();
    }
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(["/auth/login"]);
  }

  handlePersonalInformationSaved() {
    this.initializePage();
  }

  handleChangePreference(event, mode) {
    let params = {
      status: event.target.checked ? 1 : 0,
      mode,
      id: this.id
    }

    this._professionalsService
      .editUserPreference(params)
      .subscribe(
        (response) => {
          this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
        },
        (error) => {
          this.open(
            this._translateService.instant("dialog.error"),
            ""
          );
        }
      );
  }

  handlePricePerServiceSaved(event) {
    let params = {
      id: this.me?.id,
      rates: event,
    }

    this._professionalsService
      .editPricePerService(params)
      .subscribe(
        (response) => {
          this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
        },
        (error) => {
          this.open(this._translateService.instant("dialog.error"), "");
        }
      );
  }

  handleAboutMeSaved(event) {
    if (event == 'success') {
      this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
      this.initializePage('about-me');
    } else {
      this.open(this._translateService.instant("dialog.error"), "");
    }
  }

  handleFilesUploaded(event) {
    this.imageAdded = event;
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
  }

  handleGoBack() {
    this._location.back();
  }

  initializeTransactions(startDate: string = '', endDate: string = '', invoiceTotal: number = 0, currentInvoiceTotal: number = 0, transactions: any = []) {
    let start = startDate ? moment(startDate) : moment().startOf('month');
    this.startDate = start.format('DD/MM/YYYY');

    let end = endDate ? moment(endDate) : moment().endOf('month');
    this.endDate = end.format('DD/MM/YYYY');

    let mEs = moment().locale('es');
    this.month = mEs.format('MMMM');
 
    this.selectedDates = `${this.startDate} ${this.endDate ? ' - ' : ''} ${this.endDate}`;

    this.invoiceTotal = invoiceTotal || 0;
    this.currentInvoiceTotal = currentInvoiceTotal || 0;
    this.transactions = transactions || [];

    this.initializeCharts();
  }

  initializeCharts() {
    this.currentDay = moment().locale(this.language).format('MMMM D, YYYY');
    this.weekLabels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
    this.weekData = [1, 1.1, null, null];

    this.currentDate = moment().locale(this.language).format('MMMM D');

    this.currentYear = moment().format('YYYY');
    this.monthLabels = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    this.monthData = [1, 1.1, 1.15, 1.2, 1.21, 1.22, 1.23, 1.25, null, null, null, null];
  }

  handleDateChange(event) {
    this.initializeTransactions((event?.start_date || ''), (event?.end_date || ''), event?.invoice_total, event?.selected_invoice_total, event?.transactions);
  }

  downloadExcel() {
    let data: any[] = [];
    if(this.transactions?.length > 0) {
      this.transactions.forEach(txn => {
        data.push({
          'Tipo de servicio': txn.service_type,
          'Fecha / Hora': txn.date_time,
          'Minutos Facturados': txn.invoice_minutes,
          'Precio por minuto': txn.price_per_minute,
          '% Plataforma': txn.platform_percentage,
          'Total': txn.total,
          'Cliente': txn.customer
        })
      })

      this._excelService.exportAsExcelFile(data, 'Contacto_con_profesional_' + new Date().getTime());
      this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
    }
  }

  initializeWallet() {
    if(this.me) {
      this.withdrawalMethodsTitle = this._translateService.instant('professionals.withdrawalmethods');
      this._professionalsService
        .getWalletData(
          this.companyId,
          this.me?.id,
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(
            (data) => {
              this.withdrawalMethods = data?.payment_methods;
              this.walletAmount = data?.wallet_amount;
              this.walletData = data?.wallet_data;
            },
            (error) => {
              console.log(error);
            }
        );
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('professional_gallery_image_file');
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}