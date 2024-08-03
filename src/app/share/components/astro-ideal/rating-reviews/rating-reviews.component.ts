import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
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
  selector: "app-astro-ideal-rating-reviews",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    StarRatingModule,
  ],
  templateUrl: "./rating-reviews.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingReviewsComponent {
  private destroy$ = new Subject<void>();

  @Input() title: any;
  @Input() rating: any;
  @Input() reviews: any;

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