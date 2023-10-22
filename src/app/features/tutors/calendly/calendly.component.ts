import { CommonModule, Location, NgOptimizedImage } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
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

declare var Calendly: any;

@Component({
  selector: 'app-calendly',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    NgOptimizedImage
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
  @Output() closeCalendar = new EventEmitter()

  userId: any;
  @ViewChild('container', {static: false}) container: ElementRef | undefined;

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
    setTimeout(() => {
      Calendly.initInlineWidget({
        url: url,
        parentElement: this.container?.nativeElement
      })
    }, 500)
  }

  close() {
    this.closeCalendar.emit()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
