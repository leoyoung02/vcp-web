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
import { VgApiService, VgCoreModule } from "@videogular/ngx-videogular/core";
import { VgControlsModule } from "@videogular/ngx-videogular/controls";
import { VgOverlayPlayModule } from "@videogular/ngx-videogular/overlay-play";
import { VgBufferingModule } from "@videogular/ngx-videogular/buffering";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from "@env/environment";

@Component({
  selector: "app-video-player",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: "./video-player.component.html",
})
export class VideoPlayerComponent {
  private destroy$ = new Subject<void>();

  preload: string = 'auto';
  api: VgApiService = new VgApiService;

  languageChangeSubscription;
  language: any;
  isMobile: boolean = false;
  
  source: SafeUrl | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private sanitizer: DomSanitizer,
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );

    this.initializePage();
  }

   //Retrieve the video (Careful of CORS)
   setVideoSourceToObjectUrl = (url: string) => fetch(url)
   .then(response => response.blob()) //Encode the response as a blob
   .then(blob =>  {
       // Create an object url from the blob;
       var blobUrl = URL.createObjectURL(blob)
       
       // Create a safe url and set it to the video source.
       setTimeout(() => {
        this.source = this.sanitizer?.bypassSecurityTrustUrl(blobUrl);
        console.log('source')
        console.log(this.source)
      }, 2000)
   });

  initializePage() {
    var url = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/6c/Polar_orbit.ogv/Polar_orbit.ogv.360p.vp9.webm';
    this.setVideoSourceToObjectUrl(url);
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;

    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
  }

  playVideo() {
    this.api.play();
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