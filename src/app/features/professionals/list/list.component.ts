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
import { CompanyService, LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "@env/environment";
import { PageTitleComponent } from "@share/components";
import { ProfessionalsService } from "@features/services/professionals/professionals.service";
import { Subscription } from 'rxjs';
import { initFlowbite } from "flowbite";
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
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
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
    this.subscribeVoiceCall();
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
          } else {
            this.showToast = true;
          }
        }
      })
  }

  handleStartCall(id, phone_number) {
    this.selectedId = id;
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
        phone: phone_number,
      }
      this.notifyProfessional(params);
    }, 100);
  }

  notifyProfessional(params) {
    this._professionalsService.notifyProfessional(params).subscribe(
      (response) => {
        
      },
      (error) => {
        console.log(error);
      })
  }

  acceptCall() {
    this.toastMessage = 'Ongoing call...';
    this.toastMode = 'ongoing-call';
    let params = {
      id: this.selectedId,
      user_id: this.userId,
      company_id: this.companyId,
      mode: this.toastMode,
      message: this.toastMessage,
      channel: this.pusherData.user_id
    }
    this.notifyProfessional(params);

    this.startCall(this.pusherData.user_id, this.pusherData.phone);
  }

  async cancelCall() {
    await this._professionalsService.leaveCall();
    let params = {
      id: this.selectedId,
      user_id: this.userId,
      company_id: this.companyId,
      mode: 'end-call',
      channel: this.pusherData.user_id,
    }
    this.notifyProfessional(params);
    this.showToast = false;
  }

  async startCall(id, phone_number) {
    const channel =  `agora-vcp-${id}`
    const token = get(await this._professionalsService.generateRTCToken(channel, 'publisher', 'uid', this.userId).toPromise(), 'rtcToken')
    this._professionalsService.createRTCClient();
    this._professionalsService.agoraServerEvents(this._professionalsService.rtc);

    await this._professionalsService.localUser(channel, token, this.userId);

    this.handleOutboundPSTN(id, phone_number, channel, token);
  }

  handleOutboundPSTN(uid, phone_number, channel, token) {
    let params = {
      company_id: this.companyId,
      uid,
      channel,
      to: phone_number,
      token,
    }

    this._professionalsService.voiceCall(params).subscribe(
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
    this.pusherSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}