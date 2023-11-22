import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { PageTitleComponent, ToastComponent } from '@share/components';
import { CompanyService, LocalService, UserService } from '@share/services';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "@env/environment";
import { TutorsService } from '@features/services';
import { StarRatingComponent } from '@lib/components';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { HistoryListComponent } from '@features/tutors/history-list/history-list.component';
import moment from 'moment';
import get from 'lodash/get';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        MatTableModule,
        MatSortModule,
        MatSnackBarModule,
        FormsModule,
        PageTitleComponent,
        StarRatingComponent,
        ToastComponent,
        HistoryListComponent
    ],
    templateUrl: './my-lessons.component.html',
    styleUrls: ["./my-lessons.component.scss"],
})
export class MyLessonsComponent {
    language: any
    emailDomain: any
    id: any
    companies: any
    companyName: any
    primaryColor: any
    buttonColor: any
    userId: any
    companyId: any
    tutor: any
    features: any
    pageName: any
    me: any
    company_subfeatures = []
    subfeature_id_global: number = 0
    feature_global: string = ''
    isLoading: boolean = true
    otherSettings: any
    roles: any = []
    hasCustomMemberTypeSettings: boolean = false
    admin1: boolean = false
    admin2: boolean = false
    superAdmin: boolean = false
    canManageTutor: boolean = false
    featureId: any
    tutorsFeature: any
    userPackages: any = []
    tutorPackages: any = []
    durationUnits: any = []
    showPackages: boolean = false
    isTutorUser: boolean = false
    tutorUsers: any = []
    statusFilter: any = 'All'
    superAdmins: any = []
    bookings: any = []
    allBookings: any = []
    superTutor: boolean = false
    rating: any = 0
    prevRatingValue: any = 0
    perHourCommission: boolean = false
    hasDifferentStripeAccounts: boolean = false
    tutorAccountId: any = []
    dataSource: any
    displayedColumns = [
        'action',
        'booking_date_display', 
        'booking_time', 
        'tutor_name', 
        'student_name', 
        // 'created_at_display', 
        'course', 
        // 'package_name', 
        'status', 
        'rating',
        'notes',
        'feedback', 
    ]
    isMobile: boolean = false
    showGiveFeedbackModal: boolean = false
    selectedBooking: any;
    feedback: any;
    feedbackFormSubmitted: boolean = false;
    superTutorStudents: any = []
    tutorsFeatureId: any;
    hasCourses: boolean = false;
    coursesFeatureId: any;
    showAddNotesModal: boolean = false;
    notes: any;
    notesFormSubmitted: boolean = false;
    cityAdmin: boolean = false;
    memberTypes: any = [];
    isGuardianType: boolean = false;
    transferCommissionsByBulk: any;
    pageTitle: any;
    @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
    courseFeatureId: any;
    company: any;
    showConfirmationModal: boolean = false;
    selectedItem: any;
    confirmDeleteItemTitle: any;
    confirmDeleteItemDescription: any;
    acceptText: string = "";
    cancelText: any = "";
    confirmMode: string = "";
    @ViewChild("modalbutton1", { static: false }) modalbutton1:
    | ElementRef
    | undefined;
    @ViewChild("closemodalbutton1", { static: false }) closemodalbutton1:
    | ElementRef
    | undefined;
    dialogTitle: any;
    dialogMode: string = '';
    historyListMode: any;
    historyListTitle: any;
    historyListBookingId: any;
    historyListUserId: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _userService: UserService,
        private _tutorsService: TutorsService,
        private _snackBar: MatSnackBar,
    ) {}

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    async ngOnInit() {
        this.onResize();
        this.userId = this._localService.getLocalStorage(environment.lsuserId)
        this.companyId = this._localService.getLocalStorage(environment.lscompanyId)
        this.language = this._localService.getLocalStorage(environment.lslang)
        this._translateService.use(this.language || 'es')

        this.companies = this._localService.getLocalStorage(environment.lscompanies) ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies)) : ''
        if(!this.companies) { this.companies = get(await this._companyService.getCompanies().toPromise(), 'companies') }
        let company = this._companyService.getCompany(this.companies)
        if(company && company[0]) {
            this.company = company[0]
            this.emailDomain = company[0].domain
            this.companyId = company[0].id
            this.primaryColor = company[0].primary_color
            this.buttonColor = company[0].button_color ? company[0].button_color : company[0].primary_color
        }

        this.initializePage();
    }

    initializePage() {
        this.pageTitle = this._translateService.instant('tutors.mylessons');
        
        this.features = this._localService.getLocalStorage(environment.lsfeatures) ? JSON.parse(this._localService.getLocalStorage(environment.lsfeatures)) : ''
        if(this.features && this.companyId > 0) {
            let tutorsFeature = this.features.filter(f => {
              return f.feature_name == "Tutors"
            })
        
            if(tutorsFeature && tutorsFeature[0]) {
              this.tutorsFeatureId = tutorsFeature[0].id
            }
      
            let courseFeature = this.features.filter(f => {
              return f.feature_name == "Courses"
            })
      
            if(courseFeature && courseFeature[0]) {
              this.courseFeatureId = courseFeature[0].id
            }
        }
      
        this.getCombinedBookingsPrefetch();
    }

    async getCombinedBookingsPrefetch() {
        this._userService.getCombinedBookingsPrefetch(this.companyId, this.tutorsFeatureId, this.coursesFeatureId, this.userId).subscribe(data => {
            let subfeatures = data[0] ? data[0]['subfeatures'] : []
            let courses_subfeatures = data[1] ? data[1]['subfeatures'] : []
            
            this.otherSettings = data[2] ? data[2]['other_settings'] : []
            this.getOtherSettings()

            this.me = data[3] ? data[3]['CompanyUser'] : []
            let roles = data[4] ? data[4]['role'] : []
            this.superAdmin = roles && roles.some(a => a.role == 'Super Admin')

            this.tutorUsers = data[5] ? data[5]['tutors'] : []
            
            if(this.tutorUsers?.length > 0) {
                this.isTutorUser = this.tutorUsers?.some(a => a.user_id == this.userId)
                let super_tutor = this.tutorUsers?.filter(tutor => {
                    return tutor?.user_id == this.userId && tutor?.super_tutor == 1
                })
                this.superTutor = super_tutor?.length > 0 ? true : false
                if(this.superTutor) {
                    this.superTutorStudents = super_tutor[0].super_tutor_students
                }

                this.tutorAccountId =  data[6] ? data[6]['account_ids'] : []
            }

            let cityAdmins = data[5] ? data[5]['city_admins'] : []
            if(cityAdmins?.length > 0) {
                this.cityAdmin = cityAdmins.some(a => a.user_id == this.userId)
              }

            if(!this.isTutorUser) {
                this.userPackages = data[7] ? data[7]['user_packages'] : []
                this.tutorPackages = data[7] ? data[7]['tutor_packages'] : []
            }
            this.tutorPackages = this.tutorPackages?.filter(p => {
                return p.default != 1
            })
            this.durationUnits = data[7] ? data[7]['durations'] : []
            if(this.userPackages.length == 0) {
                this.showPackages = true
            }

            this.memberTypes = data[8] ? data[8]['member_types'] : []
            if(this.memberTypes?.length > 0) {
                let selected = this.memberTypes?.find((f) => f.id == this.me?.custom_member_type_id)
                this.isGuardianType = selected?.guardian == 1 ? true : false
                if(this.isGuardianType) {
                    this.displayedColumns = ['booking_date_display', 'booking_time', 'tutor_name', 'student_name', 'created_at_display', 'course', 'package_name', 'status', 'rating']
                }
            }
            
            this.mapSubfeatures(subfeatures, courses_subfeatures)
            this.getBookings()
        }, error => {
          
        })
    }

    async mapSubfeatures(subfeatures,courses_subfeatures) {
        if(subfeatures?.length > 0) {
            this.perHourCommission = subfeatures.some(a => a.name_en == 'Per hour commission' && a.active == 1)
            this.transferCommissionsByBulk = subfeatures.some(a => a.name_en == 'Transfer commissions by bulk' && a.active == 1)
        }
        if(courses_subfeatures?.length > 0) {
            this.hasDifferentStripeAccounts = courses_subfeatures.some(a => a.name_en == 'Different Stripe accounts' && a.active == 1)
        }
    }

    getOtherSettings() {
        let other_settings: any[] = []
        if(this.otherSettings) {
            this.otherSettings.forEach(setting => {
                let section_title = setting.title_en
                let cont: any[] = []
                let content = setting.content
                if(content) {
                    content.forEach(c => {
                        if((section_title == 'Registration/Services' && c.title_en == 'Require subscription during registration with Stripe payment') ||
                            (section_title == 'Registration/Services' && c.title_en == 'STRIPE Secret API Key') ||
                            (section_title == 'Registration/Services' && c.title_en == 'Stripe Monthly Subscription API ID') ||
                            (section_title == 'Registration/Services' && c.title_en == 'Monthly Subscription Fee') ||
                            (section_title == 'Registration/Services' && c.title_en == 'STRIPE Publishable API Key') ||
                            (section_title == 'Registration/Services' && c.title_en == 'Require Stripe payment on specific member types') || 
                            (section_title == 'Registration/Services' && c.title_en == 'Custom member type expiration')
                        ) {
                            // Skip
                        } else {
                            cont.push(c)
                        }
                    });
                }

                other_settings.push({
                    active: setting.active,
                    content: cont,
                    created_at: setting.created_at,
                    id: setting.id,
                    title_en: setting.title_en,
                    title_es: setting.title_es
                })
            });
        }

        this.otherSettings = other_settings
        
        if(this.otherSettings) {
            this.otherSettings.forEach(async m => {
                if(m.title_es == 'Stripe') {
                    if(m.content) {
                        let stripeSettings = m.content.filter(c => {
                            return c.title_en.indexOf('Multiple Stripe Accounts') >= 0
                        })

                        if(stripeSettings && stripeSettings[0]) {
                            this.hasDifferentStripeAccounts = (stripeSettings[0].active == 1 && this.hasDifferentStripeAccounts) ? true : false
                        }
                    }
                }
            })
        }
    }

    getBookings(mode: any = '') {
        let role = this.isTutorUser ? 'tutor' : (this.superAdmin ? 'admin' : 'user')
        role = this.superTutor ? 'super_tutor' : (this.cityAdmin ? 'city_admin' : (this.isGuardianType ? 'guardian' : role))
        this._userService.getUserBookings(this.userId, this.companyId, role)
          .subscribe(
            async (response) => {
                let user_bookings = response['bookings']
                if(role == 'tutor' || role == 'super_tutor' || role == 'admin'){
                    user_bookings.forEach(ub => {
                        if(this.tutorAccountId?.length == 0){
                            ub.stripe_connect = false
                        }
                        this.tutorAccountId.forEach(ta => {
                            if(ub.stripe_id == ta.stripe_id){
                                ub.stripe_connect = true
                            }else{
                                ub.stripe_connect = false
                            }
                        })
                    })
                }

                user_bookings = user_bookings.map((booking) => {
                    return {
                        booking_date_display: moment(booking?.booking_date).format('DD/MM/YYYY'),
                        created_at_display: moment(booking?.created_at).format('DD/MM/YYYY'),
                        booking_time: `${this.getTime(booking?.booking_start_time)} - ${this.getTime(booking?.booking_end_time)}`,
                        student_name: booking?.user_name || (booking?.user_first_name + ' ' + booking?.user_last_name),
                        course: this.getCourseTitle(booking),
                        tutor_commission: `${booking?.commission ? (booking.commission).replace('.',',') : 0}€`,
                        rating: booking?.tutor_rating,
                        status: this.getStatus(booking),
                        transfer_status: booking.transfer_status,
                        error_code: booking.error_code,
                        show_feedback_button: !booking.feedback && booking.student_complete && (booking.user_id == this.userId) ? true : false,
                        notes: booking?.notes,
                        history: booking?.history,
                        show_mark_complete: this.showMarkCompleteButton(booking),
                        booking_action_required: this.isBookingActionRequired(booking),
                        pending_transfer: booking?.completed == 1 && booking?.transfer_status != 1 ? true : false,
                        can_receive_commission: booking?.tutor_user_type?.toLowerCase()?.indexOf('tutor') >= 0 && !booking?.super_tutor ? true : false,
                        show_cancel: this.showCancelButton(booking),
                        ...booking,
                    };
                })
                user_bookings?.sort((a, b) => {
                    const oldDate: any = new Date(a.booking_date)
                    const newDate: any = new Date(b.booking_date)
            
                    return newDate - oldDate
                })

                this.bookings = user_bookings
                this.allBookings = this.bookings
                this.isLoading = false
                this.populateBookingsTable()
            
                if(mode) {
                    this.statusFilter = (mode == 'completed') ? 'Completed' : (mode == 'cancelled' ? 'Cancelled' : 'Action required')
                    this.filterBookings()
                }
            },
            error => {
              console.log(error)
            }
          )
    }

    getCourseTitle(booking) {
        return this.language == 'en' ? booking?.course_title_en : (
            this.language == 'fr' ? booking?.course_title_fr : (
                this.language == 'eu' ? booking?.course_title_eu : (
                    this.language == 'ca' ? booking?.course_title_ca : (
                        this.language == 'de' ?  booking?.course_title_de : booking?.course_title
                    )
                )
            )
        )
    }

    populateBookingsTable() {
        setTimeout(() => {
            initFlowbite();
          }, 100);
        this.dataSource = new MatTableDataSource(this.bookings)
        if (this.sort) {
            this.dataSource.sort = this.sort;
        } else {
            setTimeout(() => this.dataSource.sort = this.sort);
        }
    }

    getDurationText(item) {
        let text = ''

        if(this.durationUnits && this.durationUnits.length > 0) {
            let duration

            let duration_row = this.durationUnits && this.durationUnits.filter(d => {
                return d.id == item.package.student_allotted_unit
            })

            if(duration_row && duration_row[0]) {
                duration = duration_row[0]
            }

            if(duration) {
                item = this.language == 'en' ? (duration.unit ? (duration.unit || duration.unit_es) : duration.unit_es) :
                    (this.language == 'fr' ? (duration.title_fr ? (duration.unit_fr || duration.unit_es) : duration.unit_es) : 
                        (this.language == 'eu' ? (duration.unit_eu ? (duration.unit_eu || duration.unit_es) : duration.unit_es) : 
                        (this.language == 'ca' ? (duration.unit_ca ? (duration.unit_ca || duration.unit_es) : duration.unit_es) : 
                            (this.language == 'de' ? (duration.unit_de ? (duration.unit_de || duration.unit_es) : duration.unit_es) : duration.unit_es)
                        )
                        )
                    )
            }
        }

        return item
    }

    filterLessonStatus(status) {
        this.statusFilter = status
        this.filterBookings()
    }

    filterBookings() {
        let bookings = this.allBookings

        if(this.statusFilter == 'Upcoming') {
            bookings = bookings && bookings.filter(booking => {
                let include = false

                if(booking.completed != 1 && booking?.cancelled != 1) {
                    if(moment(moment(booking.booking_date + ' ' + booking.booking_end_time).format('YYYY-MM-DD HH:mm:ss')).isSameOrAfter(moment().format('YYYY-MM-DD HH:mm:ss'))) {
                        include = true
                    }
                }

                return include
            })
        } else if(this.statusFilter == 'Action required') {
            bookings = bookings && bookings.filter(booking => {
                let include = false

                if(booking.completed != 1 && booking?.cancelled != 1) {
                    if(moment(moment(booking.booking_date + ' ' + booking.booking_end_time).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'))) {
                        include = true
                    }
                }
                if(booking.completed == 1 && booking.transfer_status == 0 && (this.superAdmin || this.isTutorUser)){
                    include = true
                }

                return include
            })
        } else if(this.statusFilter == 'Cancelled') {
            bookings = bookings && bookings.filter(booking => {
                return booking?.cancelled == 1
            })
        } else if(this.statusFilter == 'Completed') {
            bookings = bookings && bookings.filter(booking => {
                let completed = false
                if(booking.completed == 1 && (this.superAdmin || this.isTutorUser) && booking.transfer_status == 0){
                    completed = false
                }
                if(booking.completed == 1 && (this.superAdmin || this.isTutorUser) && booking.transfer_status != 0){
                    completed = true
                }
                if(booking.completed == 1 && (!this.superAdmin && !this.isTutorUser)){
                    completed = true
                }
                return completed
            })
        }

        this.bookings = bookings
        this.populateBookingsTable()
    }

    getTime(time) {
        let date = moment(new Date()).format('YYYY-MM-DD')
        let date_time = date + ' ' + time
        return moment(date_time).format('h:mm a').toUpperCase()
    }

    showCancelButton(booking) {
        return (this.superAdmin || booking?.tutor_user_id == this.userId) 
            && booking?.cancelled != 1 && booking?.completed != 1 && booking?.tutor_complete != 1 && booking?.student_complete != 1 
            && !booking?.tutor_rating && this.statusFilter != 'Completed' 
            && moment(moment(booking.booking_date + ' ' + booking.booking_end_time).format('YYYY-MM-DD HH:mm:ss')).isSameOrAfter(moment().format('YYYY-MM-DD HH:mm:ss'))
    }

    showMarkCompleteButton(booking) { 
        let show = false

        if(this.isTutorUser && booking?.tutor_complete != 1) {
            show = true
        }

        if(!this.isTutorUser && !this.superAdmin && booking?.student_complete != 1) {
            show = true
        }

        if(this.superAdmin) {
            show = true
        }

        if(this.superAdmin && !this.isTutorUser && booking?.tutor_complete != 1 && booking?.student_complete == 1){
            show = false
        }
        return show && booking?.completed != 1
    }

    isBookingActionRequired(booking) {
        let action_required_bookings = this.allBookings && this.allBookings.filter(bk => {
            let include = false
            
            if(moment(moment(booking.booking_date + ' ' + booking.booking_end_time).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'))) {
                include = true
            }

            return include && booking?.id == bk?.id && bk?.completed != 1
        })

        if(action_required_bookings && action_required_bookings.length > 0) {
            return true
        } else {
            return false
        }
    }

    getStatus(booking) {
        let status = ''

        if(this.isTutorUser && !booking.student_complete) {
            status = this._translateService.instant('tutors.waitingstudentcomplete')
        }

        if(!this.isTutorUser && !this.superAdmin && !booking.tutor_complete) {
            status = this._translateService.instant('tutors.waitingtutorcomplete')
        }

        if(this.superAdmin) {
            if(this.isTutorUser && !booking.student_complete) {
                status = `<p>${this._translateService.instant('tutors.waitingstudentcomplete')}</p>`
            }
    
            if(!this.isTutorUser && !this.superAdmin && !booking.tutor_complete) {
                status += `<p>${this._translateService.instant('tutors.waitingtutorcomplete')}</p>`
            }
        }

        if(this.superAdmin && !this.isTutorUser && booking.tutor_complete != 1){
            status = this._translateService.instant('tutors.waitingtutorcomplete')
        }

        if(moment(booking.booking_date).isSameOrAfter(moment().format('YYYY-MM-DD'))) {
            status = ''
        }

        return status
    }

    getPacakgeDuration(duration_unit){
        duration_unit = Number(duration_unit)
        switch(duration_unit){
            case 1:
                return this._translateService.instant('timeunits.minutes')
            case 2:
                return this._translateService.instant('timeunits.hours')
            case 3:
                return this._translateService.instant('timeunits.days')
            case 4:
                return this._translateService.instant('timeunits.weeks')
            case 5:
                return this._translateService.instant('timeunits.months')
            case 6:
                return this._translateService.instant('timeunits.years')
        }

    }

    getTutoringType(package_name) {
        return package_name ? this._translateService.instant('course-create.package') : this._translateService.instant('tutors.individualtutoring');
    }

    openFeedbackPopup(row) {
        this.feedback = ''
        this.selectedBooking = ''
        this.dialogMode = 'feedback'
        this.dialogTitle = this._translateService.instant('company-settings.givefeedback')
        this.selectedBooking = row
        this.modalbutton1?.nativeElement.click();
    }

    submitFeedback() {
        this.feedbackFormSubmitted = true

        if(!this.feedback) return false

        let params = {
            id : this.selectedBooking?.id || 0,
            feedback: this.feedback,
        }

        this._tutorsService.giveFeedback(params)
        .subscribe(
            async (response) => {
                let bookings = this.bookings
                bookings?.forEach(b => {
                    if(b.id == this.selectedBooking.id) {
                        b.feedback = this.feedback;
                        b.show_feedback_button = false;
                    }
                })
                this.bookings = bookings;
                this.populateBookingsTable();
                this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
                this.closemodalbutton1?.nativeElement.click();
            }
        )
    }

    handleCancelBooking(row) {
        if (row.id) {
            this.showConfirmationModal = false;
            this.selectedItem = row;
            this.confirmMode = "cancel";
            this.confirmDeleteItemTitle = this._translateService.instant(
              "dialog.confirmcancel"
            );
            this.confirmDeleteItemDescription = this._translateService.instant(
              "dialog.confirmcancelitem"
            );
            this.acceptText = "OK";
            setTimeout(() => (this.showConfirmationModal = true));
        }
    }

    confirm() {
        if (this.confirmMode == "cancel") {
            this.cancelBooking(this.selectedItem.id, this.selectedItem.user_id, true);
            this.showConfirmationModal = false;
        } else if (this.confirmMode == "complete") {
            this.markComplete(this.selectedItem, true);
            this.showConfirmationModal = false;
        }
      }

    cancelBooking(id, user_id, confirmed) {
        if(confirmed) {
            let params = {
                id,
                user_id,
            }
            
            this._tutorsService.cancelBooking(params).subscribe(data => {
                let bookings = this.allBookings
                bookings?.forEach(b => {
                    if(b.id == this.selectedItem.id) {
                        b.cancelled = 1
                        b.show_cancel = false
                    }
                })
                this.statusFilter = 'Cancelled';
                this.filterBookings();
                this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
            }, err => {
                console.log('err: ', err);
            })
        }
    }

    confirmMarkComplete(row) {
        if (row.id) {
            this.showConfirmationModal = false;
            this.selectedItem = row;
            this.confirmMode = "complete";
            this.confirmDeleteItemTitle = this._translateService.instant(
              "campaign-details.confirmation"
            );
            this.confirmDeleteItemDescription = this._translateService.instant(
              "tutors.markcomplete"
            );
            this.acceptText = "OK";
            setTimeout(() => (this.showConfirmationModal = true));
        }
    }

    markComplete(booking, confirmed) {
        if(confirmed) {
            let role = this.isTutorUser && !this.superAdmin ? 'tutor' : (this.superAdmin ? 'admin' : 'user')
            let params = {
                id: booking.id,
                role: role,
            }

            params['user_id'] = booking.user_id
            params['tutor_id'] = booking.tutor_id
            params['course_id'] = booking.course_id
            params['company_id'] = this.companyId
            if(this.hasDifferentStripeAccounts){
                params['has_diff_stripe_account'] = this.hasDifferentStripeAccounts
            }
            let booking_id = booking.id
            this._tutorsService.editBookingStatus(params)
            .subscribe(
                async (response) => {
                    let completedLesson = response?.booking ? response.booking : '';
                    let lessonCompleted = response?.booking?.completed == 1 ? true : false

                    if(lessonCompleted){
                        let params2 = {
                            booking_id : completedLesson?.id ? completedLesson.id : 0,
                            course_id: completedLesson?.course_id,
                            package_id: completedLesson?.package_id,
                            user_id: completedLesson?.user_id,
                            tutor_id: completedLesson?.tutor_id,
                            tutor_minutes: booking.tutor_minutes,
                            per_hour_commission: this.perHourCommission

                        }

                        if(this.hasDifferentStripeAccounts){
                            params2['has_diff_stripe_account'] = this.hasDifferentStripeAccounts
                            params2['stripe_id'] = response.stripe_id
                        }
                        await this._tutorsService.handleTutorTransfer(booking_id, params2)
                        .subscribe(
                            async (response) => {
                                if(response?.message == 'balance_insufficient' && (this.isTutorUser || this.superAdmin)){
                                    this.getBookings('refresh-action')
                                } else {
                                    let bookings = this.allBookings
                                    bookings?.forEach(b => {
                                        if(b.id == this.selectedItem.id) {
                                            b.completed = 1
                                        }
                                    })
                                    this.statusFilter = 'Completed';
                                    this.filterBookings();
                                }
                                this.open(this._translateService.instant('dialog.savedsuccessfully'), '')
                            }
                        )
                    } else {
                        this.getBookings('refresh-action')
                        this.open(this._translateService.instant('dialog.savedsuccessfully'), '')
                    }
                },
                error => {
                    console.log(error)
                }
            )
        }
    }

    async open(message: string, action: string) {
        await this._snackBar.open(message, action, {
            duration: 3000,
            panelClass: ["info-snackbar"],
        });
    }

    addNotes(row) {
        this.notes = ''
        this.selectedBooking = ''
        this.dialogMode = 'add-notes'
        this.dialogTitle = this._translateService.instant('guests.notes')
        this.selectedBooking = row
        this.modalbutton1?.nativeElement.click();
    }

    submitNotes() {
        this.notesFormSubmitted = true

        if(!this.notes) return false

        let params = {
            booking_id : this.selectedBooking?.id || 0,
            created_by: this.userId,
            company_id: this.companyId,
            notes: this.notes,
        }

        this._tutorsService.addNotes(params)
        .subscribe(
            async (response) => {
                this.closemodalbutton1?.nativeElement.click();
                this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
            }
        )
    }

    viewNotes(row) {
        this.historyListMode = 'notes';
        this.historyListTitle = this._translateService.instant('guests.notes');
        this.historyListBookingId = row.id;
        this.dialogMode = 'view-notes';
        this.dialogTitle = this._translateService.instant('guests.notes');
        this.modalbutton1?.nativeElement.click();
    }

    provideRating(row) {
        this.dialogMode = 'rating'
        this.dialogTitle = this._translateService.instant('event-survey.rate')
        this.selectedBooking = row
        this.modalbutton1?.nativeElement.click();
    }

    acceptRating() {
        this.prevRatingValue = this.rating
        let tutor_rating = this.rating ? parseFloat(this.rating)?.toFixed(1) : 0
        let booking = this.selectedBooking
        let tutor_id = booking.tutor_id
        this._tutorsService.addTutorRating(booking.user_id, booking.company_id, tutor_id, {rating : this.rating, booking_id : booking.id}).subscribe(
            async response => {
                if(response){
                    booking.tutor_rating = tutor_rating
                    // Update booking rating
                    let bookings = this.bookings
                    bookings?.forEach(b => {
                        if(b.id == this.selectedBooking.id) {
                            b.tutor_rating = tutor_rating
                        }
                    })
                    this.bookings = bookings;
                    this.populateBookingsTable();
                    this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
                    this.closemodalbutton1?.nativeElement.click();
                }
        });
    }
}
