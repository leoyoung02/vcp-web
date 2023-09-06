import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService, LocalService } from '@share/services';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService, TutorsService } from '@features/services';
import { ButtonGroupComponent } from '@share/components';
import { COURSE_IMAGE_URL } from '@lib/api-constants';
import moment from "moment";
import get from 'lodash/get';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonGroupComponent, NgOptimizedImage],
  templateUrl: './list.component.html'
})
export class CoursesListComponent {
  private destroy$ = new Subject<void>();

  @Input() parentComponent: any;
  @Input() limit: any;

  languageChangeSubscription;
  user: any;
  email: any;
  filter: any;
  language: any;
  courseSrc: string = COURSE_IMAGE_URL;
  courses: any;
  filteredcourses: any;
  courseExceptionUser: any
  companyId: any = 0;
  companies: any;
  pageTitle: any;
  features: any;

  primaryColor: any
  buttonColor: any
  hoverColor:any
  userId: any
  courseSubscriptions: any
  subfeatures: any
  hasCoursePayment: boolean = false
  superAdmin: boolean = false

  hasCourseCategories: boolean = false
  courseCategories: any
  allCourseCategories: any = []
  filterType: any = 'All'
  isloading: boolean = true
  courseCategoryMapping: any = []

  isAdvancedCourse: boolean = false
  skeletonItems: any = []
  canLockUnlockModules: boolean = false
  hasCategoryAccess: boolean = false
  courseCategoriesAccessRoles: any = []

  company_subfeatures = []
  subfeature_id_global: number = 0;
  feature_global: string = ''
  hasHotmartIntegration: boolean = false
  modal: any
  ipAddress: any
  showHotmartRibbon: boolean = false
  domain: any
  courseTutors: any = []
  hasCoursePreview: boolean = false
  hasMembersOnly: boolean = false
  newLogin: boolean = false
  hotmartSettings: any

