import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService, LocalService } from '@share/services';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { EditorModule } from "@tinymce/tinymce-angular";
import { environment } from '@env/environment';
import { BuddyService } from '@features/services';
import { initFlowbite } from "flowbite";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FilterComponent, PageTitleComponent } from '@share/components';
import { SearchComponent } from '@share/components/search/search.component';
import { MentorCardComponent } from '@share/components/card/mentor/mentor.component';
import {
    ImageCropperModule,
    ImageCroppedEvent,
    ImageTransform,
    base64ToFile,
  } from "ngx-image-cropper";
  import {
    faRotateLeft,
    faRotateRight,
    faEye,
    faEyeSlash,
  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import get from 'lodash/get';

@Component({
    selector: 'app-mentor-profile',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        NgOptimizedImage,
        FormsModule,
        ReactiveFormsModule,
        EditorModule,
        MatSnackBarModule,
        ImageCropperModule,
        FontAwesomeModule,
        PageTitleComponent,
        SearchComponent,
        FilterComponent,
        MentorCardComponent,
    ],
    templateUrl: './mentor-profile.component.html'
})
export class MentorProfileComponent {
    private destroy$ = new Subject<void>();

    @Input() id: any;

    languageChangeSubscription;
    user: any;
    email: any;
    language: any;
    companyId: any = 0;
    companies: any;
    domain: any;
    pageTitle: any;
    features: any;

    primaryColor: any;
    buttonColor: any;
    hoverColor: any;
    userId: any;
    subfeatures: any;
    superAdmin: boolean = false;
    pageName: any;
    pageDescription: any;
    showSectionTitleDivider: boolean = false;
    isMobile: boolean = false;
    buddyFeature: any;
    featureId: any;
    searchText: any;
    placeholderText: any;
    search: any;
    p: any;
    mentors: any = [];
    allMentors: any = [];
    list: any[] = [];
    buttonList: any;
    cities: any = [];
    selectedCity: any = '';
    defaultActiveFilter: boolean = false;
    filterActive: boolean = false;
    filterSettings: any = [];
    showFilters: boolean = false;
    filterTypeControl: any = '';
    majors: any = [];
    years: any = [];
    selectedMajor: any = '';
    currentPage: number = 1;
    pageSize: number = 8;

    profileForm: any;
    hasImage: boolean = false;
    myImage: any;
    me: any;
    mentor: any;
    
