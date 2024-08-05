import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StarRatingModule } from 'angular-star-rating';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { LocalService } from "@share/services";
import { environment } from "@env/environment";

@Component({
  selector: "app-astro-ideal-contact-methods",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    StarRatingModule,
  ],
  templateUrl: "./contact-methods.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactMethodsComponent {
  private destroy$ = new Subject<void>();

  @Input() buttonColor: any;
  @Input() voiceCall: any;
  @Input() videoCall: any;
  @Input() chat: any;
  @Output() onStatusChange = new EventEmitter();

  languageChangeSubscription;
  language: any;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
  ) { 
    
  }
  
  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

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

  }

  handleChangeStatus(status, mode) {
    switch(mode) {
      case 'chat':
        this.chat = status;
        break;
      case 'video_call':
        this.videoCall = status;
        break;
      case 'voice_call':
        this.voiceCall = status;
        break;
    }

    let event = { status, mode }
    this.onStatusChange.emit(event);
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}