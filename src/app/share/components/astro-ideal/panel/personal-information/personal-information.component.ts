import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { StarRatingModule } from 'angular-star-rating';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import {
  ImageCropperModule,
  ImageCroppedEvent,
  ImageTransform,
  base64ToFile,
} from "ngx-image-cropper";
import {
  faRotateLeft,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { RatingReviewsComponent } from "../../rating-reviews/rating-reviews.component";
import { SpecialtiesComponent } from "../specialties/specialties.component";
import { ContactMethodsComponent } from "../contact-methods/contact-methods.component";
import { SpecialtiesChipComponent } from "../specialties-chip/specialties-chip.component";
import { DatePickerComponent } from "@share/components/date-picker/date-picker.component";
import { LocalService } from "@share/services";
import { ProfessionalsService } from "@features/services";
import { Subject } from "rxjs";
import { initFlowbite } from "flowbite";
import { environment } from "@env/environment";
import get from "lodash/get";
import each from "lodash/each";
import keys from "lodash/keys";

@Component({
  selector: "app-astro-ideal-personal-information",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule,
    NgMultiSelectDropDownModule,
    ImageCropperModule,
    FontAwesomeModule,
    MatSnackBarModule,
    RatingReviewsComponent,
    SpecialtiesComponent,
    ContactMethodsComponent,
    SpecialtiesChipComponent,
    DatePickerComponent,
  ],
  templateUrl: "./personal-information.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInformationComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;
  @Input() profile: any;
  @Input() image: any;
  @Input() reviews: any;
  @Input() specialtyCategories: any;
  @Input() buttonColor: any;
  @Input() voiceCall: any;
  @Input() videoCall: any;
  @Input() chat: any;
  @Input() role: any;
  @Input() subcategories: any;
  @Input() gender: any;
  @Input() languages: any;
  @Input() specialties: any;
  @Output() onPersonalInformationSaved = new EventEmitter();

  languageChangeSubscription;
  language: any;
  profileForm: any;
  dropdownSettings: any;
  selectedLanguages: any;

  rotateLeftIcon = faRotateLeft;
  rotateRightIcon = faRotateRight;
  showImageCropper: boolean = false;
  imageChangedEvent: any;
  croppedImage: any;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  file: any;
  personalInformation: any = {};
  birthday: any;
  selectedSpecialties: any = [];

  @ViewChild("modalbutton", { static: false })
  modalbutton: ElementRef<HTMLInputElement> = {} as ElementRef;
  subcategoriesChanged: boolean = false;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _professionalsService: ProfessionalsService,
    private _snackBar: MatSnackBar,
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
    this.initializeProfileFields();
    this.initializeDropdown();
  }

  initializeProfileFields() {
    if(this.role == 'professional') {
      this.profileForm = new FormGroup({
        first_name: new FormControl("", [Validators.required]),
        last_name: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required]),
        birthday: new FormControl("", [Validators.required]),
        gender: new FormControl("", [Validators.required]),
        profession: new FormControl("", [Validators.required]),
        experience: new FormControl("", [Validators.required]),
      });
    } else {
      this.profileForm = new FormGroup({
        first_name: new FormControl("", [Validators.required]),
        last_name: new FormControl("", [Validators.required]),
        email: new FormControl("", [Validators.required]),
        birthday: new FormControl("", [Validators.required]),
        gender: new FormControl("", [Validators.required]),
      });
    }

    if(this.profile) {
      each(keys(this.profile), (key) => {
        if (this.profileForm) {
          if (this.profileForm.get(key)) {
            let value = get(this.profile, key);
            this.profileForm?.get(key)?.setValue(value);
          }
        }
      });
    }
  }

  initializeDropdown() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: this._translateService.instant("dialog.selectall"),
      unSelectAllText: this._translateService.instant("dialog.clearall"),
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: this._translateService.instant('guests.search'),
      noDataAvailablePlaceholderText: this._translateService.instant('your-admin-area.nodata'),
    };

    if(this.profile?.language) {
      let language_arr = this.profile.language?.split(',');
      this.selectedLanguages = language_arr?.map((language) => {
        let lang = this.languages?.find((l) => l.name?.toString()?.toLowerCase() == language?.trim()?.toString()?.toLowerCase());
        return {
          id: lang?.id,
          name: lang?.name,
        };
      });
    }
  }

  handleSelectedDate(event) {
    this.birthday = event;
  }

  handleChangeLanguage(event) {
    
  }

  onDeSelectLanguage(event) {
    if(event.id && this.selectedLanguages?.length > 0) {
      this.selectedLanguages = this.selectedLanguages?.filter(sc => {
        return sc.id != event.id
      })
    }
  }

  async uploadPhoto(event: any) {
    this.imageChangedEvent = event;
    const file = event.target.files[0];
    if (file.size > 2000000) {
    } else {
      initFlowbite();
      setTimeout(() => {
        this.modalbutton?.nativeElement.click();
      }, 500);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.image = this.croppedImage = event.base64;
      this.file = {
        name: "image",
        image: base64ToFile(event.base64),
      };
    }
  }

  imageLoaded() {}
  cropperReady() {}
  loadImageFailed() {}

  imageCropperModalSave() {
    this.showImageCropper = false;
  }

  imageCropperModalClose() {
    this.showImageCropper = false;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  handleStatusChange(event) {
    switch(event.mode) {
      case 'chat':
        this.chat = event.status;
        break;
      case 'video_call':
        this.videoCall = event.status;
        break;
      case 'voice_call':
        this.voiceCall = event.status;
        break;
    }
  }

  handleSpecialtiesChange(event) {
    this.subcategoriesChanged = true;
    this.selectedSpecialties = event;
  }

  savePersonalInformation() {
    Object.assign(this.personalInformation, this.profileForm.value);

    let formData = new FormData();
    formData.append('id', this.id);
    formData.append('company_id', this.profile?.fk_company_id);
    formData.append('role', this.role);
    formData.append('first_name', this.personalInformation?.first_name);
    formData.append('last_name', this.personalInformation?.last_name);
    formData.append('email', this.personalInformation?.email);
    formData.append('gender', this.personalInformation?.gender);
    formData.append('profession', this.personalInformation?.profession);
    formData.append('experience', this.personalInformation?.experience);
    
    if(this.role == 'professional') { formData.append('professional_id', this.profile?.id); }
    if(this.birthday) { formData.append('birthday', this.birthday); }

    formData.append('language', (this.selectedLanguages?.length > 0 ? (this.selectedLanguages?.map((data) => { return data.name }).join(',')) : ''));
    formData.append('chat', (this.chat ? '1' : '0'));
    formData.append('video_call', (this.videoCall ? '1' : '0'));
    formData.append('voice_call', (this.voiceCall ? '1' : '0'));

    let specialty_ids = '';
    if(this.selectedSpecialties?.length > 0) {
      specialty_ids = this.selectedSpecialties?.map((data) => { return data.id }).join(',')
    } else {
      specialty_ids = this.specialties?.length > 0 ? this.specialties?.map((data) => { return data.id }).join(',') : ''
    }

    formData.append('subcategories', specialty_ids);
    
    if (this.file) {
      let user_id = this.role.professional ? this.profile?.user_id : this.id;
      const filename = 'professional_' + user_id + '_' + new Date()?.getTime();
      formData.append('destination', './uploads/profile_images/');
      formData.append('filepath', `./uploads/profile_images/${filename}.jpg`);
      formData.append('filenamewoextension', filename);
      formData.append('image', this.file.image, filename + '.jpg');
    }

    this._professionalsService
      .savePersonalInformation(formData)
      .subscribe(
        (response) => {
          this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          if(this.file) {
            location.reload();
          } else {
            this.onPersonalInformationSaved.emit();
          }
        },
        (error) => {
          this.open(
            this._translateService.instant("dialog.error"),
            ""
          );
        }
      );
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