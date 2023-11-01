import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { TestimonialsService } from "@features/services";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ButtonGroupComponent, NoAccessComponent, PageTitleComponent } from "@share/components";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  ImageCropperModule,
  ImageCroppedEvent,
  ImageTransform,
  base64ToFile,
} from "ngx-image-cropper";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Gallery, GalleryItem, ImageItem, VideoItem } from 'ng-gallery';
import { EditorModule } from "@tinymce/tinymce-angular";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import get from "lodash/get";

import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
registerPlugin(FilepondPluginImagePreview, FilepondPluginImageEdit, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

@Component({
  selector: "app-testimonials-edit",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgMultiSelectDropDownModule,
    EditorModule,
    ImageCropperModule,
    FontAwesomeModule,
    FilePondModule,
    ButtonGroupComponent,
    PageTitleComponent,
    NoAccessComponent,
  ],
  templateUrl: "./edit.component.html",
})
export class TestimonialEditComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;

  languageChangeSubscription: any;
  isMobile: boolean = false;
  language: any;
  companyId: number = 0;
  userId: number = 0;
  company: any;
  domain: any;
  primaryColor: any;
  buttonColor: any;
  companies: any;
  userRole: any;
  email: any;
  testimonialsFeature: any;
  featureId: any;
  pageName: any;
  superAdmin: boolean = false;
  canCreateTestimonial: any;
  languages: any = [];
  isLoading: boolean = true;
  selectedLanguage: string = "es";
  selectedLanguageChanged: boolean = false;
  showLanguageNote: boolean = true;
  buttonList: any = [];
  issaving: boolean = false;
  dropdownSettings: any;
  errorMessage: string = "";
  formSubmitted: boolean = false;
  testimonial: any;
  status: boolean = false;
  pageTitle: string = "";
  testimonialForm: FormGroup = new FormGroup({
    short_description: new FormControl("", [Validators.required]),
    description: new FormControl(""),
    social_media_url: new FormControl(""),
    author: new FormControl(""),
  });
  searchByKeyword: boolean = false;
  hasMembersOnly: boolean = false;
  tagsMapping: any;
  tags: any = [];
  imgSrc: any;
  course: any;
  tag: any;
  courses: any;
  data: any = [];
  items: GalleryItem[] = [];
  file: { name: string; image: any; } | undefined
  showImageCropper: boolean = false;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  rotateLeftIcon = faRotateLeft;
  rotateRightIcon = faRotateRight;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};
  @ViewChild("modalbutton", { static: false }) modalbutton: ElementRef<HTMLInputElement> = {} as ElementRef;

  videoFileName: any = '';
  imageFileName: any = '';
  uploadedVideos: any = [];
  uploadedImages: any = [];
  pondFiles = [];
  @ViewChild('myPond', {static: false}) myPond: any;
  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle: 'Arrastra y suelta tu archivo o <span class="filepond--label-action" style="color:#00f;text-decoration:underline;"> Navegar </span><div><small style="color:#006999;font-size:12px;">*Subir archivo</small></div>',
    labelFileProcessing: "En curso",
    labelFileProcessingComplete: "Carga completa",
    labelFileProcessingAborted: "Carga cancelada",
    labelFileProcessingError: "Error durante la carga",
    labelTapToCancel: "toque para cancelar",
    labelTapToRetry: "toca para reintentar",
    labelTapToUndo: "toque para deshacer",
    acceptedFileTypes: 'image/jpg, image/jpeg, image/png, video/mp4',
    server: {
    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
        const formData = new FormData();
        let fileExtension = file ? file.name.split('.').pop() : '';

        let timestamp = this.getTimestamp()
        if(fileExtension == 'mp4') {
          // video
          let id = this.uploadedImages?.length || 1
          this.imageFileName = 'testimonial_' + this.userId + '_' + timestamp + '.' + fileExtension;
          formData.append('file', file, this.imageFileName);
          localStorage.setItem('gallery_id', id);
          localStorage.setItem('gallery_filename', this.imageFileName);
          localStorage.setItem('gallery_file', 'uploading');
        } else {
          // image
          let id = this.uploadedVideos?.length || 1
          this.videoFileName = 'testimonial_' + this.userId + '_' + timestamp + '.' + fileExtension;
          formData.append('file', file, this.videoFileName);
          localStorage.setItem('gallery_id', id);
          localStorage.setItem('gallery_filename', this.videoFileName);
          localStorage.setItem('gallery_file', 'uploading');
        }

        const request = new XMLHttpRequest();
        if(fileExtension == 'mp4') {
          request.open('POST', environment.api + '/company/testimonial/video/temp-upload');
        } else {
          request.open('POST', environment.api + '/company/testimonial/image/temp-upload');
        }

        request.upload.onprogress = (e) => {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
              load(request.responseText);
              localStorage.setItem('gallery_file', 'complete');
              let filename: any = localStorage.getItem('gallery_filename');
              let filenames = localStorage.getItem('gallery_filenames');
              if(filenames) {
                localStorage.setItem('gallery_filenames', filenames + ',' + filename);
              } else {
                localStorage.setItem('gallery_filenames', filename);
              }
            } else {
            error('oh no');
            }
        };

        request.send(formData);

        return {
          abort: () => {
            request.abort();
            abort();
          },
        };
    },
    },
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _testimonialsService: TestimonialsService
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

    this.email = this._localService.getLocalStorage(environment.lsemail);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
    this.domain = this._localService.getLocalStorage(environment.lsdomain);
    this.userRole = this._localService.getLocalStorage(environment.lsuserRole);
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
      this.company = company[0];
      this.domain = company[0].domain;
      this.companyId = company[0].id;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
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
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'tag',
      selectAllText: this._translateService.instant('dialog.selectall'),
      unSelectAllText: this._translateService.instant('dialog.clearall'),
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
    this.fetchTestimonialsData();
  }

  fetchTestimonialsData() {
    this._testimonialsService
      .fetchTestimonialsData(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data?.settings?.subfeatures, data?.categories, data?.hotmart_settings);
          this.mapUserPermissions(data?.user_permissions);
          this.formatTags(data?.tags);
          this.courses = data?.courses;
          if(this.id > 0) {
            this.fetchTestimonial()
          } else {
            this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.testimonialsFeature = features?.find((f) => f.feature_id == 23);
    this.featureId = this.testimonialsFeature?.feature_id;
    this.pageName = this.getFeatureTitle(this.testimonialsFeature);
    this.pageTitle = this.id > 0 ? `${this._translateService.instant('landing.edit')} ${this.pageName}` : `${this._translateService.instant('landing-pages.createnew')} ${this.pageName}`;
  }

  mapSubfeatures(subfeatures, categories, hotmart_settings) {
    if (subfeatures?.length > 0) {
      this.searchByKeyword = subfeatures.some(a => a.name_en == 'Search by keyword' && a.active == 1)
      this.hasMembersOnly = subfeatures.some(a => a.name_en == 'Members only' && a.active == 1)
    }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canCreateTestimonial =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find(
        (f) => f.create == 1 && f.feature_id == 23
      );
  }

  formatTags(tags) {
    let tags_list = []
    if(tags?.length > 0) {
      tags_list = tags?.map((tag) => {
        return {
          id: tag.id,
          tag: this.getTagTitle(tag),
        }
      })
    }
    this.tags = tags_list
  }

  fetchTestimonial() {
    this._testimonialsService
      .fetchTestimonial(this.id, this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.tagsMapping = data?.tags_mapping;
          this.formatTestimonial(data?.testimonial, data?.testimonial_tags);
          this.formatImageVideos(data?.testimonial_images, data?.testimonial_videos);
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  formatTestimonial(testimonial, tags) {
    let t = {
      id: testimonial.id,
      company_id: testimonial.company_id,
      short_description: testimonial.short_description,
      author: testimonial.author,
      social_media_url: testimonial.social_media_url,
      trimmed: testimonial?.short_description?.length > 9 ? `${testimonial?.short_description?.replace(/<(?:.|\n)*?>/gm, '').substring(0, 10)}...` : testimonial?.short_description?.replace(/<(?:.|\n)*?>/gm, ''),
      description: testimonial.description,
      image: testimonial.image,
      testimonial_tags: tags,
      testimonial_image: `${environment.api}/get-testimonial-image/${testimonial.image}`,
      testimonial_course_id: testimonial.testimonial_course_id,
      created_by: testimonial.created_by,
      created_at: testimonial.created_at,
    }
    this.testimonial = t;

    this.testimonialForm.controls['short_description'].setValue(this.testimonial.short_description);
    this.testimonialForm.controls['description'].setValue(this.testimonial.description);
    this.testimonialForm.controls['author'].setValue(this.testimonial.author);
    this.testimonialForm.controls['social_media_url'].setValue(this.testimonial.social_media_url);
    this.imgSrc = this.testimonial?.testimonial_image;
    this.course = this.testimonial?.testimonial_course_id || '';
    if(this.testimonial?.testimonial_tags?.length > 0) {
      this.tag = this.testimonial?.testimonial_tags
        .map(item => {
          const { tag_id, tag } = item
          
          return {
            id: tag_id,
            tag
          }
      })
    }
  };

  formatImageVideos(images, videos) {
    let images_list = images?.map((image) => {
      return {
        srcUrl: `${environment.api}/get-testimonial-image/${image.image}`,
        previewUrl: `${environment.api}/get-testimonial-image/${image.image}`,
        type: 'image'
      }
    })
    if(images_list?.length > 0) {
      images_list?.forEach(image => {
        this.data.push(image)
      })
    }
    let videos_list = videos?.map((video) => {
      return {
        src: `${environment.api}/get-testimonial-video/${video.video}`,
        previewUrl: `${environment.api}/get-testimonial-image/video-placeholder.png`,
        type: 'video'
      }
    })
    if(videos_list?.length > 0) {
      videos_list?.forEach(video => {
        this.data.push(video)
      })
    }
    if(this.data?.length > 0) {
      this.items = this.data.map(
        (item) => item?.type == 'video' ? new VideoItem({
          src: [{
            url: item.src, type: 'video/mp4'
          }] as any,
          thumb: item.previewUrl,
          poster: item.previewUrl
        }) : new ImageItem({ 
          src: item.srcUrl, thumb: item.previewUrl
        }),
      );
    }
  }

  getTagTitle(tag) {
    return tag ? this.language == 'en' ? (tag.tag_en || tag.tag_es) : (this.language == 'fr' ? (tag.tag_fr || tag.tag_es) : 
      (this.language == 'eu' ? (tag.tag_eu || tag.tag_es) : (this.language == 'ca' ? (tag.tag_ca || tag.tag_es) : 
      (this.language == 'de' ? (tag.tag_de || tag.tag_es) : tag.tag_es)
      ))
    ) : ''
  }

  getTagsDisplay(testimonial) {
    let tags: any[] = []
    if(this.tagsMapping?.length > 0) {
      let testimonial_tags = this.tagsMapping?.filter(tm => {
        return tm.testimonial_id == testimonial.id
      })
      if(testimonial_tags?.length > 0) {
        testimonial_tags?.forEach(t => {
          let tag = this.tags?.filter(tag => {
            return tag.id == t.tag_id
          })

          tags.push({
            id: t.tag_id,
            tag: tag?.length > 0 ? this.getTagLabel(tag[0]) : ''
          })
        })
      }
    }
    return tags
  }

  getTagLabel(tag) {
    return tag
      ? this.language == "en"
        ? tag.tag_en ||
          tag.tag_es
        : this.language == "fr"
        ? tag.tag_fr ||
          tag.tag_es
        : this.language == "eu"
        ? tag.tag_eu ||
          tag.tag_es
        : this.language == "ca"
        ? tag.tag_ca ||
          tag.tag_es
        : this.language == "de"
        ? tag.tag_de ||
          tag.tag_es
        : tag.tag_es
      : "";
  }

  getFeatureTitle(feature) {
    return feature
      ? this.language == "en"
        ? feature.name_en ||
          feature.feature_name ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "fr"
        ? feature.name_fr ||
          feature.feature_name_FR ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "eu"
        ? feature.name_eu ||
          feature.feature_name_EU ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "ca"
        ? feature.name_ca ||
          feature.feature_name_CA ||
          feature.name_es ||
          feature.feature_name_ES
        : this.language == "de"
        ? feature.name_de ||
          feature.feature_name_DE ||
          feature.name_es ||
          feature.feature_name_ES
        : feature.name_es || feature.feature_name_ES
      : "";
  }

  getCourseTitle(course) {
    return course ? (this.language == 'en' ? (course.title_en || course.title) : (this.language == 'fr' ? (course.title_fr || course.title) : 
      (this.language == 'eu' ? (course.title_eu || course.title) : (this.language == 'ca' ? (course.title_ca || course.title) : 
      (this.language == 'de' ? (course.title_de || course.title) : course.title)
      ))
    )) : ''
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    const file = event?.target?.files[0];
    if (file?.size > 2000000) {
    } else {
      initFlowbite();
      setTimeout(() => {
        this.modalbutton?.nativeElement.click();
      }, 500);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.imgSrc = this.croppedImage = event.base64;
      this.file = {
        name: "image",
        image: base64ToFile(event.base64),
      };
    }
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  imageCropperModalSave() {
    this.showImageCropper = false;
  }

  imageCropperModalClose() {
    this.showImageCropper = false;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const contentContainer =
      document.querySelector(".mat-sidenav-content") || window;
    contentContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  saveTestimonial() {
    this.errorMessage = "";
    this.formSubmitted = true;

    if (
      this.testimonialForm?.get('short_description')?.errors
      || this.testimonialForm?.get('description')?.errors
    ) {
      this.scrollToTop();
      return false;
    }

    this.issaving = true;

    let gallery_items = localStorage.getItem('gallery_filenames');
    let short_description = this.testimonialForm.get("short_description")?.value;
    let description = this.testimonialForm.get("description")?.value;
    let author = this.testimonialForm.get("author")?.value;
    let social_media_url = this.testimonialForm.get("social_media_url")?.value;

    let formData = new FormData();
    formData.append("short_description", short_description);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("social_media_url", social_media_url);
    formData.append("company_id", this.companyId.toString());
    formData.append("testimonial_course_id", this.course);
    formData.append("tag_id", this.tag);

    if (this.file) {
      const filename = 'testimonial_' + this.userId + '_' + this.getTimestamp();
      formData.append('image', this.file.image, filename + '.jpg');
    }

    if(gallery_items) {
      formData.append( 'image_video_files', gallery_items );
    }

    if (this.id == 0) {
      formData.append("created_by", this.userId.toString());
    }

    if (this.id > 0) {
      // Edit
      this._testimonialsService.editTestimonial(this.id, formData).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.clearFileLocal();
          this._router.navigate([`/testimonials/details/${this.id}`]);
        },
        (error) => {
          this.issaving = false;
          this.open(this._translateService.instant("dialog.error"), "");
        }
      );
    } else {
      // Create
      this._testimonialsService.addTestimonial(formData).subscribe(
        (response) => {
          if (response.id > 0) {
            this.clearFileLocal();
            this._router.navigate([
              `/testimonials/details/${response.id}`,
            ]);
          } else {
            this.issaving = false;
            this.open(this._translateService.instant("dialog.error"), "");
          }
        },
        (error) => {
          this.issaving = false;
          this.open(this._translateService.instant("dialog.error"), "");
        }
      );
    }
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('A file was added', event);
  }

  public getTimestamp() {
    const date = new Date()
    const timestamp = date.getTime()
    return timestamp
  }

  clearFileLocal() {
    localStorage.removeItem('gallery_id');
    localStorage.removeItem('gallery_filename');
    localStorage.removeItem('gallery_file');
    localStorage.removeItem('gallery_filenames');
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