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
  selector: "app-astro-ideal-price-per-service",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    StarRatingModule,
  ],
  templateUrl: "./price-per-service.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricePerServiceComponent {
  private destroy$ = new Subject<void>();

  @Input() title: any;
  @Input() buttonColor: any;
  @Input() voiceCall: any;
  @Input() videoCall: any;
  @Input() chat: any;
  @Input() voiceCallRate: any;
  @Input() videoCallRate: any;
  @Input() chatRate: any;
  @Output() onPricePerServiceSaved = new EventEmitter();

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

  savePricingRate() {
    let rates = {
      rate: this.voiceCallRate,
      video_call_rate: this.videoCallRate,
      chat_rate: this.chatRate
    }
    this.onPricePerServiceSaved.emit(rates);
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}