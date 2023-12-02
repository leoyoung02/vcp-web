import { CommonModule, Location, NgOptimizedImage } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TutorsService } from "@features/services";
import {
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { LocalService, CompanyService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "@env/environment";
import { ToastComponent } from "@share/components";
import moment from 'moment';

declare var Calendly: any;

@Component({
  selector: 'app-calendly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    NgOptimizedImage,
    ToastComponent,
  ],
  templateUrl: './calendly.component.html'
})
export class CalendlyComponent {
  private destroy$ = new Subject<void>();

  @Input() buttonColor: any;
  @Input() link: any;
  @Input() tutorUserId: any;
  @Input() tutorId: any;
  @Input() companyId: any;
  @Input() hasFreeBooking: any;
  @Input() courseCreditSetting: any;
  @Input() remainingCredits: any;
  @Input() separateCourseCredits: any;
  @Input() separateRemainingCourseCredits: any;
  @Input() name: any;
  @Input() first_name: any;
  @Input() last_name: any;
  @Input() email: any;
  @Input() company: any;
  @Input() canBook: any;
  @Output() closeCalendar = new EventEmitter();

  userId: any;
  tutorTypes: any;
  calendlyEvent: any
  packageId: number = 0;
  courseId: number = 0;
  language: any;
  showConfirmationModal: boolean = false;
  @ViewChild('container', {static: false}) container: ElementRef | undefined;
  params: any;
  confirmItemTitle: any;
  confirmItemDescription: any;
  acceptText: string = '';
  bookingSuccessful: boolean = false;

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
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
    this.tutorTypes = this._localService.getLocalStorage(environment.lstutortypes) ? JSON.parse(this._localService.getLocalStorage(environment.lstutortypes)) : [];
    this.initializeCalendar();
  }

  initializeCalendar() {
    let url = this.link
    let name = this.name ? this.name : (this.first_name + ' ' + this.last_name);
    if(name && this.email) {
        url = this.link + '?hide_event_type_details=1&name=' + name.replace(' ', '%20') + '&email=' + this.email;
    } else if(name && !this.email) {
        url = this.link + '?hide_event_type_details=1&' + name.replace(' ', '%20');
    } else if(!name && this.email) {
        url = this.link + '?hide_event_type_details=1&' + this.email;
    }
    if(this.link) {
      setTimeout(() => {
        Calendly.initInlineWidget({
          url: url,
          parentElement: this.container?.nativeElement
        })
      }, 500)
    }
  }

  @HostListener('window:message', ['$event']) isCalendlyEvent(evt) {
    console.log(evt.data)

    if(evt.data.event && evt.data.event.indexOf('calendly.event_scheduled') === 0) {
      console.log('calendly.event_scheduled')
      let event_guid = evt.data && evt.data.payload && evt.data.payload.event ? evt.data.payload.event.uri : ''
      if(event_guid) {
        event_guid = event_guid.replace('https://api.calendly.com/scheduled_events/', '')
      }

      let invitee_guid = evt.data && evt.data.payload && evt.data.payload.invitee ? evt.data.payload.invitee.uri : ''
      if(invitee_guid) {
        invitee_guid = invitee_guid.replace('https://api.calendly.com/scheduled_events/', '')
        invitee_guid = invitee_guid.replace(event_guid + '/', '')
        invitee_guid = invitee_guid.replace('invitees/', '')
      }
      this.getCalendlyEventDetails(event_guid, invitee_guid)
    }

    if(evt.data.event && evt.data.event.indexOf('calendly.date_and_time_selected') === 0) {
      this.courseId = this._localService.getLocalStorage("selectedWorkingCourse") ? this._localService.getLocalStorage("selectedWorkingCourse") : 0
      console.log('calendly.date_and_time_selected: ' + this.courseId)
    }
  }

  getCalendlyEventDetails(event_guid, invitee_guid) {
    this._tutorsService.getCalendlyEvent(event_guid, this.tutorUserId).subscribe(response => {
      this.calendlyEvent = response?.data?.resource ? response.data.resource : null
      if(!this.calendlyEvent) {
        this.bookingSuccessful = false;
        this.confirmModal(null);
      } else {
        this.bookLesson(event_guid, invitee_guid)
      }
      return false
    }, err => {
      console.log('err: ', err);
    })
  }

  bookLesson(event_guid, invitee_guid) {
    this.packageId = this._localService.getLocalStorage("selectedWorkingPackage") ? this._localService.getLocalStorage("selectedWorkingPackage") : 0;

    let params = {
      company_id: this.companyId,
      user_id: this.userId,
      tutor_id: this.tutorId,
      package_id: this.packageId,
      course_id: this.courseId,
      booking_date: moment(this.calendlyEvent.start_time).format('YYYY-MM-DD'),
      booking_start_time: moment(this.calendlyEvent.start_time).format('HH:mm'),
      booking_end_time: moment(this.calendlyEvent.end_time).format('HH:mm'),
      tutor_types: this.tutorTypes && this.tutorTypes.map( (data) => { return data.id }).join(),
      calendly_event_id: event_guid, 
      calendly_invitee_id: invitee_guid,
    }
    
    if(this.courseCreditSetting) {
      if(!this.separateCourseCredits && this.remainingCredits > 0) {
        params['remaining_course_credits'] = this.remainingCredits - 1
      }
      if(this.separateCourseCredits && this.separateRemainingCourseCredits > 0) {
        params['separate_course_credits'] = this.separateCourseCredits ? 1 : 0
        params['remaining_credits'] = this.separateRemainingCourseCredits - 1
      }
    }
    this._tutorsService.addTutorBooking(params).subscribe(data => {
      let bookingId = data.id
      let bookingPaid = data.paid
      if(this.hasFreeBooking && !this.courseCreditSetting){
        bookingPaid = 1
      }
      if((this.courseCreditSetting && this.remainingCredits > 0) || this.canBook){
        bookingPaid = 1
      }
      if (bookingPaid == 1) {
        this.confirmBooked(params);
      } else if(this.userId > 0) {
        location.href = `/signup/tutor/pay/${bookingId}/${this.userId}`
      } else {
        location.href = `/login?redirect=signup/tutor/pay/${bookingId}/`
      }
    }, err => {
      console.log('err: ', err);
    })
  }

  confirmBooked(params) {
    this.language = this._localService.getLocalStorage(environment.lslang)
    this._translateService.use(this.language || 'es')
    this.bookingSuccessful = true;
    this.confirmModal(params);
  }

  confirmModal(params) {
    this.showConfirmationModal = false;
    if(this.bookingSuccessful) {
      this.params = params;
      this.confirmItemTitle = this._translateService.instant(
        "campaign-details.confirmation"
      );
      this.confirmItemDescription = this._translateService.instant(
        "tutors.bookingconfirmed"
      ) + '                                                                                  ';
    } else {
      this.confirmItemTitle = this._translateService.instant(
        "calendly-course.bookingheadertext"
      );
      this.confirmItemDescription = this._translateService.instant(
        "calendly-course.bookingbodytext"
      )  + '                                                                                  ';
    }
    this.acceptText = "OK";
    setTimeout(() => (this.showConfirmationModal = true));
  }

  async confirm() {
    if(this.bookingSuccessful) {
      let params = this.params;
      this._tutorsService.sendBookingConfirmationEmail(params).subscribe(data => {
        location.reload()
      }, err => {
        console.log('err: ', err);
      })
    }
  }

  close() {
    this.closeCalendar.emit()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
