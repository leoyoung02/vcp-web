import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { ProfessionalsService, VoiceCallService } from "@features/services";
import { Subject, takeUntil } from "rxjs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "@env/environment";
import { PageTitleComponent, ToastComponent } from "@share/components";
import { ProfessionalCardComponent } from "@share/components/card/professional/professional.component";
import { Subscription } from 'rxjs';
import { initFlowbite } from "flowbite";
import { timer } from "@lib/utils/timer/timer.utils";
import moment from 'moment';
import get from "lodash/get";

@Component({
  selector: "app-professionals",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleComponent,
    ProfessionalCardComponent,
    ToastComponent,
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
  professionalRate: any = 0.89;
  professional: any;
  user: any;

  time: number = 0;
  display ;
  interval;
  professionalsFeature: any;
  featureId: any;
  pageName: any;
  pageDescription: any;
  hasMinimumBalance: any;
  minimumBalance: any;
  superAdmin: boolean = false;
  canViewProfessionals: boolean = false;
  canCreateProfessional: boolean = false;
  canManageProfessional: boolean = false;
  allProfessionals: any = [];
  professionals: any = [];
  hasVoiceCall: boolean = false;
  hasVideoCall: boolean = false;
  hasChat: boolean = false;
  company: any;
  showConfirmationModal: boolean = false;
  selectedItem: any;
  toastTitle: string = "";
  toastDescription: string = "";
  acceptText: string = "";
  cancelText: string = "";
  showRequiredMinimumBalanceModal: boolean = false;
  actionMode: string = "";
  callTime: number = 0;
  callTrackingInterval;
  callGuid: any;
  callPasscode: any;
  room: any;
  userPhone: any;
  @ViewChild("modalbutton2", { static: false }) modalbutton2:
    | ElementRef
    | undefined;
  @ViewChild("closemodalbutton2", { static: false }) closemodalbutton2:
    | ElementRef
    | undefined;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    public _professionalsService: ProfessionalsService,
    public _voiceCallService: VoiceCallService,
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
      this.company = company[0];
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
    this.getProfessionals();
    this.subscribeVoiceCall();
  }

  getProfessionals() {
    this._professionalsService
      .getProfessionalsData(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          if(this.user) { this.user['available_balance'] = this.userId > 0 ? data?.user?.available_balance : 0; }

          let payment_methods = data?.payment_methods || '';
          this._localService.setLocalStorage(environment.lspaymentmethods, payment_methods);

          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data?.settings);

          this.mapUserPermissions(data?.user_permissions);

          let professionals = data?.professionals;
          this.allProfessionals = professionals;
          this.formatProfessionals(professionals);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.professionalsFeature = features?.find((f) => f.feature_id == 23);
    this.featureId = this.professionalsFeature?.id;
    this.pageName = this.getFeatureTitle(this.professionalsFeature);
    this.pageDescription = this.getFeatureDescription(this.professionalsFeature);
  }

  mapSubfeatures(settings) {
    let subfeatures = settings?.subfeatures;
    if(subfeatures?.length > 0) {
      this.hasVoiceCall = this.userId && subfeatures.some(a => a.name_en == 'Call feature' && a.active == 1);
      this.hasVideoCall = this.userId && subfeatures.some(a => a.name_en == 'Video call feature' && a.active == 1);
      this.hasChat = this.userId && subfeatures.some(a => a.name_en == 'Chat feature' && a.active == 1);
      this.hasMinimumBalance = subfeatures?.some((a) => a.name_en == "Minimum balance" && a.active == 1);
    }

    if(this.hasMinimumBalance) {
      this.minimumBalance = settings?.professional_settings?.minimum_balance;
    }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canViewProfessionals = user_permissions?.member_type_permissions?.find(
      (f) => f.view == 1 && f.feature_id == 23
    )
      ? true
      : false;
    this.canCreateProfessional =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find((f) => f.create == 1 && f.feature_id == 25);
    this.canManageProfessional = user_permissions?.member_type_permissions?.find(
      (f) => f.manage == 1 && f.feature_id == 23
      )
      ? true
      : false;
  }

  formatProfessionals(professionals) {
    professionals = professionals?.map((item) => {
      return {
        ...item,
        id: item?.id,
        path: `/professionals/details/${item.id}`,
        image: `${environment.api}/${item.image}`,
        name: item?.first_name ? `${item.first_name} ${item.last_name}` : item.name,
      };
    });

    this.professionals = professionals;
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
        : this.language == "it"
        ? feature.name_it ||
          feature.feature_name_IT ||
          feature.name_es ||
          feature.feature_name_ES
        : feature.name_es || feature.feature_name_ES
      : "";
  }

  getFeatureDescription(feature) {
    return feature
      ? this.language == "en"
        ? feature.description_en || feature.description_es
        : this.language == "fr"
        ? feature.description_fr || feature.description_es
        : this.language == "eu"
        ? feature.description_eu || feature.description_es
        : this.language == "ca"
        ? feature.description_ca || feature.description_es
        : this.language == "de"
        ? feature.description_de || feature.description_es
        : this.language == "it"
        ? feature.description_it || feature.description_es
        : feature.description_es
      : "";
  }

  subscribeVoiceCall() {
    this.pusherSubscription = this._voiceCallService
      .getFeedItems()
      .subscribe(async(response) => {
        if(response?.id == this.userId || response?.channel == this.userId) {
          this.pusherData = response;
          if(this.pusherData.call_guid) {
            this.callGuid = this.pusherData.call_guid;
            this.callPasscode = this.pusherData.passcode;
          }

          this.toastMessage = response.message || `${this._translateService.instant('professionals.incomingcall')}...`;
          this.toastMode = response.mode;

          if(this.toastMode == 'end-call') {
            await this._voiceCallService.leaveCall();
            this.showToast = false;
          } else if(this.toastMode == 'ongoing-call') {
            this.startTimer();
            this.startTrackingCallDuration();
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

  startTrackingCallDuration() {
    this.callTrackingInterval = setInterval(() => {
        if (this.callTime === 0) {
            this.callTime++;
        } else {
            this.callTime++;
        }

        this._voiceCallService.getStats();
        let stats = this._voiceCallService.rtcStats?.Duration || 0;

        if(stats > 0) {
          let params = {
            call_guid: this.callGuid,
            stats,
            professional_user_id: this.professional?.user_id,
            caller_user_id: this.userId,
            room: this.room,
          }
          
          this._professionalsService.editCallerBalance(params).subscribe(
          (response) => {
            let user = response?.user;
            if(user?.id == this.userId) {
              if(this.user) {
                this.user['available_balance'] = user?.available_balance;
              }
            }
          },
          (error) => {
            console.log(error);
          })
        }
    }, 5000);
  }

  pauseTimer() {
    clearInterval(this.interval);
    clearInterval(this.callTrackingInterval);
  }

  async handleStartCall(id) {
    if(this.userId > 0) {
      this.actionMode = 'voicecall';
      this.userPhone = this.user?.phone;
      if(!this.userPhone) {
        let user = get(
          await this._userService.getUserById(this.user?.id).toPromise(),
          "CompanyUser"
        );
        this.user['phone'] = user?.phone;
        this.userPhone = user?.phone;
      }
      this.professional = this.professionals.find((c) => c.user_id == id);
      this.modalbutton2?.nativeElement?.click();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  async proceedToCall() {
    this.closemodalbutton2?.nativeElement?.click();

    setTimeout(async () => {
      let id = this.professional.user_id;
      if(this.hasRequiredMinimumBalance()) {
        this.display = '';
        this.selectedId = id;

        const channel =  `agora-vcp-${id}`;
        this.room = channel;
        let caller_uid = Math.floor(Math.random() * 2032);

        let caller_balance_before_call = 0;
        if(this.userId > 0) {
          caller_balance_before_call = this.user?.available_balance;
        }

        let call_guid = Math.random().toString(36).substring(6);
        let passcode = Math.random().toString(36).substring(6);

        setTimeout(() => {
          initFlowbite();
          this.toastMessage = `${this._translateService.instant('professionals.dialling')}...`;
          this.toastMode = 'initiate-call';
          this.showToast = true;
          let params = {
            id,
            user_id: this.userId,
            company_id: this.companyId,
            mode: 'accept-call',
            message: this._translateService.instant('professionals.incomingcall'),
            caller_name: this.user?.first_name ? `${this.user.first_name} ${this.user.last_name}` : this.user.name,
            caller_image: `${environment.api}/${this.user?.image}`,
            phone: this.userPhone,
            room: channel,
            caller_uid,
            caller_balance_before_call,
            call_guid,
            passcode,
          }
          this.notifyProfessional(params);
        }, 100);

        const token = get(await this._voiceCallService.generateRTCToken(channel, 'publisher', 'uid', this.userId).toPromise(), 'rtcToken');
        this._voiceCallService.createRTCClient();
        this._voiceCallService.agoraServerEvents(this._voiceCallService.rtc);
        await this._voiceCallService.localUser(channel, token, caller_uid, 'initiate-call');
      }
    }, 500)
  }

  validatePhoneForE164() {
    const phoneNumber = this.userPhone || this.user?.phone;
    const regEx = /^\+[1-9]\d{10,14}$/;
    return regEx.test(phoneNumber);
  };

  hasRequiredMinimumBalance() {
    let valid = true;

    let requiredMinimumBalance = this.minimumBalance > 0 ? (this.professional?.rate * this.minimumBalance) : 0;
    if(!(this.minimumBalance > 0 && this.user?.available_balance >= (requiredMinimumBalance))) {
      valid = false;
      this.showRequiredMinimumBalanceMessage();
    }

    return valid;
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
    await this._voiceCallService.leaveCall();
    
    let stats = this._voiceCallService.rtcStats;

    let timezoneOffset = new Date().getTimezoneOffset();
    let offset = moment().format('Z');
    let params = {
      id: this.professional?.user_id,
      user_id: this.userId,
      company_id: this.companyId,
      mode: 'end-call',
      channel: this.userId,
      room: `agora-vcp-${this.professional?.user_id}`,
      duration: stats?.Duration || 0,
      timezone: timezoneOffset,
      offset,
      user_mode: 'caller',
    }
    this.notifyProfessional(params);

    this.showToast = false;
  }

  async handleStartChat(id) {
    if(this.userId > 0) {
      this.actionMode = 'chat';
      this.professional = this.professionals.find((c) => c.user_id == id);
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  async handleStartVideoCall(id) {
    localStorage.removeItem('joined-video-channel');
    this.selectedId = id;
    if(this.userId > 0) {
      this.actionMode = 'videocall';
      this.professional = this.professionals?.find((c) => c.user_id == this.selectedId);

      if(this.hasRequiredMinimumBalance()) {
        this.display = '';

        const channel =  `agora-vcp-video-${this.selectedId}-${this.userId}`;
        this.room = channel;
        let caller_uid = Math.floor(Math.random() * 2032);

        let caller_balance_before_call = 0;
        if(this.userId > 0) {
          caller_balance_before_call = this.user?.available_balance;
        }

        let video_call_guid = Math.random().toString(36).substring(6);
        let video_call_passcode = Math.random().toString(36).substring(6);
        const token = get(await this._voiceCallService.generateRTCToken(channel, 'publisher', 'uid', this.userId).toPromise(), 'rtcToken');

        let params = {
          id,
          user_id: this.userId,
          company_id: this.companyId,
          mode: 'accept-video-call',
          message: this._translateService.instant('professionals.incomingvideocall'),
          caller_name: this.user?.first_name ? `${this.user.first_name} ${this.user.last_name}` : this.user.name,
          caller_image: `${environment.api}/${this.user?.image}`,
          room: channel,
          caller_uid,
          caller_balance_before_call,
          video_call_guid,
          video_call_passcode,
          token,
        }
        this.notifyVideoCallProfessional(params);

        setTimeout(() => {
          let url = `/call/video/${video_call_guid}/${video_call_passcode}/caller`;
          this._router.navigate([url])
          .then(() => {
            window.location.reload();
          });
        }, 500)
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  showRequiredMinimumBalanceMessage() {
    let minimumAmount = parseFloat((this.professional?.rate * this.minimumBalance)?.toString()).toFixed(2);
    let amountInText =  `(${this.professional?.rate_currency} ${minimumAmount})`;
    let actionModeText = this._translateService.instant(`professionals.${this.actionMode}`);
    this.showRequiredMinimumBalanceModal = false;
    this.toastTitle = this._translateService.instant('professionals.insufficientbalance');
    this.toastDescription = `${this._translateService.instant("professionals.minimumbalanceof")} ${this.minimumBalance?.toString()?.replace('.00', '')} ${this._translateService.instant('timeunits.minutes')} ${amountInText} ${this._translateService.instant('professionals.requiredtostart')} ${actionModeText} ${this._translateService.instant('professionals.with')} ${this.professional?.name}`;
    this.acceptText = "OK";
    setTimeout(() => (this.showRequiredMinimumBalanceModal = true));
  }

  confirm() {
    this.showRequiredMinimumBalanceModal = false;
  }

  notifyVideoCallProfessional(params) {
    this._professionalsService.notifyVideoCallProfessional(params).subscribe(
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
    this.pauseTimer();
    this.languageChangeSubscription?.unsubscribe();
    this.pusherSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}