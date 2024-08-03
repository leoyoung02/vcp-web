import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { StarRatingModule } from 'angular-star-rating';
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { LocalService } from "@share/services";
import { Subject } from "rxjs";
import { environment } from "@env/environment";
import { RatingReviewsComponent } from "../../rating-reviews/rating-reviews.component";
import { SpecialtiesComponent } from "../specialties/specialties.component";
import { ContactMethodsComponent } from "../contact-methods/contact-methods.component";

@Component({
  selector: "app-astro-ideal-personal-information",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    StarRatingModule,
    RatingReviewsComponent,
    SpecialtiesComponent,
    ContactMethodsComponent,
  ],
  templateUrl: "./personal-information.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInformationComponent {
  private destroy$ = new Subject<void>();

  @Input() profile: any;
  @Input() image: any;
  @Input() reviews: any;
  @Input() specialties: any;
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