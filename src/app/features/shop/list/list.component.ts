import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchComponent } from "@share/components/search/search.component";
import { PageTitleComponent } from "@share/components";
import { ShopService } from "@features/services/shop/shop.service";
import { ProductCardComponent } from "@share/components/card/product/product.component";
import get from "lodash/get";

@Component({
  selector: "app-shop-list",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchComponent,
    PageTitleComponent,
    ProductCardComponent,
  ],
  templateUrl: "./list.component.html",
})
export class ShopListComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;

  languageChangeSubscription;
  searchText: any;
  placeholderText: any;
  language: any
  isloading: boolean = true
  apiPath: string = environment.api
  email = ''
  userId: any = 0
  userEmailDomain: any
  userRole: any
  companyId: any = 0
  companies: any
  primaryColor: any
  buttonColor: any
  isMobile: boolean = false
  user: any
  pageName: any;
  superAdmin: boolean = false;
  canViewShop: boolean = false;
  canCreateShop: any;
  canManageShop: boolean = false;
  products: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _shopService: ShopService,
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || 'es');
    this.user = this._localService.getLocalStorage(environment.lsuser);
    this.email = this._localService.getLocalStorage(environment.lsemail);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
    this.userEmailDomain = this._localService.getLocalStorage(environment.lsdomain);
    this.userRole = this._localService.getLocalStorage(environment.lsuserRole);
    this.companies = this._localService.getLocalStorage(environment.lscompanies) ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies)) : '';
    if (!this.companies) { this.companies = get(await this._companyService.getCompanies().toPromise(), 'companies') }
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
      this.userEmailDomain = company[0].domain;
      this.companyId = company[0].id;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color ? company[0].button_color : company[0].primary_color;
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
    this.fetchProducts();
  }

  fetchProducts() {
    this._shopService
      .fetchProducts(this.companyId, this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapUserPermissions(data?.user_permissions);
          this.formatProducts(data?.products || []);
        },
        (error) => {
          console.log(error);
        }
    );
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canViewShop = user_permissions?.member_type_permissions?.find(
      (f) => f.view == 1 && f.feature_id == 1
    )
      ? true
      : false;
    this.canCreateShop =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find((f) => f.create == 1 && f.feature_id == 1);
    this.canManageShop = user_permissions?.member_type_permissions?.find(
      (f) => f.manage == 1 && f.feature_id == 1
    )
      ? true
      : false;
  }

  formatProducts(products) {
    let data;
    if (products?.length > 0) {
      data = products?.map((item) => {
        return {
          ...item,
          title: this.getProductTitle(item),
          image: `${this.apiPath}/v2/image/product/${item.image}`,
          price: `${item.currency}${item.amount}`
        };
      });
    }

    this.products = data;
  }

  getProductTitle(product) {
    return this.language == "en"
      ? product.name_en
        ? product.name_en || product.name_es
        : product.name_es
      : this.language == "fr"
      ? product.name_fr
        ? product.name_fr || product.name_es
        : product.name_es
      : this.language == "eu"
      ? product.name_eu
        ? product.name_eu || product.name_es
        : product.name_es
      : this.language == "ca"
      ? product.name_ca
        ? product.name_ca || product.name_es
        : product.name_es
      : this.language == "de"
      ? product.name_de
        ? product.name_de || product.name_es
        : product.name_es
      : this.language == "it"
      ? product.name_it
        ? product.name_it || product.name_es
        : product.name_es
      : product.name_es;
  }

  handleDetailsClickRoute(id) {
    this._router.navigate([`/shop/detail/${id}`]);
  }

  handleAddToCartClickRoute(id) {
  
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}