    imageSrc: string = environment.api + "/";
    rotateLeftIcon = faRotateLeft;
    rotateRightIcon = faRotateRight;
    @ViewChild("modalbutton", { static: false })
    modalbutton: ElementRef<HTMLInputElement> = {} as ElementRef;
    // Cropper
    showImageCropper: boolean = false;
    imageChangedEvent: any;
    croppedImage: any;
    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    transform: ImageTransform = {};
    file: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _buddyService: BuddyService,
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
    ) { }

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    async ngOnInit() {
        this.onResize();
        initFlowbite();

        this.email = this._localService.getLocalStorage(environment.lsemail);
        this.userId = this._localService.getLocalStorage(environment.lsuserId);
        this.companyId = this._localService.getLocalStorage(
            environment.lscompanyId
        );
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");
        this.companies = this._localService.getLocalStorage(environment.lscompanies)
            ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
            : "";
        if (!this.companies) {
            this.companies = get(
                await this._companyService.getCompanies().toPromise(),
                "companies"
            );
        }
        let company = this._companyService.getCompany(this.companies);
        if (company && company[0]) {
            this.domain = company[0].domain;
            this.companyId = company[0].id;
            this.primaryColor = company[0].primary_color;
            this.buttonColor = company[0].button_color
                ? company[0].button_color
                : company[0].primary_color;
            this.hoverColor = company[0].hover_color
                ? company[0].hover_color
                : company[0].primary_color;
            this.showSectionTitleDivider = company[0].show_section_title_divider;
            this._localService.setLocalStorage(
                environment.lscompanyId,
                this.companyId
            );
        }

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
        this.pageTitle = this._translateService.instant("sidebar.profilesettings");
        this.profileForm = this.fb.group({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            major: new FormControl('', [Validators.required]),
            introduction: new FormControl('', [Validators.required]),
            interests: new FormControl('', [Validators.required]),
            personality: new FormControl('', [Validators.required]),
            location: new FormControl('', [Validators.required]),
            language: new FormControl('', [Validators.required])
        })

        this.loadProfileData();
    }

    loadProfileData() {
        this._buddyService
          .fetchMentor(this.id, this.userId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (data) => {
                this.initializeProfile(data);
            },
            (error) => {
              console.log(error);
            }
        );
    }

    initializeProfile(data) {
        this.me = data?.user;
        this.mentor = data?.mentor;
        this.myImage =  `${environment.api}/${this.me.image}`;
        this.hasImage = true

        if(this.me) {
            this.profileForm.get('first_name').setValue(this.me.first_name);
            this.profileForm.get('last_name').setValue(this.me.last_name);
        }

        if(this.mentor) {
            this.profileForm.get('major').setValue(this.mentor.major);
            this.profileForm.get('introduction').setValue(this.mentor.introduction);
            this.profileForm.get('interests').setValue(this.mentor.interests);
            this.profileForm.get('personality').setValue(this.mentor.personality);
            this.profileForm.get('location').setValue(this.mentor.location);
            this.profileForm.get('language').setValue(this.mentor.language);
        }
    }

    getMenteeName(mentee) {
        return mentee.first_name ? `${mentee.first_name} ${mentee.last_name}` : mentee.name;
    }

    getMenteeImage(mentee) {
        let image = '';
        let menteeImage = mentee.image;
        if(menteeImage == 'default-avatar.jpg' || menteeImage == 'empty_avatar.png') {
            image = './assets/images/default-profile.png';
        } else {
            image = `${environment.api}/${menteeImage}`
        }
    
        return image
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
            this.imageSrc = this.croppedImage = event.base64;
            this.file = {
              name: "image",
              image: base64ToFile(event.base64), //event.file
            };
            this.hasImage = true;
            this.myImage = this.imageSrc;
        }
      }
    
    imageLoaded() {}
    
    cropperReady() {
        // cropper ready
    }
    
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

    public getTimestamp() {
        const date = new Date();
        const timestamp = date.getTime();
    
        return timestamp;
    }

    async save() {
        if(this.isValidForm()) {
            let image = '';
            if(this.file) {
                const mentorForm = new FormData();

                let image_filename
                const filename = 'profile_' + this.me.id + '_' + this.getTimestamp();
                mentorForm.append('image_file', filename + '.jpg');
                mentorForm.append('image', this.file.image, filename + '.jpg');
                image_filename = filename + '.jpg'

                this._buddyService.uploadMentorPhoto(mentorForm).subscribe(
                    res => {
                        image = image_filename;
                        this.saveChanges(image);
                    },
                    error => {
                        console.log(error)
                        this.open(this._translateService.instant('dialog.error'), '')
                })
            } else {
                this.saveChanges(image);
            }
        } else {
            this.open(this._translateService.instant('wall.requiredfields'), '')
        }
    }

    saveChanges(image) {
        const major: any = document.getElementById('major')
            
        let params
        if(image) {
            params = {
                user_id: this.id,
                company_id: this.companyId,
                major: this.profileForm.get('major').value ? this.profileForm.get('major').value : major.value,
                introduction: this.profileForm.get('introduction').value,
                interests: this.profileForm.get('interests').value,
                personality: this.profileForm.get('personality').value,
                location: this.profileForm.get('location').value,
                language: this.profileForm.get('language').value,
                image: image,
                }
        } else {
            params = {
                user_id: this.id,
                company_id: this.companyId,
                major: this.profileForm.get('major').value ? this.profileForm.get('major').value : major.value,
                introduction: this.profileForm.get('introduction').value,
                interests: this.profileForm.get('interests').value,
                personality: this.profileForm.get('personality').value,
                location: this.profileForm.get('location').value,
                language: this.profileForm.get('language').value,
            }
        }

        this._buddyService.updateMentorProfile(params).subscribe(
            res => {
                this.file = '';
                this.open(this._translateService.instant('dialog.savedsuccessfully'), '')
            },
            error => {
                console.log(error)
                this.open(this._translateService.instant('dialog.error'), '')
        })
    }

    isValidForm() {
        let valid = true;
        Object.keys(this.profileForm.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.profileForm.get(key).errors;
          if (controlErrors == null) {
            valid = true;
          } else {
            if (controlErrors != null) {
              valid = false;
            }
          }
        });
        return valid;
    }

    viewPublicProfile() {
        this._router.navigate([`/buddy/mentor/${this.id}`]);
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