  isAdmin: boolean = false
  hasAccessToPreview: boolean = false
  accessCourses: any = []
  nonAccessCourses: any = []
  newSection: any = false
  filterActive: boolean = false
  onlyAssignedTutorAccess: boolean = false
  showSectionTitleDivider: boolean = false
  showCoursesByAccess: boolean = false
  sectionOptions: any = []
  profileHomeContentSetting: any = []
  showMemberCoursesOnly: boolean = false
  featureId: any
  tutorFeatureId: any
  showBuyCreditsModal: boolean = false
  selectedCreditpackage: any = 0
  creditPackages: any =[]
  hasCreditPackageSetting: boolean = false
  courseCreditSetting: boolean = false
  hasTutors: boolean = false
  isMobile: boolean = false;
  coursesFeature: any;
  tutorsFeature: any;
  pageName: any;
  coursesProgress: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _coursesService: CoursesService,
    private _tutorsService: TutorsService
  ) { }

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.email = this._localService.getLocalStorage(environment.lsemail)
    this.userId = this._localService.getLocalStorage(environment.lsuserId)
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId)
    this.language = this._localService.getLocalStorage(environment.lslang)
    this._translateService.use(this.language || 'es')
    this.skeletonItems = ['a', 'b', 'c']
    this.companies = this._localService.getLocalStorage(environment.lscompanies) ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies)) : ''
    if(!this.companies) { this.companies = get(await this._companyService.getCompanies().toPromise(), 'companies') }
    let company = this._companyService.getCompany(this.companies)
    if(company && company[0]) {
      this.domain = company[0].domain
      this.companyId = company[0].id
      this.primaryColor = company[0].primary_color
      this.buttonColor = company[0].button_color ? company[0].button_color : company[0].primary_color
      this.hoverColor = company[0].hover_color ? company[0].hover_color : company[0].primary_color
      this.showSectionTitleDivider = company[0].show_section_title_divider
      this._localService.setLocalStorage(environment.lscompanyId, this.companyId)
    } 

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );

    this.initializePage()
  }

  initializePage() {
    this.fetchCourses();
  }

  fetchCourses() {
    this._coursesService
      .fetchCoursesCombined(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data?.settings?.subfeatures, data?.categories, data?.hotmart_settings);
          this.mapUserPermissions(data?.user_permissions);
          this.coursesProgress = data?.courses_progress || [];
          this.formatCourses(data?.courses)
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.coursesFeature = features?.find((f) => f.feature_id == 11);
    this.featureId = this.coursesFeature?.id;
    this.pageName = this.getFeatureTitle(this.coursesFeature);

    let tutorsFeature = features?.find((f) => f.feature_id == 20 && f.status == 1);
    this.tutorFeatureId = tutorsFeature ? this.getFeatureTitle(tutorsFeature) : "";
    this.hasTutors = tutorsFeature ? true : false;
    if(this.hasTutors) { this.getCreditPackages(); }
  }

  mapSubfeatures(subfeatures, categories, hotmart_settings) {
    if (subfeatures?.length > 0) {
      this.hasCoursePayment = subfeatures.some(
        (a) => a.name_en == "Filter" && a.active == 1
      );
      this.hasCategoryAccess = subfeatures.some(a => a.name_en == 'Category access' && a.active == 1)
      this.hasCourseCategories = subfeatures.some(a => a.name_en == 'Categories' && a.active == 1)
      this.isAdvancedCourse = subfeatures.some(a => a.name_en == 'Advanced course' && a.active == 1)
      this.hasHotmartIntegration = subfeatures.some(a => a.name_en == 'Hotmart integration' && a.active == 1)
      this.showHotmartRibbon = subfeatures.some(a => a.name_en == 'Hotmart ribbon' && a.active == 1)
      this.hasCoursePreview = subfeatures.some(a => a.name_en == 'Course preview page' && a.active == 1)
      this.hasMembersOnly = subfeatures.some(a => a.name_en == 'Members only' && a.active == 1)
      this.filterActive = subfeatures.some(a => a.name_en == 'Filter' && a.active == 1)
      this.onlyAssignedTutorAccess = subfeatures.some(a => a.name_en == 'Tutors assigned to courses' && a.active == 1)
      this.showCoursesByAccess = subfeatures.some(a => a.name_en == 'Show Courses' && a.active == 1)
      this.newSection = subfeatures.some(a => a.name_en == 'More Training' && a.active == 1)
      this.courseCreditSetting = subfeatures.some(a => a.name_en == 'Credits' && a.active == 1)
      this.hasCreditPackageSetting = subfeatures.some(a => a.name_en == 'Credit Packages' && a.active == 1)
    }

    if(this.hasCourseCategories) { this.courseCategories = categories }
    if(this.hasHotmartIntegration) { this.hotmartSettings = hotmart_settings }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
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

  getCourseTitle(course) {
    return this.language == 'en' ? (course.title_en ? (course.title_en || course.title) : course.title) :
      (this.language == 'fr' ? (course.title_fr ? (course.title_fr || course.title) : course.title) : 
        (this.language == 'eu' ? (course.title_eu ? (course.title_eu || course.title) : course.title) : 
          (this.language == 'ca' ? (course.title_ca ? (course.title_ca || course.title) : course.title) : 
            (this.language == 'de' ? (course.title_de ? (course.title_de || course.title) : course.title) : course.title)
          )
        )
      )
  }

  getCreditPackages() {
    this._tutorsService.getCreditPackages(this.companyId)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      response => {
        if(response?.credit_packages){
          this.creditPackages = response.credit_packages?.filter(cp => { return cp.status == 1 })
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getUserProgress(course) {
    console.log(course)
    let progress = 0
    let user_course = this.coursesProgress?.find((cp) => cp.user_id == this.userId && cp.course_id == course.id);
    console.log(user_course)
    if(user_course) {
      progress = user_course.progress
    }
    return progress
  }

  formatCourses(courses) {
    this.courses = courses?.map((course) => {
      let progress = this.getUserProgress(course)
      return {
        ...course,
        title_language: this.getCourseTitle(course),
        progress: progress,
        button_text: this.getButtonText(course, progress),
      }
    })
  };

  getButtonText(course, progress: number = 0) {
    let text = '';

    if(
      (
        (
          (course?.locked == 1 && this.hasCourseStarted(course)) || (course?.buy_now_status == 0 && this.hasCourseStarted(course)) || 
          (!this.hasCourseStarted(course) && course?.show_buy_now)
        ) 
        && course?.show_buy_now && course?.cta_status != 1
      ) ||
      (course.unassigned_status == 1)
    ) {
      text = this._translateService.instant('courses.blocked');
    }

    if(
      (!course?.locked || course?.locked != 1) && this.hasCourseStarted(course) && course?.show_buy_now && course?.buy_now_status == 1
    ) {
      text = course.buy_now_status == 1 && (this.hasCategoryAccess ? (this.userId ? this._translateService.instant('courses.buynow') : this._translateService.instant('courses.logintoaccess')) : this._translateService.instant('courses.buynow'))
    }

    if(
      ((!course?.locked || course?.locked != 1) && !this.hasCourseStarted(course) && !course?.show_buy_now) ||
      (course.exception_access == 1 && !this.hasCourseStarted(course))
    ) {
      text = `${this._translateService.instant('courses.startson')} ${moment(course.date).locale(this.language).format('D MMM')}`
    }

    if(
      course?.cta_status == 1 
      && !((!course?.locked || course?.locked != 1) && this.hasCourseStarted(course) && !course?.show_buy_now)
      && !((!course?.locked || course?.locked != 1) && !this.hasCourseStarted(course) && !course?.show_buy_now)
    ) {
      text = course.cta_text
    }

    if(
      ((!course?.locked || course?.locked != 1) && this.hasCourseStarted(course) && !course?.show_buy_now) ||
      ((course.exception_access == 1 || this.superAdmin) && this.hasCourseStarted(course))
    ) {
      text = (this.userId ? (progress == 0 ? `${this._translateService.instant('courses.begin')} ${this._translateService.instant('invite.here')}` : this._translateService.instant('courses.continue')) : (this._translateService.instant('courses.logintoaccess')))
    }

    return text
  }

  hasCourseStarted(course) {
    let show = true
    let start_date = course.date
    let today = moment().format('YYYY-MM-DD')

    if(start_date) {
      start_date = moment(course.date).format('YYYY-MM-DD')
      if(moment(today).isBefore(course.date)) {
        show = false
      }
    }

    return show
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
