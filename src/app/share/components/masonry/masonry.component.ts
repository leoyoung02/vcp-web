import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";
import { MasonrySection1Component } from "../masonry-section1/masonry-section1.component";
import { MasonrySection2Component } from "../masonry-section2/masonry-section2.component";
import { MasonrySection3Component } from "../masonry-section3/masonry-section3.component";

@Component({
  selector: "app-masonry",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MasonrySection1Component,
    MasonrySection2Component,
    MasonrySection3Component
  ],
  templateUrl: "./masonry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasonryComponent {
  private destroy$ = new Subject<void>();

  @Input() userId: any;
  @Input() company: any;

  languageChangeSubscription;
  language: any;
  buttonColor: any;
  section1Data: any = [];
  section2Data: any= [];
  section3Data: any = [];
  data: any = [];
  clubCategories: any;
  clubCategoryMapping: any;
  cityGuideLikes: any;
  jobTypes: any;
  jobAreas: any;
  jobOfferAreas: any;

  constructor(
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    initFlowbite();
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");
    this.buttonColor = this.company.button_color
      ? this.company.button_color
      : this.company.primary_color;

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.formatData();
        }
      );

    this.fetchData();
  }

  fetchData() {
    this._companyService
      .fetchHomeData(this.company?.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.data = data;
          this.clubCategories = data?.club_categories;
          this.clubCategoryMapping = data?.club_category_mapping;
          this.jobTypes = data?.job_types;
          this.jobAreas = data?.job_areas;
          this.jobOfferAreas = data?.job_offer_areas;
          this.formatData();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  formatData() {
    console.log(this.data)
    if(this.data) {
      this.section1Data = this?.data?.plans?.length >= 6 ? this?.data?.plans?.slice(0, 6) : []
      
      let cityguides1 = this?.data?.city_guides?.length >= 2 ? this?.data?.city_guides?.slice(0, 2) : []
      let joboffers1 = this?.data?.job_offers?.length >= 2 ? this?.data?.job_offers?.slice(0, 4) : []
      this.section2Data = []
        .concat(cityguides1)
        .concat(joboffers1)

      this.section3Data = this?.data?.clubs?.length >= 4 ? this?.data?.clubs?.slice(0, 4) : []

      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}