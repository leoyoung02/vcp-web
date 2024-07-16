import { CommonModule } from '@angular/common';
import { 
    ChangeDetectionStrategy,
    ChangeDetectorRef, 
    Component, 
    HostListener,
    Input
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService, LocalService } from '@share/services';
import { ProfessionalsService, VideoCallService } from '@features/services';
import { VideoCallRoomComponent } from '@share/components/rooms/video-call/video-call.component';
import { Subject } from 'rxjs';
import { timer } from "@lib/utils/timer/timer.utils";
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';
import moment from "moment";
import get from "lodash/get";

@Component({
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        TranslateModule, 
        RouterModule,
        VideoCallRoomComponent,
    ],
    templateUrl: './video-call.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCallComponent {
    private destroy$ = new Subject<void>();

    @Input() guid: any;
    @Input() code: any;
    
    languageChangeSubscription;
    language: any;
    companyId: any;
    companies: any;
    primaryColor: any;
    buttonColor: any;
    isMobile: boolean = false;

    statusText: any;
    name: any;
    image: any;
    micMuted: boolean = true;
    showActions: boolean = false;
    requirePasscode: boolean = true;
    invalidPasscode: boolean = false;
    personalData: any = [];

    time: number = 0;
    interval;
    existingCallLog: any;
    room: any;
    recipientUid: any;
    caller: any;
    callTime: number = 0;
    callTrackingInterval;
    pusherSubscription: Subscription | undefined;
    pusherData: any = {};
    isLoading; boolean = true;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _videoCallService: VideoCallService,
        private _professionalsService: ProfessionalsService,
        private cd: ChangeDetectorRef
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

        this.initializePage();
    }

    initializePage() {
        this.getVideoCallDetails;
    }

    getVideoCallDetails() {
        let params = {
            company_id: this.companyId,
            video_call_guid: this.guid,
            video_call_passcode: this.code,
        }

        this._professionalsService.validateVideoCallPasscode(params).subscribe(
            (response) => {
                this.isLoading = false;
                if(response?.existing_video_call_log?.id > 0) {
                    this.requirePasscode = false;
                    this.initializeData(response);
                } else {
                    this.invalidPasscode = true;
                }
                this.cd.detectChanges();
            },
            (error) => {
              console.log(error);
            })
    }

    initializeData(response: any) {
        if(!this.requirePasscode && response) {
            this.statusText =  this._translateService.instant('professionals.connecing');
            this.existingCallLog = response.existing_call_log;
            let user = response.user;
            this.name = user.name;
            this.image = user.image;
            let caller = {
                birthday: user.birthday,
                gender: user.gender,
                civil_status: user.civil_status,
                position: user.position,
                city: user.city,
                country: user.country,
                phone: user.phone,
            }
            this.caller = caller;
            this.personalData = [
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
    }

    handleToggleMic() {
    
    }

    handleEndCall() {

    }

    handleJoinChannel() {
        // this._videoCallService.joinChannel(
        //     'vcp-voice-call-test', 
        //     '007eJxTYGC6KhO0ufbHn3s2Is4hsf/0244t4c9fsHof65xTdid41F4oMBgZmiUnWRpZmKWZJ5mkGFskphkZpRmZJCWaJpmmGqSY+N+bktYQyMjAonWdiZEBAkF8YYay5ALdsvzM5FTd5MScHN2S1OISBgYAYv8lEg==',
        //     '123'
        // );
    }

    goHome() {
        this._router.navigate(['/'])
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}