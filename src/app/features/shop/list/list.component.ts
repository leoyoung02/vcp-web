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
  shopFeature: any;
  featureId: any;
  pageName: any;
  pageDescription: any;
  showFilters: boolean = false;
  filterSettings: any;
  superAdmin: boolean = false;
  canViewShop: boolean = false;
  canCreateShop: any;
  canManageShop: boolean = false;
  filterTypeControl: any;
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
    this.fetchShopsData();
  }

  fetchShopsData() {
    this._shopService
      .fetchShopsData(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data?.settings?.subfeatures);

          this.initializeFilterSettings(data?.module_filter_settings);

          this.user = data?.user;
          this.mapUserPermissions(data?.user_permissions);

          this.initializeProducts(data?.products || []); 

          this.filterTypeControl = data?.filter_settings?.filter_type || 'dropdown';
        },
        (error) => {
          console.log(error);
        }
    );
  }

  mapFeatures(features) {
    this.shopFeature = features?.find((f) => f.feature_id == 24);
    this.featureId = this.shopFeature?.feature_id;
    this.pageName = this.getFeatureTitle(this.shopFeature);
    this.pageDescription = this.getFeatureDescription(this.shopFeature);
  }

  mapSubfeatures(subfeatures) {
    if (subfeatures?.length > 0) {
      // this.categoriesFilterActive = subfeatures.some(
      //   (a) => a.name_en == "Filter" && a.active == 1
      // );
    }
  }

  initializeFilterSettings(filter_settings) {
    let filter_settings_active = filter_settings?.filter(fs => {
      return fs.active == 1
    })
    
    // if(filter_settings_active?.length > 0 && this.categoriesFilterActive) {
    //   this.showFilters = true;
    //   this.filterSettings = filter_settings;
    // }
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

  getFeatureTitle(feature) {
    return feature
      ? this.language == "en"
        ? feature.name_en ||
          feature.feature_name ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "fr"
        ? feature.name_fr ||
          feature.feature_name_FR ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "eu"
        ? feature.name_eu ||
          feature.feature_name_EU ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "ca"
        ? feature.name_ca ||
          feature.feature_name_CA ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "de"
        ? feature.name_de ||
          feature.feature_name_DE ||
          feature.name_es ||
          feature.feature_name_ES
        : feature.name_es || feature.feature_name_ES
      : "";
  }

  getFeatureDescription(feature) {
    return feature
      ? this.language == "en"
        ? feature.description_en || feature.description_es
        : this.language == "fr"
        ? feature.description_fr || feature.description_es
        : this.language == "eu"
        ? feature.description_eu || feature.description_es
        : this.language == "ca"
        ? feature.description_ca || feature.description_es
        : this.language == "de"
        ? feature.description_de || feature.description_es
        : feature.description_es
      : "";
  }

  initializeProducts(data) {
    if(data?.length == 0) {
      this.products = [
        {
          id: 1,
          title: 'Espresso Elegante',
          image: 'https://readymadeui.com/images/coffee1.webp',
          price: '€10',
          ratings: 5,
        },
        {
          id: 2,
          title: 'Mocha Madness',
          image: 'https://readymadeui.com/images/coffee8.webp',
          price: '€12',
          ratings: 3,
        },
        {
          id: 3,
          title: 'Caramel Cream Delight',
          image: 'https://readymadeui.com/images/coffee3.webp',
          price: '€14',
          ratings: 4,
        },
        {
          id: 4,
          title: 'Hazelnut Heaven Blend',
          image: 'https://readymadeui.com/images/coffee4.webp',
          price: '€12',
          ratings: 5,
        },
        {
          id: 5,
          title: 'Vanilla Velvet Brew',
          image: 'https://readymadeui.com/images/coffee5.webp',
          price: '€15',
          ratings: 5,
        },
        {
          id: 6,
          title: 'Double Shot Symphony',
          image: 'https://readymadeui.com/images/coffee6.webp',
          price: '€14',
          ratings: 3,
        },
        {
          id: 7,
          title: 'Irish Cream Dream',
          image: 'https://readymadeui.com/images/coffee7.webp',
          price: '€11',
          ratings: 5,
        },
        {
          id: 8,
          title: 'Coconut Bliss Coffee',
          image: 'https://readymadeui.com/images/coffee8.webp',
          price: '€13',
          ratings: 5,
        }
      ]
    }
  }

  getProductTitle(product) {
    return this.language == "en"
      ? (product.title_en && product.title_en != 'undefined')
        ? product.title_en || product.title
        : product.title
      : this.language == "fr"
      ? product.title_fr
        ? product.title_fr || product.title
        : product.title
      : this.language == "eu"
      ? product.title_eu
        ? product.title_eu || product.title
        : product.title
      : this.language == "ca"
      ? product.title_ca
        ? product.title_ca || product.title
        : product.title
      : this.language == "de"
      ? product.title_de
        ? product.title_de || product.title
        : product.title
      : this.language == "it"
      ? product.title_it
        ? product.title_it || product.title
        : product.title
      : product.title;
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