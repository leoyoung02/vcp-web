import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "@env/environment";
import { PageTitleComponent } from "@share/components";
import { ProfessionalsService } from "@features/services/professionals/professionals.service";
import { Subscription } from 'rxjs';
import { initFlowbite } from "flowbite";
import { timer } from "@lib/utils/timer/timer.utils";
import get from "lodash/get";

@Component({
  selector: "app-professionals",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    PageTitleComponent,
  ],
  templateUrl: "./list.component.html",
})
export class ProfessionalsListComponent {
  private destroy$ = new Subject<void>();

  languageChangeSubscription;
  language: any;
  isMobile: boolean = false;
  companyId: any;
  userId: any;
  showToast: boolean = false;

  pusherSubscription: Subscription | undefined;
  pusherData: any = {};
  intervalId: any;
  lastchecked: any;
  toastMessage: string = '';
  toastMode: string = '';
  selectedId: any;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  hoverColor: any;
  professionalImage: any;
  professionalName: any;
  professional: any;
  user: any;

  time: number = 0;
  display ;
  interval;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    public _professionalsService: ProfessionalsService,
  ) {
    
  }

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.user = this._localService.getLocalStorage(environment.lsuser);

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

    this.initializePage();
  }

  initializePage() {
    this.getTestProfessional();
    this.subscribeVoiceCall();
  }

  getTestProfessional() {
    this._userService
      .getUserById(41051)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.professional = response.CompanyUser;
          this.professionalImage = `${environment.api}/${this.professional.image}`;
          this.professionalName = this.professional?.first_name ? `${this.professional.first_name} ${this.professional.last_name}` : this.professional.name;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  subscribeVoiceCall() {
    this.pusherSubscription = this._professionalsService
      .getFeedItems()
      .subscribe(async(response) => {
        if(response?.id == this.userId || response?.channel == this.userId) {
          this.pusherData = response;
          this.toastMessage = response.message || 'Incoming call...';
          this.toastMode = response.mode;

          if(this.toastMode == 'end-call') {
            await this._professionalsService.leaveCall();
            this.showToast = false;
          } else if(this.toastMode == 'ongoing-call') {
            this.startTimer();
          }
        }
      })
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = timer.transform(this.time);
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  async handleStartCall(id, phone_number, name, avatar) {
    this.display = '';
    this.selectedId = id;

    const channel =  `agora-vcp-${id}`;
    let caller_uid = Math.floor(Math.random() * 2032);

    setTimeout(() => {
      initFlowbite();
      this.toastMessage = 'Dialing...';
      this.toastMode = 'initiate-call';
      this.showToast = true;
      let params = {
        id,
        user_id: this.userId,
        company_id: this.companyId,
        mode: 'accept-call',
        message: 'Incoming call',
        caller_name: this.user?.first_name ? `${this.user.first_name} ${this.user.last_name}` : this.user.name,
        caller_image: `${environment.api}/${this.user?.image}`,
        phone: phone_number,
        room: channel,
        caller_uid,
      }
      this.notifyProfessional(params);
    }, 100);

    const token = get(await this._professionalsService.generateRTCToken(channel, 'publisher', 'uid', this.userId).toPromise(), 'rtcToken')
    this._professionalsService.createRTCClient();
    this._professionalsService.agoraServerEvents(this._professionalsService.rtc);
    await this._professionalsService.localUser(channel, token, caller_uid, 'initiate-call');
  }

  notifyProfessional(params) {
    this._professionalsService.notifyProfessional(params).subscribe(
      (response) => {
        
      },
      (error) => {
        console.log(error);
      })
  }

  async cancelCall() {
    await this._professionalsService.leaveCall();
    let params = {
      id: this.professional?.id,
      user_id: this.userId,
      company_id: this.companyId,
      mode: 'end-call',
      channel: this.userId,
    }
    this.notifyProfessional(params);
    this._professionalsService.leaveCall();
    this.showToast = false;
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.pusherSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}