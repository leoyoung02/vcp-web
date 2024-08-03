import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
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

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}