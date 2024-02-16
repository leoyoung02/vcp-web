import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChange,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";
import { StarRatingComponent } from "@lib/components";

@Component({
  selector: "app-sections-masonry",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    StarRatingComponent
  ],
  templateUrl: "./sections-masonry.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionsMasonryComponent {
  private destroy$ = new Subject<void>();

  @Input() userId: any;
  @Input() superAdmin: any;
  @Input() company: any;
  @Input() list: any;
  @Input() isUESchoolOfLife: any;
  @Input() campus: any;

  languageChangeSubscription;
  language: any;
  buttonColor: any;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    initFlowbite();
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");
    this.buttonColor = this.company.button_color
      ? this.company.button_color
      : this.company.primary_color;

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.fetchData();
        }
      );

    this.fetchData();
  }

  fetchData() {

  }

  goToClubDetails(item) {
    if(this.userId > 0) {
      this._router.navigate([item.path]);
    } else {
      this._router.navigate(["/auth/login"]);
    }
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}