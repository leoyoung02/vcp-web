import { CommonModule, NgOptimizedImage, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { TutorsService } from "@features/services";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { BreadcrumbComponent, ToastComponent } from "@share/components";
import { LocalService, CompanyService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { initFlowbite } from "flowbite";
import { TutorCardComponent } from "@share/components/card/tutor/tutor.component";
import { CalendlyComponent } from "../calendly/calendly.component";
import get from "lodash/get";

@Component({
  selector: 'app-tutors-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    BreadcrumbComponent,
    NgOptimizedImage,
    ToastComponent,
    TutorCardComponent,
    CalendlyComponent
  ],
  templateUrl: './detail.component.html'
})
export class TutorDetailComponent {
  private destroy$ = new Subject<void>();

  @Input() id!: number;

  languageChangeSubscription;
  emailDomain;
  user;
  canCreate: boolean = false;
  language: any;
  userId: any;
  companyId: any;
  pageName: any;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  hoverColor: any;
  superAdmin: boolean = false;
  company: any;
  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";
  tutorData: any;
  tutor: any;
  showConfirmationModal: boolean = false;
  selectedItem: any;
  confirmDeleteItemTitle: any;
  confirmDeleteItemDescription: any;
  acceptText: string = "";
  cancelText: any = "";
  confirmMode: string = "";
  @ViewChild("modalbutton", { static: false }) modalbutton:
    | ElementRef
    | undefined;
  featureId: any;
  courseFeatureId: any;
  tutorsFeature: any;
  coursesFeature: any;
  editHover: boolean = false;
  deactivateHover: boolean = false;
  courseUnits: any = [];
  tutorImage: any;
  tutorRating: any;
  tutorTypes: any;
  types: any;
  showCalendarSection: boolean = false;
  tutorTypeTags: any = [];
  hasDifferentStripeAccount: boolean = false;
  hasMultipleStripeAccountSetting: boolean = false;
  accountIds: any = [];
  showCalendly: boolean = false;
  showTutorTypes: boolean = false;
  hasStudentHours: boolean = false;
  showTutorCategories: boolean = false;
  hideCoursePackage: boolean = false;
  hasFreeBooking: boolean = false;
  courseCreditSetting: boolean = false;
  hasCreditPackageSetting: boolean = false;
  separateCourseCredits: number = 0;
  hasCategoryAccess: boolean = false;
  showCoursesByAccess: boolean = false;
  hasCoursePayment: boolean = false;
  selectedTutorCategory: any = [];
  companyCourseTutor: any = [];
  tutorCalendlySettings: any = [];
  tutorCalendlyUrl: any = [];
  tutorCalendlyUrlFixed: any = [];
  allCoursePackages: any = [];
  courses: any = [];
  courseSubscriptions: any = [];
  userCourseCredits: any = [];
  courseCategoryMapping: any = [];
  allCourseCategories: any = [];
  courseCategoriesAccessRoles: any = [];
  userCourses: any = [];
  courseExceptionUser: any = [];
  workingCourses: any = [];
  selectedTutorTypes: any = [];
  selectedWorkingCourse: any;
  selectedWorkingCourses: any = [];
  separateRemainingCourseCredits: number = 0;
  selectedWorkingPackages: any = [];
  packages: any = [];
  workingPackages: any = [];
  firstReload: boolean = false;
  selectedWorkingPackage: any;
  me: any;
  remainingCourseCredits: any = 0;
  creditsPercentage: any;

  constructor(
    private _router: Router,
    private _tutorsService: TutorsService,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _location: Location,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    initFlowbite();
    this.language =
      this._localService.getLocalStorage(environment.lslang) || "es";
    this._translateService.use(this.language || "es");

    this.emailDomain = this._localService.getLocalStorage(environment.lsemail);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
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
      this.company = company[0];
      this.emailDomain = company[0].domain;
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

    this.getTutor();
  }

  getTutor() {
    this._tutorsService
      .fetchTutor(this.id, this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.tutorData = data;
          this.initializePage();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializePage() {
    let data = this.tutorData;
    this.user = data?.user_permissions?.user;
    this.tutorTypes = data?.tutor_types;
    this.mapFeatures(data?.features_mapping);
    this.mapSubfeatures(data);
    this.mapUserPermissions(data?.user_permissions);
    this.formatTutor(data?.tutor);
    this.initializeBreadcrumb(data);
  }

  mapFeatures(features) {
    this.tutorsFeature = features?.find((f) => f.feature_id == 20);
    this.coursesFeature = features?.find((f) => f.feature_id == 11);
    this.featureId = this.tutorsFeature?.feature_id;
    this.courseFeatureId = this.coursesFeature?.feature_id;
    this.pageName = this.getFeatureTitle(this.tutorsFeature);
  }

  mapSubfeatures(data) {
    let subfeatures = data?.settings?.subfeatures;
    if (subfeatures?.length > 0) {
      this.showCalendly = subfeatures.some(a => a.name_en == 'Calendly' && a.active == 1 && a.feature_id == 11)
      this.showTutorTypes = subfeatures.some(a => a.name_en == 'Tutor types' && a.active == 1 && a.feature_id == 11)
      this.hasStudentHours = subfeatures.some(a => a.name_en == 'Student hours' && a.active == 1 && a.feature_id == 11)
      this.showTutorCategories = subfeatures.some(a => a.name_en == 'Show Tutor Category' && a.active == 1 && a.feature_id == 11)
      this.hideCoursePackage = subfeatures.some(a => a.name_en == 'Hide course and package' && a.active == 1 && a.feature_id == 11)
      this.hasFreeBooking = subfeatures.some(a => a.name_en == 'Free Calendly Scheduling' && a.active == 1 && a.feature_id == 11)
      this.courseCreditSetting = subfeatures.some(a => a.name_en == 'Credits' && a.active == 1 && a.feature_id == 11)
      this.hasCreditPackageSetting = subfeatures.some(a => a.name_en == 'Credit Packages' && a.active == 1 && a.feature_id == 11)
      this.separateCourseCredits = subfeatures.some(a => a.name_en == 'Separate credits by course' && a.active == 1 && a.feature_id == 11)
      
      this.hasCategoryAccess = subfeatures.some(a => a.name_en == 'Category access' && a.active == 1 && a.feature_id == 11)
      this.showCoursesByAccess = subfeatures.some(a => a.name_en == 'Show Courses' && a.active == 1 && a.feature_id == 11)
      this.hasCoursePayment = subfeatures.some(a => a.name_en == 'Course fee' && a.active == 1 && a.feature_id == 11)
      this.hasDifferentStripeAccount = subfeatures.some(a => a.name_en == 'Different Stripe accounts' && a.active == 1 && a.feature_id == 11)
      if(!this.hasMultipleStripeAccountSetting) { this.hasDifferentStripeAccount = false }
    }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canCreate =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find(
        (f) => f.create == 1 && f.feature_id == 20
      );
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

  formatTutor(data) {
    this.tutor = data;
    this.tutorImage = `${environment.api}/${this.tutor?.image}`;
    this.tutorRating = this.getTutorRating(this.tutor);
    this.types = this.getTutorTypes(this.tutor);
    this.accountIds = data?.tutor_account_ids;
    this.me = data?.user;

    this.companyCourseTutor = data?.course_tutor;
    this.tutorCalendlySettings = data?.tutor_calendly_setting;
    this.allCoursePackages = data?.company_course_packages;
    this.tutorCalendlyUrl = this.tutor?.calendly_url;
    this.tutorCalendlyUrlFixed = this.tutor?.calendly_url;

    let tutorCategory = data?.tutor_types;
    this.tutorTypeTags = data?.tutor_type_tags?.length > 0 ? data?.tutor_type_tags : [];
    if(tutorCategory?.length > 0 && !this.showTutorCategories){
      let tc_type_id: any[] = []
      tutorCategory.forEach(tc => {
        let tc_type = tc['tutorTypes']
        if(tc_type_id.indexOf(tc_type['id']) == -1){
          this.selectedTutorCategory.push(tc_type)
          tc_type_id.push(tc_type['id'])
        }
      })
    }
    if(this.tutorTypeTags?.length > 0 && this.showTutorCategories){
      this.tutorTypes?.forEach(tt => {
          this.tutorTypeTags?.forEach(ttt => {
          if(ttt.type_id == tt.id){
                  this.selectedTutorCategory.push(tt)
              }
          })
      })
    }

    if(this.courseCreditSetting) {
      let courseCredits = this.me?.course_credits ? this.me.course_credits : 0
      if(courseCredits) {
        this.remainingCourseCredits = this.me?.remaining_course_credits ? this.me.remaining_course_credits : 0                    
        this.creditsPercentage = (this.remainingCourseCredits/courseCredits)*100
      }
    }

    this.courses = data?.courses;
    this.courseSubscriptions = data?.course_subscriptions;
    this.userCourseCredits = data?.user_course_credits;
    this.courseCategoryMapping = data?.course_category_mapping;
    this.allCourseCategories = data?.course_categories;
    this.courseCategoriesAccessRoles = data?.course_category_access_roles;
    this.courseExceptionUser = data?.company_course_exception_user;
    this.getCompanyCourses();
  }

  getCompanyCourses() {
    this.courses = this.courses?.filter(cu => {
        let include = false;
        let tutor_ids = cu.course_tutors?.filter(ct => {
          return ct.course_id == cu.id
        })
        tutor_ids?.forEach(tid => {
          let tutor_id = this.tutor?.id ? this.tutor.id : 0;
          if(tid?.tutor_id == tutor_id){
            include = true
          }
        })
        if(cu.unassigned_status == 0){
          include = true
        }
        if(include){
          return cu
        }
    })

    this.getUserCourses();

    if(this.showTutorCategories || this.hideCoursePackage) {
        this.preLoadCalendly();
    }
  }

  getUserCourses() {
    let courses = this.courses;

    // console.log("user courses");
    // console.log(courses);

    let all_courses: any[] = []
    let courseIdArray: any[] = []
    if(courses) {
      courses.forEach(course => {
        let show_buy_now = true
        if(this.hasCoursePayment && course.price > 0) {
            let course_subscription
            if(this.courseSubscriptions?.length > 0) {
                course_subscription = this.courseSubscriptions && this.courseSubscriptions.filter(c => {
                    return c.user_id == this.userId && c.course_id == course.id
                })
                
            } else {
                if(this.userCourseCredits?.length > 0) {
                    course_subscription = this.userCourseCredits?.filter(ucc => {
                        return ucc.course_id == course.id
                    })
                }
            }
            if(course_subscription?.length > 0) {
                show_buy_now = false
            }
        } else {
            show_buy_now = false
        }

        if(!show_buy_now) {
            let include
            let is_category_exist = this.courseCategoryMapping && this.courseCategoryMapping.filter((f)=>f.course_id==course.id)
            if(is_category_exist.length > 0) {
                this.allCourseCategories.forEach(cc => {
                    let has_access = false
                    if(this.courseCategoriesAccessRoles) {
                        let user_type_roles = this.courseCategoriesAccessRoles.filter(r => {
                            return r.role_id == this.me?.custom_member_type_id
                        })
                        if(user_type_roles) {
                            user_type_roles.forEach(utr => {
                                if(utr.category_id == cc.id) {
                                    has_access = true
                                }
                            })
                        }
                    }

                    let match = this.courseCategoryMapping.some(a => a.category_id == cc.id && a.course_id == course.id)

                    if(match && has_access) {
                        include = true
                    }
                })
            } else{
                include = true                
            }
            show_buy_now = !include
            if(include){
                courseIdArray.push(course?.id)  
            }
        }

        all_courses.push({
          "id": course.id,
          "title": course.title,
          "title_en": course.title_en,
          "title_fr": course.title_fr,
          "title_eu": course.title_eu,
          "title_ca": course.title_ca,
          "title_de": course.title_de,
          "date": course.date,
          "image": course.image,
          "created_by": course.created_by,
          "created_at": course.created_at,
          "course_users": course.course_users,
          "price": course.price,
          "product_id": course.product_id,
          "plan_id": course.plan_id,
          "payment_type": course.payment_type,
          "show_buy_now": show_buy_now,
          "payment_method": course.payment_method,
          "video_cover": course.video_cover,
          "status": course.status,
          "group_id": course.group_id,
          "locked": course.locked,
          "button_color": course.button_color,
          "cta_status": course.cta_status,
          "cta_text": course.cta_text,
          "cta_link": course.cta_link,
          "buy_now_status": course.buy_now_status,
          "exception_access": course.exception_access == 1 ? 1 : 0,
          "unassigned_status": course.unassigned_status == 1 ? 1 : 0
        })
      });
    }

    if(this.showCoursesByAccess){
      all_courses = all_courses.filter((ac) => {
        let include = courseIdArray.indexOf(ac.id) != -1
        
        if(!include) {
          this.courseExceptionUser?.forEach(ceu => {
            if(ceu.course_id == ac.id && ceu.exception_access == 1){
              include = true
            }
          })
        }
        return include
      })
    }

    this.userCourses = all_courses
    this.userCourses = this.userCourses.sort((a, b) => {
      return b.id - a.id
    })
    // console.log("user courses 1")
    // console.log(this.userCourses)

    if(this.hasCategoryAccess) {
      this.showCoursesWithAccess()
    }
  }

  async showCoursesWithAccess() {
    this.userCourses = this.userCourses && this.userCourses.map(c => {
        if(this.allCourseCategories){
            let is_category_exist = this.courseCategoryMapping.filter((f)=>f.course_id==c.id)
            if(is_category_exist.length > 0) {
            let include = false;
            this.allCourseCategories.forEach(cc => {
                let has_access = false
                if(this.courseCategoriesAccessRoles) {
                let user_type_roles = this.courseCategoriesAccessRoles.filter(r => {
                    return r.role_id == this.me.custom_member_type_id
                })
                if(user_type_roles) {
                    user_type_roles.forEach(utr => {
                    if(utr.category_id == cc.id) {
                        has_access = true
                    }
                    })
                }
                }
    
                let match = this.courseCategoryMapping.some(a => a.category_id == cc.id && a.course_id == c.id)
                if(match && has_access) {
                include = true
                }
            })
            this.courseExceptionUser?.forEach(ceu => {
                if(ceu.course_id == c.id && ceu.exception_access == 1){
                include = true
                }
            })
            if(include){
                return c;
            } else {
                if(c.price == 0) {
                return {...c, locked: 1}
                }else {
                return c
                }
            }
            } else {
            return c
            }
        } else {
            return c
        }
    })
  }

  async preLoadCalendly() {       
    let courseIdArray: any[] = []
    this.companyCourseTutor.forEach(cct => {
        courseIdArray.push(cct.course_id)
    })

    this.workingCourses = this.courses?.filter(c => {
        return courseIdArray.includes(c.id)
    })

    if(this.hideCoursePackage && this.showTutorCategories && this.workingCourses?.length == 0 && this.courses?.length > 0) {
        this.workingCourses.push(this.courses[0])
    }

    // console.log("working courses");
    // console.log(this.workingCourses);

    let selectedcourse = this.courses[0]
    if(this.workingCourses?.length > 1 && this.userCourses?.length > 0) {
        let course_select = this.courses?.filter(c => {
            return c.id == this.userCourses[0].id
        })
        if(course_select?.length > 0) {
            selectedcourse = course_select[0]
        }
    }
    if(this.courses?.length > 0) {
        // Check if current user is a tutor of course
        let tutorid = this.tutor?.id
        if(tutorid > 0) {
            let courses = this.courses
            let new_courses: any[] = []
            courses.forEach(cu => {
                let include = false;
                cu.tutor_ids?.forEach(tid => {
                    let tutor_id = this.tutor?.id ? this.tutor.id : 0;
                    if(tid == tutor_id){
                        include = true
                    }
                })

                if(include) {
                    new_courses.push(cu)
                }
            })
            if(new_courses?.length > 0) {
                selectedcourse = new_courses[0]
            }
        }
    }
    await this.selectTutorCourse(selectedcourse)
    this._localService.setLocalStorage(environment.lstutortypes, this.selectedTutorTypes && this.selectedTutorTypes.length > 0 ? JSON.stringify(this.selectedTutorTypes) : '')
  }

  selectTutorCourse(course) {
    this.selectedWorkingCourse = course || ''
    this._localService.setLocalStorage("selectedWorkingCourse", this.selectedWorkingCourse ? this.selectedWorkingCourse.id : 0);

    // console.log("selected working course");
    // console.log(this.selectedWorkingCourse);

    this.getRemainingCourseCredits();

    if(this.hasSelectedCourse(course)) {
        this.selectedWorkingCourses && this.selectedWorkingCourses.forEach((typ , index)=> {
            if(typ.id == course.id) {
                this.selectedWorkingCourses.splice(index, 1)
            }
        });

    } else {
        let match = this.selectedWorkingCourses.some(a => a.id === course.id)
        if(!match) {
            this.selectedWorkingCourses = []
            this.selectedWorkingCourses.push(course)
        }
    }

    this.selectedWorkingPackages?.length > 0 && this.selectedWorkingPackages.forEach((typ , index)=> {
        this.workingPackages.forEach(wp => {
            if(typ.id == wp.id) {
                this.tutorCalendlyUrl = this.tutorCalendlyUrlFixed
                this.selectedWorkingPackages.splice(index, 1)
            }
        })
    });

    var coursesArr: any[] = []
    this.selectedWorkingCourses.forEach(element => {
        coursesArr.push(element?.id);
    });

    let arr: any[] = []
    if(this.allCoursePackages?.length > 0 && coursesArr?.length > 0) {
        this.allCoursePackages.forEach(acp => {
            let include = coursesArr.some(a => a == acp.course_id)
            if(include) {
                let match = arr.some(a => a == acp.package_id)
                if(!match) {
                    arr.push(acp.package_id) 
                }
            }
        })
    }

    var stemp = this.packages;
    let type_row = stemp && stemp.filter(att => {
        return arr.includes(att.id)
    })
    this.workingPackages = type_row;

    if(this.workingPackages?.length > 0 && this.firstReload && (this.showTutorCategories || this.hideCoursePackage)){
        this.firstReload = false
        this.tutorCalendlyUrl = this.tutorCalendlyUrlFixed
        this.selectTutorPackage(this.workingPackages[0])
    }
  }

  selectTutorPackage(pack) {
    this.selectedWorkingPackage = pack || ''
    this._localService.setLocalStorage("selectedWorkingPackage", this.selectedWorkingPackage ? this.selectedWorkingPackage.id : 0);
    this._localService.setLocalStorage("selectedWorkingCourse", this.selectedWorkingCourse ? this.selectedWorkingCourse.id : 0);

    if(this.hasSelectedPackage(pack)) {
        this.tutorCalendlyUrl = this.tutorCalendlyUrlFixed
        this.selectedWorkingPackages && this.selectedWorkingPackages.forEach((typ , index)=> {
            if(typ.id == pack.id) {
                this.selectedWorkingPackages.splice(index, 1)
            }
        });
    } else {
        let tutor_calendly_setting = this.tutorCalendlySettings.filter(tcs => {
            return tcs.pack_id == pack.id
        })
        let event_link_route = tutor_calendly_setting[0]?.event_link_route
        event_link_route = event_link_route?.replace(' ','-')

        if(event_link_route) {
            this.tutorCalendlyUrl = this.tutorCalendlyUrl + '/' + event_link_route
        }
        
        let match = this.selectedWorkingPackages.some(a => a.id === pack.id)
        if(!match) {
            this.selectedWorkingPackages = []
            this.selectedWorkingPackages.push(pack)
        }
    }

    var packagesArr: any[] = []
    this.selectedWorkingPackages.forEach(element => {
        packagesArr.push(element.id);
    });
  }

  hasSelectedPackage(pack) {
    let match = false

    if(this.selectedWorkingPackages && this.selectedWorkingPackages.length > 0) {
        match = this.selectedWorkingPackages.some(a => a.id === pack.id)
    }
    
    return match
  }

  hasSelectedCourse(course) {
    let match = false

    if(this.selectedWorkingCourses && this.selectedWorkingCourses.length > 0) {
        match = this.selectedWorkingCourses.some(a => a.id === course.id)
    }
    
    return match
  }

  getRemainingCourseCredits() {
    if(this.selectedWorkingCourse?.id > 0 && this.userCourseCredits?.length > 0) {
        let selected_user_course = this.userCourseCredits?.filter(uc => {
            return uc.course_id == this.selectedWorkingCourse?.id
        })
        if(selected_user_course?.length > 0) {
            let course = selected_user_course[0];
            if(course) {
                this.separateRemainingCourseCredits = course.remaining_credits || 0;
            }
        }
    }
  }

  getTutorRating(item) {
    let rating

    if(item?.tutor_ratings?.length > 0){
      let rating_array = item['tutor_ratings']
      let tut_rating = 0.0
      let no_of_rating = 0
      rating_array.forEach((tr) => {
          tut_rating += tr.tutor_rating ? parseFloat(tr.tutor_rating) : 0
          no_of_rating++
      })
      rating = (tut_rating/no_of_rating).toFixed(1);
    }

    return rating
  }

  getTutorTypes(item) {
    let types: any = []
    if(this.tutorTypes?.length > 0){
      types = []
      this.tutorTypes.forEach(tt => {
          let typeTutor = tt.tutorTypes.name_ES
          if(tt.tutor_id == item.id && !(types).includes(typeTutor)){
              (types)?.push(typeTutor)
          }
      })
    }

    return types;
  }

  initializeBreadcrumb(data) {
    this.level1Title = this.pageName;
    this.level2Title = this.tutor?.name;
    this.level3Title = "";
    this.level4Title = "";
  }

  handleEditRoute() {
    this._router.navigate([`/tutors/edit/${this.id}`]);
  }

  toggleEditHover(event) {
    this.editHover = event;
  }

  handleDeactivate() {
    if (this.id) {
      this.showConfirmationModal = false;
      this.confirmDeleteItemTitle = this._translateService.instant(
        "dialog.confirmupdate"
      );
      this.confirmDeleteItemDescription = this._translateService.instant(
        "dialog.confirmupdateitem"
      );
      this.acceptText = "OK";
      setTimeout(() => (this.showConfirmationModal = true));
    }
  }

  confirm() {
    this.deactivateTutor(this.id, true);
  }

  deactivateTutor(id, confirmed) {
    if (confirmed) {
      // this._cityGuidesService.deleteCityGuide(id, this.userId).subscribe(
      //   (response) => {
      //     this.open(
      //       this._translateService.instant("dialog.deletedsuccessfully"),
      //       ""
      //     );
      //     this._location.back();
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    }
  }

  toggleDeactivateHover(event) {
    this.deactivateHover = event;
  }

  handleGoBack() {
    this._location.back();
  }

  learnMore() {
    this.showCalendarSection = !this.showCalendarSection;
  }

  close() {
    this.showCalendarSection = false;
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
