import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectorRef,
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
import { ProfessionalsService } from "@features/services/professionals/professionals.service";
import { VoiceCallRoomComponent } from "@share/components";
import { Subscription } from 'rxjs';
import { environment } from "@env/environment";
import { timer } from "@lib/utils/timer/timer.utils";
import moment from "moment";
import get from "lodash/get";

@Component({
  selector: "app-voice-room",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    VoiceCallRoomComponent,
  ],
  templateUrl: "./voice.component.html",
})
export class VoiceRoomComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;
  @Input() userId: any;
  @Input() phone: any;

  languageChangeSubscription;
  language: any;
  isMobile: boolean = false;
  companyId: any;
  primaryColor: any;
  buttonColor: any;
  micMuted: boolean = true;
  showEndCall: boolean = false;
  callerImage: any;
  callerName: any;
  personalData: any = [];
  companies: any;
  showActions: boolean = false;
  pusherSubscription: Subscription | undefined;
  pusherData: any = {};
  caller: any;
  statusText: any;
  time: number = 0;
  interval;
  recipientUid: any;
  room: any;
  requirePasscode: boolean = false;
  invalidPasscode: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    private _professionalsService: ProfessionalsService,
    private _location: Location,
    private cd: ChangeDetectorRef
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.companyId = this._localService.getLocalStorage(environment.lscompanyId);

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
    }
    
    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );

    this.subscribeVoiceCall();
    this.initializePage();
    this.getCallerInfo();
  }

  subscribeVoiceCall() {
    this.pusherSubscription = this._professionalsService
      .getFeedItems()
      .subscribe(async(response) => {
        if(response?.id == this.userId || response?.channel == this.userId) {
          this.pusherData = response;

          if(response.message == 'end-call') {
            this._professionalsService.leaveCall();
            this.showEndCall = false;
            this.showActions = false;
          }
        }
      })
  }

  getCallerInfo() {
    this._userService
      .getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.caller = response.CompanyUser;
          this.callerImage = `${environment.api}/${this.caller.image}`;
          this.callerName = this.caller?.first_name ? `${this.caller.first_name} ${this.caller.last_name}` : this.caller.name;
          this.initializePersonalFields(this.caller);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializePersonalFields(caller) {
    this.personalData = [
      {
        label: this._translateService.instant('signup.name'),
        value: this.callerName
      },
      {
        label: this._translateService.instant('profile-settings.birthday'),
        value: caller.birthday ? moment(caller.birthday).format('DD/MM/YYYY') : '-'
      },
      {
        label: this._translateService.instant('professionals.gender'),
        value: caller?.gender || '-'
      },
      {
        label: this._translateService.instant('professionals.civilstatus'),
        value: caller?.civil_status || '-'
      },
      {
        label: this._translateService.instant('profile-settings.position'),
        value: caller?.position || ''
      },
      {
        label: this._translateService.instant('profile-settings.city'),
        value: caller?.city || ''
      },
      {
        label: this._translateService.instant('profile-settings.country'),
        value: caller?.country || ''
      },
    ]
  }

  async initializePage() {
    this.statusText = "Connecting...";
    this.micMuted = this._professionalsService.rtc.micMuted;
    const channel =  `agora-vcp-${this.id}`
    this.room = channel;
    this.recipientUid = Math.floor(Math.random() * 2032);
    const token = get(await this._professionalsService.generateRTCToken(channel, 'publisher', 'uid', this.userId).toPromise(), 'rtcToken')
    this._professionalsService.createRTCClient();
    this._professionalsService.agoraServerEvents(this._professionalsService.rtc);
    await this._professionalsService.localUser(channel, token, this.recipientUid);
    // this.showEndCall = true;
    this.showActions = true;
    this.acceptCall(token, this.recipientUid);
  }

  acceptCall(token, recipient_uid) {
    this.handleOutboundPSTN(this.userId, this.caller?.phone, `agora-vcp-${this.id}`, token, recipient_uid);
  }

  handleOutboundPSTN(uid, phone_number, channel, token, recipient_uid) {
    let params = {
      company_id: this.companyId,
      uid,
      channel,
      to: phone_number,
      token,
      professional_user_id: this.id,
      caller_user_id: this.userId,
      recipient_uid: recipient_uid,
    }

    this._professionalsService.voiceCall(params).subscribe(
      (response) => {
        let params = {
          id: this.id,
          user_id: this.userId,
          company_id: this.companyId,
          mode: 'ongoing-call',
          message: 'Ongoing call...',
          channel: this.userId
        }
        this.notifyProfessional(params);
        this.startTimer();
      },
      (error) => {
        console.log(error);
      })
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.statusText = timer.transform(this.time);
      this.cd.detectChanges;
    }, 1000);
  }

  toggleMic() {
    this._professionalsService.rtc.micMuted = !this._professionalsService.rtc.micMuted;
    this.micMuted = this._professionalsService.rtc.micMuted;
    this._professionalsService.toggleMic();
    this.cd.detectChanges();
  }

  async endCall() {
    clearInterval(this.interval);
    await this._professionalsService.leaveCall();
    let params = {
      id: this.id,
      user_id: this.userId,
      company_id: this.companyId,
      mode: 'end-call',
      channel: this.userId,
      room: this.room,
      recipient_uid: this.recipientUid,
    }
    this.notifyProfessional(params);
    this._professionalsService.leaveCall();
    // this.showEndCall = false;
    this.statusText = `Call has ended ${timer.transform(this.time)}`;
    this.showActions = false;
    setTimeout(() => {
      location.href = '/';
    }, 1000)
  }

  notifyProfessional(params) {
    this._professionalsService.notifyProfessional(params).subscribe(
      (response) => {
        
      },
      (error) => {
        console.log(error);
      })
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}