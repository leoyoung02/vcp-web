import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  ViewChild,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { CompanyService, LocalService } from "@share/services";
import { RemoteStreamComponent } from "@share/components/video-call/remote-stream/remote-stream.component";
import { LocalStreamComponent } from "@share/components/video-call/local-stream/local-stream.component";
import { environment } from "@env/environment";
import { MediaControlsComponent } from "@share/components/video-call/media-controls/media-controls.component";

@Component({
  selector: "app-video-call-room",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    RemoteStreamComponent,
    LocalStreamComponent,
    MediaControlsComponent,
  ],
  templateUrl: "./video-call.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCallRoomComponent {
  private destroy$ = new Subject<void>();

  @Input() isLoading: any;
  @Input() buttonColor: any;
  @Input() statusText: any;
  @Input() name: any;
  @Input() image: any;
  @Input() showActions: any;
  @Input() micMuted: any;
  @Output() toggleMic = new EventEmitter();
  @Output() endCall = new EventEmitter();
  @Output() joinChannel = new EventEmitter();

  languageChangeSubscription;
  language: any;

  isLocalStreamVisible = false;
  isRemoteStreamVisible = false;

  @ViewChild('remoteStreamsContainer') remoteStreamsComponent!: RemoteStreamComponent;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private cd: ChangeDetectorRef
  ) {

  }

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializeData();
        }
      );

    this.initializeData();
  }

  initializeData() {
    this.isLocalStreamVisible = true;
    // this.joinChannel.emit();
  }

  handleToggleMic() {
    this.toggleMic.emit();
  }

  handleEndCall() {
    this.endCall.emit();
  }

  handleLeaveChannel() {
    this.isLocalStreamVisible = false;
    this.remoteStreamsComponent.clearRemoteUsers();
    this.showActions = false;
  }

  goHome() {
    location.href = '/';
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}