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
  searchText: any = "";
  search: any = "";
  placeholderText: any = "";
  isInitialLoad: boolean = false;
  isloading: boolean = true;
  languageChangeSubscription: any;
  menuColor: any;
  user: any;
  createHover: boolean = false;
  superAdmin: boolean = false;
  p: any = 1;
  allCompanies: any = [];

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
          this.initializePage();
        }
      );

    this.initializePage();
  }

  async initializePage() {
    this.initializeSearch();
    this.loadCustomers();
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
    this.allCompanies = this.companies;
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

  handleSearchChanged(event) {
    this.search = event || "";
    this.filterCustomers();
  }

  filterCustomers() {
    let companies = this.allCompanies
    if (this.search) {
      companies = companies.filter(m => {
        return (
          (m.entity_name && m.entity_name
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .indexOf(
              this.search
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
            ) >= 0)
        )
      })
    }

    this.companies = companies;
  }

  toggleCreateHover(event) {
    this.createHover = event;
  }

  handleCreateRoute() {
    this._router.navigate([`/customer-onboarding/create`])
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}