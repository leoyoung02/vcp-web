import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { LocalService } from "@share/services";
import { environment } from "@env/environment";

@Component({
  selector: "app-astro-ideal-specialties",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
  templateUrl: "./specialties.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialtiesComponent {
  private destroy$ = new Subject<void>();

  @Input() specialties: any;
  @Input() buttonColor: any;

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