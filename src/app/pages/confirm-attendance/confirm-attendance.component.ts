import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { environment } from "@env/environment";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PlansService } from "@features/services";
import { NoAccessComponent } from "@share/components";

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule, 
    FormsModule, 
    MatSnackBarModule,
    NoAccessComponent,
  ],
  templateUrl: "./confirm-attendance.component.html",
})
export class ConfirmAttendanceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() eventId!: number;
  @Input() eventTypeId!: number;
  @Input() userGuid!: string;

  languageChangeSubscription;
  userId: any;
  language: any;
  features: any;
  companies: any;
  companyId: any;
  domain: any;
  buttonColor: any;
  primaryColor: any;
  isloading: boolean = true;
  companyName: any;
  company: any;
  activityCode: any;
  submitted: boolean = false;
  confirmedAttendance: boolean = false;
  @ViewChild('inputActivityCode') inputActivityCode: any;
  event: any;
  user: any;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _plansService: PlansService,
    private _router: Router,
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslang) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this._translateService.use(this.language || "es");

    this.companies = this._localService.getLocalStorage(environment.lscompanies)
      ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
      : "";
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
      this.company = company[0];
      this.companyId = company[0].id;
      this.companyName = company[0].entity_name;
      this.domain = company[0].domain;
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

    this.getActivityCodeData();
  }

  ngAfterViewInit(): void {
    // this.inputActivityCode?.nativeElement?.focus();
  }

  public ngAfterViewChecked(): void {
    this.inputActivityCode?.nativeElement?.focus();
  }

  getActivityCodeData() {
    this._plansService
      .getActivityCodeData(this.eventId, this.eventTypeId, this.userGuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          console.log(data)
          this.event = data.event;
          this.user = data.user;
          this.initializePage();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializePage() {
    this.isloading = false;
  }

  confirmAttendance() {
    this.submitted = true;

    if(!this.activityCode) {
      return false;
    }

    if(this.activityCode != this.event?.activity_code) {
      this.open((this._translateService.instant('plan-details.invalidcode')), '');
      return false;
    }

    let params = {
      event_id: this.eventId,
      event_type_id: this.eventTypeId,
      user_id: this.user?.id,
      company_id: this.companyId,
    }

    this._plansService.confirmAttendance(params)    
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          if(response) {
            this.confirmedAttendance = true;
          } else {
            this.open((this._translateService.instant('dialog.error')), '');
          }
        },
        error => {
          
        });
  }

  async goHome() {
    this._router.navigate([`/`]);
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
  }

  ngOnDestroy(): void {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}