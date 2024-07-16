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
  selector: "app-shop-home",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchComponent,
    PageTitleComponent,
    ProductCardComponent,
  ],
  templateUrl: "./home.component.html",
})
export class ShopHomeComponent {
  private destroy$ = new Subject<void>();

  @Input() parentComponent: any;
  @Input() limit: any;

  languageChangeSubscription;
  searchText: any;
  placeholderText: any;
  language: any;
  apiPath: string = environment.api;
  user: any;
  email: any;
  userId: any = 0
  userEmailDomain: any
  companyId: any = 0
  companies: any
  primaryColor: any
  buttonColor: any
  isMobile: boolean = false
  categories: any = []

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
    this.fetchShopCategories();
  }

  fetchShopCategories() {
    this._shopService
      .fetchShopCategories(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.formatCategories(data?.categories, data?.shop_products);
        },
        (error) => {
          console.log(error);
        }
    );
  }

  formatCategories(categories, products) {
    let data;
    if (categories?.length > 0) {
      data = categories?.map((item) => {
        return {
          ...item,
          name: this.getCategoryName(item),
          description: this.getCategoryDescription(item),
          no_items: this.getCategoryItems(item, products)?.length || 0,
          label: item?.type == 'services' ? this._translateService.instant('news.services')?.toLowerCase() : this._translateService.instant('shop.products')?.toLowerCase(),
          image: `${this.apiPath}/get-ie-image-plan/${item.image}`
        };
      });
    }

    this.categories = data;
  }

  getCategoryName(category) {
    return this.language == "en"
      ? category.name_en
        ? category.name_en || category.name_es
        : category.name_es
      : this.language == "fr"
      ? category.name_fr
        ? category.name_fr || category.name_es
        : category.name_es
      : this.language == "eu"
      ? category.name_eu
        ? category.name_eu || category.name_es
        : category.name_es
      : this.language == "ca"
      ? category.name_ca
        ? category.name_ca || category.name_es
        : category.name_es
      : this.language == "de"
      ? category.name_de
        ? category.name_de || category.name_es
        : category.name_es
      : this.language == "it"
      ? category.name_it
        ? category.name_it || category.name_es
        : category.name_es
      : category.name_es;
  }

  getCategoryDescription(category) {
    return this.language == "en"
      ? category.description_en
        ? category.description_en || category.description_es
        : category.description_es
      : this.language == "fr"
      ? category.description_fr
        ? category.description_fr || category.description_es
        : category.description_es
      : this.language == "eu"
      ? category.description_eu
        ? category.description_eu || category.description_es
        : category.description_es
      : this.language == "ca"
      ? category.description_ca
        ? category.description_ca || category.description_es
        : category.description_es
      : this.language == "de"
      ? category.description_de
        ? category.description_de || category.description_es
        : category.description_es
      : this.language == "it"
      ? category.description_it
        ? category.description_it || category.description_es
        : category.description_es
      : category.description_es;
  }

  getCategoryItems(category, products) {
    return products?.filter(product => {
      return product?.category_id == category.id
    })
  }

  goToCategoryPage(category) {
    this._router.navigate([`/shop/list/${category.id}`]);
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}