import { CommonModule, Location } from "@angular/common";
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
import { ProductCardComponent } from "@share/components/card/product/product.component";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { RitualeCardComponent } from "@share/components/astro-ideal/rituale-card/rituale-card.component";
import { BreadcrumbComponent } from "@share/components";
import { ElementRef, ViewChild } from "@angular/core";
import { CarouselComponent } from "@share/components/astro-ideal/carousel/carousel.component";
import { PlansCalendarComponent } from "../calendar/calendar.component";

import get from "lodash/get";

@Component({
  selector: "app-plan-home",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SearchComponent,
    PageTitleComponent,
    ProductCardComponent,
    RitualeCardComponent,
    BreadcrumbComponent,
    CarouselComponent,
    PlansCalendarComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: [],
})
export class PlanHomeComponent {
  @ViewChild("elementRef", { static: false }) elementRef!: ElementRef;
  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";

  index = 0;
  items = [{ title: "Slide 1" }, { title: "Slide 2" }, { title: "Slide 3" }];

  jumpToSlide(number) {
    this.index = number;
  }

  getProductsFromBackend() {
    this._companyService.getCompanyProducts(this.companyId).subscribe(
      (response) => {
        this.products = response.products.map((item) => {
          let psubcategories = item.professionalSubcategories.map((sub) => {
            return {
              ca_title: sub.subcategory_ca,
              de_title: sub.subcategory_de,
              en_title: sub.subcategory_en,
              es_title: sub.subcategory_es,
              eu_title: sub.subcategory_eu,
              fr_title: sub.subcategory_fr,
              it_title: sub.subcategory_it,
            };
          });
          return {
            id: item.id,
            en_title: item.name_en,
            es_title: item.name_es,
            ca_title: item.name_ca,
            fr_title: item.name_fr,
            eu_title: item.name_eu,
            de_title: item.name_de,
            it_title: item.name_it,
            en_description: item.description_en,
            es_description: item.description_es,
            ca_description: item.description_ca,
            fr_description: item.description_fr,
            eu_description: item.description_eu,
            de_description: item.description_de,
            it_description: item.description_it,
            image: `${environment.api}/v2/image/product/${item.image}`,
            currency: item.currency,
            amount: item.amount,
            subcategories: psubcategories,
            featured: item.featured,
          };
        });
        this.featured_products = this.products.filter((item) => {
          return item.featured;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  renderByCategory(category_id) {
    this.selected_category =
      this.selected_category == category_id ? -1 : category_id;
    this.selected_subcategory =
      this.selected_category != -1 ? -1 : this.selected_subcategory;

    if (this.selected_category == -1) {
      this.getProductsFromBackend();
      return;
    }

    this._companyService
      .getCompanyProductsByCategory(this.companyId, category_id)
      .subscribe(
        (response) => {
          this.products = response.products.map((item) => {
            let psubcategories = item.professionalSubcategories.map((sub) => {
              return {
                ca_title: sub.subcategory_ca,
                de_title: sub.subcategory_de,
                en_title: sub.subcategory_en,
                es_title: sub.subcategory_es,
                eu_title: sub.subcategory_eu,
                fr_title: sub.subcategory_fr,
                it_title: sub.subcategory_it,
              };
            });
            return {
              id: item.id,
              en_title: item.name_en,
              es_title: item.name_es,
              ca_title: item.name_ca,
              fr_title: item.name_fr,
              eu_title: item.name_eu,
              de_title: item.name_de,
              it_title: item.name_it,
              en_description: item.description_en,
              es_description: item.description_es,
              ca_description: item.description_ca,
              fr_description: item.description_fr,
              eu_description: item.description_eu,
              de_description: item.description_de,
              it_description: item.description_it,
              image: `${environment.api}/v2/image/product/${item.image}`,
              currency: item.currency,
              amount: item.amount,
              subcategories: psubcategories,
              featured: item.featured,
            };
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  renderBySubcategory(subcategory_id) {
    this.selected_subcategory =
      this.selected_subcategory == subcategory_id ? -1 : subcategory_id;
    this.selected_category =
      this.selected_subcategory != -1 ? -1 : this.selected_subcategory;

    if (this.selected_subcategory == -1) {
      this.getProductsFromBackend();
      return;
    }

    this._companyService
      .getCompanyProductsBySubcategory(this.companyId, subcategory_id)
      .subscribe(
        (response) => {
          this.products = response.products.map((item) => {
            let psubcategories = item.professionalSubcategories.map((sub) => {
              return {
                ca_title: sub.subcategory_ca,
                de_title: sub.subcategory_de,
                en_title: sub.subcategory_en,
                es_title: sub.subcategory_es,
                eu_title: sub.subcategory_eu,
                fr_title: sub.subcategory_fr,
                it_title: sub.subcategory_it,
              };
            });
            return {
              id: item.id,
              en_title: item.name_en,
              es_title: item.name_es,
              ca_title: item.name_ca,
              fr_title: item.name_fr,
              eu_title: item.name_eu,
              de_title: item.name_de,
              it_title: item.name_it,
              en_description: item.description_en,
              es_description: item.description_es,
              ca_description: item.description_ca,
              fr_description: item.description_fr,
              eu_description: item.description_eu,
              de_description: item.description_de,
              it_description: item.description_it,
              image: `${environment.api}/v2/image/product/${item.image}`,
              currency: item.currency,
              amount: item.amount,
              subcategories: psubcategories,
              featured: item.featured,
            };
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }

  breadTranslator() {
    switch (this.language) {
      case "ca":
        return { level1: "Inici", level2: "Esdeveniments" };
      case "de":
        return { level1: "Start", level2: "Veranstaltungen" };
      case "en":
        return { level1: "Home", level2: "Events" };
      case "es":
        return { level1: "Inicio", level2: "Eventos" };
      case "eu":
        return { level1: "Hasi", level2: "Gertaerak" };
      case "fr":
        return { level1: "Début", level2: "Événements" };
      case "it":
        return { level1: "Inizio", level2: "Eventi" };
      default:
        return { level1: "Empty", level2: "Empty" };
    }
  }

  initializeBreadcrumb() {
    this.level1Title = this.breadTranslator().level1;
    this.level2Title = this.breadTranslator().level2;
    this.level3Title = "";
    this.level4Title = "";
  }

  private destroy$ = new Subject<void>();

  @Input() parentComponent: any;
  @Input() limit: any;

  selected_category: any = -1;
  selected_subcategory: any = -1;
  pcategories: any[] = [];
  subcategories: any[] = [];
  products: any[] = [];
  featured_products: any[] = [];

  arrowRightIcon = faArrowRight;

  languageChangeSubscription;
  searchText: any;
  placeholderText: any;
  language: any;
  apiPath: string = environment.api;
  user: any;
  email: any;
  userId: any = 0;
  userEmailDomain: any;
  companyId: any = 0;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  isMobile: boolean = false;
  categories: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _location: Location
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");
    this.user = this._localService.getLocalStorage(environment.lsuser);
    this.email = this._localService.getLocalStorage(environment.lsemail);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
    this.userEmailDomain = this._localService.getLocalStorage(
      environment.lsdomain
    );
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
      this.userEmailDomain = company[0].domain;
      this.companyId = company[0].id;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
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

  initializePage() {
    this.initializeBreadcrumb();

    this._companyService
      .getCompanyProfessionalCategories(this.companyId)
      .subscribe(
        (response) => {
          this.pcategories = response.categories.map((item) => ({
            id: item.id,
            en_title: item.category_en,
            es_title: item.category_es,
            ca_title: item.category_ca,
            fr_title: item.category_fr,
            eu_title: item.category_eu,
            de_title: item.category_de,
            it_title: item.category_it,
          }));
        },
        (error) => {
          console.log(error);
        }
      );

    this._companyService
      .getCompanyProfessionalSubCategories(this.companyId)
      .subscribe(
        (response) => {
          this.subcategories = response.subcategories.map((item) => ({
            id: item.id,
            en_title: item.subcategory_en,
            es_title: item.subcategory_es,
            ca_title: item.subcategory_ca,
            fr_title: item.subcategory_fr,
            eu_title: item.subcategory_eu,
            de_title: item.subcategory_de,
            it_title: item.subcategory_it,
          }));
        },
        (error) => {
          console.log(error);
        }
      );

    this._companyService.getCompanyProducts(this.companyId).subscribe(
      (response) => {
        this.products = response.products.map((item) => {
          let psubcategories = item.professionalSubcategories.map((sub) => {
            return {
              ca_title: sub.subcategory_ca,
              de_title: sub.subcategory_de,
              en_title: sub.subcategory_en,
              es_title: sub.subcategory_es,
              eu_title: sub.subcategory_eu,
              fr_title: sub.subcategory_fr,
              it_title: sub.subcategory_it,
            };
          });
          return {
            id: item.id,
            en_title: item.name_en,
            es_title: item.name_es,
            ca_title: item.name_ca,
            fr_title: item.name_fr,
            eu_title: item.name_eu,
            de_title: item.name_de,
            it_title: item.name_it,
            en_description: item.description_en,
            es_description: item.description_es,
            ca_description: item.description_ca,
            fr_description: item.description_fr,
            eu_description: item.description_eu,
            de_description: item.description_de,
            it_description: item.description_it,
            image: `${environment.api}/v2/image/product/${item.image}`,
            currency: item.currency,
            amount: item.amount,
            subcategories: psubcategories,
            featured: item.featured,
          };
        });
        this.featured_products = this.products.filter((item) => {
          return item.featured;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  titleTranslator(item: any): string {
    switch (this.language) {
      case "en":
        return item.en_title;
      case "es":
        return item.es_title;
      case "fr":
        return item.fr_title;
      case "eu":
        return item.eu_title;
      case "ca":
        return item.ca_title;
      case "de":
        return item.de_title;
      case "it":
        return item.it_title;
      default:
        return "dummy";
    }
  }

  descriptionTranslator(item: any): string {
    switch (this.language) {
      case "en":
        return item.en_description;
      case "es":
        return item.es_description;
      case "fr":
        return item.fr_description;
      case "eu":
        return item.eu_description;
      case "ca":
        return item.ca_description;
      case "de":
        return item.de_description;
      case "it":
        return item.it_description;
      default:
        return "dummy";
    }
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleGoBack() {
    this._location.back();
  }
}
