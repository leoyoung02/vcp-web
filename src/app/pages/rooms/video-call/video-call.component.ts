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
import { environment } from '@env/environment';
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
    
    languageChangeSubscription;
    language: any;
    companyId: any;
    companies: any;
    primaryColor: any;
    buttonColor: any;
    isMobile: boolean = false;
    isLoading; boolean = true;

    statusText: any;
    name: any;
    image: any;
    micMuted: boolean = true;
    showActions: boolean = false;

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
        this.image = `${environment.api}/empty_avatar.png`;
        this.name = 'John Doe';
        this.showActions = true;
        this.isLoading = false;
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