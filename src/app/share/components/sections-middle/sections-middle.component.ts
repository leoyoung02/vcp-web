import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChange,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";
import { StarRatingComponent } from "@lib/components";
import { PlansCalendarComponent } from "@features/plans/calendar/calendar.component";
import { PlanCardComponent } from "../card/plan/plan.component";
import { PageTitleComponent } from "../page-title/page-title.component";
import { SectionTitleComponent } from "../section-title/section-title.component";
import { PlanImageTextCardComponent } from "../card/plan-image-text/plan-image-text.component";
import { ClubImageTextCardComponent } from "../card/club-image-text/club-image-text.component";
import { JobOfferCardComponent } from "../card/job-offer/job-offer.component";
import { CityGuideCardComponent } from "../card/city-guide/city-guide.component";

@Component({
  selector: "app-sections-middle",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    StarRatingComponent,
    PlansCalendarComponent,
    PlanCardComponent,
    PageTitleComponent,
    SectionTitleComponent,
    PlanImageTextCardComponent,
    ClubImageTextCardComponent,
    JobOfferCardComponent,
    CityGuideCardComponent,
  ],
  templateUrl: "./sections-middle.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsMiddleComponent {
  private destroy$ = new Subject<void>();

  @Input() userId: any;
  @Input() superAdmin: any;
  @Input() company: any;
  @Input() list: any;
  @Input() isUESchoolOfLife: any;
  @Input() campus: any;
  @Input() bottomEventTitles: any;
  @Input() homeCalendar: any;
  @Input() allList: any;
  @Input() hasSectionsTemplate: any;
  @Input() plansTitle: any;
  @Input() groupsTitle: any;
  @Input() cityGuidesTitle: any;
  @Input() jobOffersTitle: any;
  @Input() coursesTitle: any;
  @Input() discountsTitle: any;
  @Input() blogsTitle: any;
  @Input() membersTitle: any;
  @Input() tutorsTitle: any;

  languageChangeSubscription;
  language: any;
  buttonColor: any;
  primaryColor: any;
  mode: any;
  courses: any = [];
  groups: any = [];
  courseCategoriesAccessRoles: any = [];
  allCourseCategories: any = [];
  courseCategoryMapping: any = [];
  admin1: boolean = false;
  admin2: boolean = false;
  canCreatePlan: boolean = false;
  selected: any;
  plansList: any = [];
  plans: any = [];
  plansSectionTitle: boolean = false;
  clubs: any = [];
  groupsSectionTitle: boolean = false;
  cityGuides: any = [];
  cityGuidesSectionTitle: boolean = false;
  jobOffers: any = [];
  jobOffersSectionTitle: boolean = false;
  coursesSectionTitle: boolean = false;
  discounts: any = [];
  discountsSectionTitle: boolean = false;
  blogs: any = [];
  blogsSectionTitle: boolean = false;
  members: any = [];
  membersSectionTitle: boolean = false;
  tutors: any = [];
  tutorsSectionTitle: boolean = false;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChange) {
    let plansTitleChange = changes["plansTitle"];
    if (plansTitleChange.previousValue != plansTitleChange.currentValue) {
      this.plansSectionTitle = plansTitleChange.currentValue;
    }

    let groupsTitleChange = changes["groupsTitle"];
    if (groupsTitleChange.previousValue != groupsTitleChange.currentValue) {
      this.groupsSectionTitle = groupsTitleChange.currentValue;
    }

    let cityGuidesTitleChange = changes["cityGuidesTitle"];
    if (cityGuidesTitleChange.previousValue != cityGuidesTitleChange.currentValue) {
      this.cityGuidesSectionTitle = cityGuidesTitleChange.currentValue;
    }

    let jobOffersTitleChange = changes["jobOffersTitle"];
    if (jobOffersTitleChange.previousValue != jobOffersTitleChange.currentValue) {
      this.jobOffersSectionTitle = jobOffersTitleChange.currentValue;
    }

    let coursesTitleChange = changes["coursesTitle"];
    if (coursesTitleChange.previousValue != coursesTitleChange.currentValue) {
      this.coursesSectionTitle = coursesTitleChange.currentValue;
    }

    let discountsTitleChange = changes["discountsTitle"];
    if (discountsTitleChange.previousValue != discountsTitleChange.currentValue) {
      this.discountsSectionTitle = discountsTitleChange.currentValue;
    }

    let blogsTitleChange = changes["blogsTitle"];
    if (blogsTitleChange.previousValue != blogsTitleChange.currentValue) {
      this.blogsSectionTitle = blogsTitleChange.currentValue;
    }

    let membersTitleChange = changes["membersTitle"];
    if (membersTitleChange.previousValue != membersTitleChange.currentValue) {
      this.membersSectionTitle = membersTitleChange.currentValue;
    }

    let tutorsTitleChange = changes["tutorsTitle"];
    if (tutorsTitleChange.previousValue != tutorsTitleChange.currentValue) {
      this.tutorsSectionTitle = tutorsTitleChange.currentValue;
    }
  }

  async ngOnInit() {
    initFlowbite();
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");
    this.buttonColor = this.company.button_color
      ? this.company.button_color
      : this.company.primary_color;
    this.primaryColor = this.company.primary_color;

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.fetchData();
        }
      );

    this.fetchData();
  }

  fetchData() {
    this.mode = this.homeCalendar && !this.hasSectionsTemplate ? 'home' : '';
    this.list = this.allList;
    this.plansList = this.allList;
    this.separateByType(this.list);
  }

  separateByType(list) {
    this.plans = list?.filter(item => {
      return item?.object_type == 'plan'
    })
    if(this.plans?.length > 4) {
        this.plans = this.plans?.slice(0, 4);
    }

    this.clubs = list?.filter(item => {
      return item?.object_type == 'club'
    })

    this.cityGuides = list?.filter(item => {
      return item?.object_type == 'cityguide'
    })

    this.jobOffers = list?.filter(item => {
      return item?.object_type == 'joboffer'
    })

    this.courses = list?.filter(item => {
      return item?.object_type == 'course'
    })

    this.discounts = list?.filter(item => {
      return item?.object_type == 'discount' || item?.object_type == 'service'
    })

    this.blogs = list?.filter(item => {
      return item?.object_type == 'blog'
    })

    this.members = list?.filter(item => {
      return item?.object_type == 'member'
    })

    this.tutors = list?.filter(item => {
      return item?.object_type == 'tutor'
    })
  }

  getMorePlansTitle() {
    let title = this.plansSectionTitle ? this.plansSectionTitle : '';
    return `${this._translateService.instant('search.viewmore')} ${title}`;
  }

  goToPlansList() {
    this._router.navigate(["/plans"]);
  }

  goToJobOffersList() {
    this._router.navigate(["/employmentchannel"]);
  }

  goToCityGuidesList() {
    this._router.navigate(["/cityguide"]);
  }

  getMoreClubsTitle() {
    let title = this.groupsSectionTitle || ''
    return `${this._translateService.instant('search.viewmore')} ${title}`
  }

  goToClubDetails(item) {
    if(this.userId > 0) {
      this._router.navigate([item.path]);
    } else {
      this._router.navigate(["/auth/login"]);
    }
  }

  goToCourseDetails(item) {
    if(this.userId > 0) {
      this._router.navigate([item.path]);
    } else {
      this._router.navigate(["/auth/login"], {
        queryParams: {
          returnUrl: this._router.routerState.snapshot.url
        }
      });
    }
  }

  handleDetailsClickRoute(plan) {
    if(plan) {
      let planTypeId = plan?.plan_type_id;
      if (plan?.privacy && !plan?.private_type) {
      } else {
        this._router.navigate([`/plans/details/${plan?.item_id}/${planTypeId}`]);
      }
    }
  }

  handleClubDetailsClickRoute(club) {
    this._router.navigate([`/clubs/details/${club?.item_id}`]);
  }

  handleJobOfferDetailsClickRoute(joboffer) {
    this._router.navigate([`/employmentchannel/details/${joboffer?.item_id}`]);
  }

  handleCityGuideDetailsClickRoute(guide) {
    this._router.navigate([`/cityguide/details/${guide?.item_id}`]);
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}