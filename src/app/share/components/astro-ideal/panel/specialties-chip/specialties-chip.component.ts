import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { Subject } from "rxjs";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { LocalService } from "@share/services";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";

@Component({
  selector: "app-astro-ideal-specialties-chip",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: "./specialties-chip.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialtiesChipComponent {
  private destroy$ = new Subject<void>();

  @Input() buttonColor: any;
  @Input() subcategories: any;
  @Input() selectedSubcategories: any;
  @Output() onSpecialtiesChange = new EventEmitter();

  languageChangeSubscription;
  language: any;
  dropdownSettings: any;

  @ViewChild("modalbutton2", { static: false }) modalbutton2:
    | ElementRef
    | undefined;
  @ViewChild("closemodalbutton2", { static: false }) closemodalbutton2:
    | ElementRef
    | undefined;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
  ) { 
    
  }

  ngOnChanges(changes: SimpleChange) {
    let specialtiesChange = changes['specialties'];
    if (specialtiesChange?.currentValue?.length > 0) {
      this.selectedSubcategories = specialtiesChange.currentValue;
    }
  }
  
  async ngOnInit() {
    initFlowbite();
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
    this.dropdownSettings = {
        singleSelection: false,
        idField: "id",
        textField:
          this.language == "en"
            ? "subcategory_en"
            : this.language == "fr"
            ? "subcategory_fr"
            : this.language == "eu"
            ? "subcategory_eu"
            : this.language == "ca"
            ? "subcategory_ca"
            : this.language == "de"
            ? "subcategory_de"
            : "subcategory_es",
        selectAllText: this._translateService.instant("dialog.selectall"),
        unSelectAllText: this._translateService.instant("dialog.clearall"),
        itemsShowLimit: 2,
        allowSearchFilter: true,
        searchPlaceholderText: this._translateService.instant('guests.search'),
        noDataAvailablePlaceholderText: this._translateService.instant('your-admin-area.nodata'),
    };
  }

  addSpecialty() {
    this.modalbutton2?.nativeElement?.click();
  }

  handleChangeCategory(event) {
    this.onSpecialtiesChange.emit(this.selectedSubcategories);
  }

  onDeSelectCategory(event) {
    if(event.id && this.selectedSubcategories?.length > 0) {
      this.selectedSubcategories = this.selectedSubcategories?.filter(sc => {
        return sc.id != event.id
      })
    }
    this.onSpecialtiesChange.emit(this.selectedSubcategories);
  }

  saveSelection() {
    this.closemodalbutton2?.nativeElement?.click();
  }

  getSubcategoryText(subcategory) {
    return subcategory
      ? this.language == "en"
        ? subcategory.subcategory_en ||
          subcategory.subcategory_es
        : this.language == "fr"
        ? subcategory.subcategory_fr ||
          subcategory.subcategory_es
        : this.language == "eu"
        ? subcategory.subcategory_eu ||
          subcategory.subcategory_es
        : this.language == "ca"
        ? subcategory.subcategory_ca ||
          subcategory.subcategory_es
        : this.language == "de"
        ? subcategory.subcategory_de ||
          subcategory.subcategory_es
        : this.language == "it"
        ? subcategory.subcategory_it ||
          subcategory.subcategory_es
        : subcategory.subcategory_es
      : "";
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}