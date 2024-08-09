import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChange } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";
import { LocalService } from "@share/services";
import { ProfessionalsService } from "@features/services";
import { ButtonGroupComponent } from "@share/components/button-group/button-group.component";
import { Subject } from "rxjs";
import { initFlowbite } from "flowbite";
import { environment } from "@env/environment";
import get from "lodash/get";
import each from "lodash/each";
import keys from "lodash/keys";

@Component({
    selector: "app-astro-ideal-about-me",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonGroupComponent,
    ],
    templateUrl: "./about-me.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {
    private destroy$ = new Subject<void>();

    @Input() profile: any;
    @Input() supportedLanguages: any;
    @Input() buttonColor: any;
    @Output() onAboutMeSaved = new EventEmitter();

    languageChangeSubscription;
    language: any;
    aboutMeForm: any;
    selectedLanguage: any;
    currentCode: any;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _professionalsService: ProfessionalsService,
    ) {

    }

    ngOnChanges(changes: SimpleChange) {
        let profileChange = changes['profile'];
        if (profileChange?.currentValue?.id > 0) {
            this.profile = profileChange.currentValue;
            this.initializePage();
        }
    }

    async ngOnInit() {
        initFlowbite();
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");
        this.selectedLanguage = this.language;

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
        this.aboutMeForm = new FormGroup({
            profile_title_es: new FormControl(""),
            profile_title_en: new FormControl(""),
            profile_title_fr: new FormControl(""),
            profile_title_eu: new FormControl(""),
            profile_title_ca: new FormControl(""),
            profile_title_de: new FormControl(""),
            profile_title_it: new FormControl(""),
            description_es: new FormControl(""),
            description_en: new FormControl(""),
            description_fr: new FormControl(""),
            description_eu: new FormControl(""),
            description_ca: new FormControl(""),
            description_de: new FormControl(""),
            description_it: new FormControl(""),
        });

        if(this.profile) {
            each(keys(this.profile), (key) => {
                if (this.aboutMeForm) {
                    if (this.aboutMeForm.get(key) && 
                        (
                            key?.indexOf('profile_title_') >= 0 ||
                            key?.indexOf('description_') >= 0
                        )
                    ) {
                        let value = get(this.profile, key);
                        this.aboutMeForm?.get(key)?.setValue(value);
                    }
                }
            });
        }
    }

    handleChangeLanguageFilter(event) {
        this.supportedLanguages?.forEach((item) => {
            if (item.code == event.code) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });
    
        this.selectedLanguage = event.code;
    }

    saveAboutMe() {
        let params = {
            id: this.profile?.id,
            profile_title_es: this.aboutMeForm.get("profile_title_es")?.value || '',
            profile_title_en: this.aboutMeForm.get("profile_title_en")?.value || '',
            profile_title_fr: this.aboutMeForm.get("profile_title_fr")?.value || '',
            profile_title_eu: this.aboutMeForm.get("profile_title_eu")?.value || '',
            profile_title_ca: this.aboutMeForm.get("profile_title_ca")?.value || '',
            profile_title_de: this.aboutMeForm.get("profile_title_de")?.value || '',
            profile_title_it: this.aboutMeForm.get("profile_title_it")?.value || '',
            description_es: this.aboutMeForm.get("description_es")?.value || '',
            description_en: this.aboutMeForm.get("description_en")?.value || '',
            description_fr: this.aboutMeForm.get("description_fr")?.value || '',
            description_eu: this.aboutMeForm.get("description_eu")?.value || '',
            description_ca: this.aboutMeForm.get("description_ca")?.value || '',
            description_de: this.aboutMeForm.get("description_de")?.value || '',
            description_it: this.aboutMeForm.get("description_it")?.value || '',
        }

        this._professionalsService
        .editAboutMe(params)
        .subscribe(
            (response) => {
                this.onAboutMeSaved.emit('success');
            },
            (error) => {
                this.onAboutMeSaved.emit('error');
            }
        );
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}