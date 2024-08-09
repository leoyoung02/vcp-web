import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChange, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StarRatingModule } from 'angular-star-rating';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { NgImageSliderModule } from 'ng-image-slider';
import { LocalService } from "@share/services";
import { Subject } from "rxjs";
import { initFlowbite } from "flowbite";
import { environment } from "@env/environment";

import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilepondPluginImagePreview from 'filepond-plugin-image-preview';
import FilepondPluginImageEdit from 'filepond-plugin-image-edit';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { FilePond } from "filepond";
registerPlugin(FilepondPluginImagePreview, FilepondPluginImageEdit, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

@Component({
  selector: "app-astro-ideal-multimedia-content",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule,
    NgImageSliderModule,
    FilePondModule,
  ],
  templateUrl: "./multimedia-content.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultimediaContentComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;
  @Input() images: any;
  @Input() mode: any;
  @Input() buttonColor: any;
  @Input() showFilesUpload: any;
  @Output() onFilesUploaded = new EventEmitter();

  languageChangeSubscription;
  language: any;

  imageFileName: any = '';
  pondFiles:any = [];

  @ViewChild('myPond', {static: false}) myPond: any;
  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: this._translateService.instant('course-details.uploaddesc'),
    labelFileProcessing: this._translateService.instant('course-details.uploadprocessing'),
    labelFileProcessingComplete: this._translateService.instant('course-details.uploadcomplete'),
    labelFileProcessingAborted: this._translateService.instant('course-details.uploadcancelled'),
    labelFileProcessingError: this._translateService.instant('course-details.uploaderror'),
    labelTapToCancel: this._translateService.instant('course-details.uploadtapcancel'),
    labelTapToRetry: this._translateService.instant('course-details.uploadtapretry'),
    labelTapToUndo: this._translateService.instant('course-details.uploadtapundo'),
    acceptedFileTypes: 'image/jpg, image/jpeg, image/png',
    server: {
    process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
        const formData = new FormData();
        let fileExtension = file ? file.name.split('.').pop() : '';
        let timestamp = new Date().getTime();
        this.imageFileName = 'professional_multimedia_' + this.id + '_' + timestamp + '.' + fileExtension;
        formData.append('file', file, this.imageFileName);
        localStorage.setItem('professional_gallery_image_file', 'uploading');

        const request = new XMLHttpRequest();
        request.open('POST', environment.api + '/v3/professional/multimedia/image/temp-upload');

        request.upload.onprogress = (e) => {
          progress(e.lengthComputable, e.loaded, e.total);
        };

        request.onload = function () {
          if (request.status >= 200 && request.status < 300) {
            load(request.responseText);
            localStorage.setItem('professional_gallery_image_file', 'complete');
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
    private _translateService: TranslateService,
    private _localService: LocalService,
  ) { 
    
  }

  ngOnChanges(changes: SimpleChange) {
    let multimediaContentChange = changes['images'];
    if (multimediaContentChange?.currentValue?.length > 0) {
      this.images = multimediaContentChange.currentValue;
      this.initializePage();
    }

    let showFilesUploadChange = changes['showFilesUpload'];
    if (showFilesUploadChange?.currentValue != showFilesUploadChange?.previousValue) {
      this.showFilesUpload = showFilesUploadChange.currentValue;
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
    
  }

  addImage() {
    this.showFilesUpload = true;
  }

  pondHandleInit() {
    console.log('FilePond has initialised', this.myPond);
  }

  pondHandleAddFile(event: any) {
    if(localStorage.getItem('professional_gallery_image_file') == 'complete' && this.imageFileName) {
      this.onFilesUploaded.emit(this.imageFileName);
    }
  }

  podHandleUpdateFiles(event: any) {
    console.log('A file was updated', event);
    if(localStorage.getItem('professional_gallery_image_file') == 'complete' && this.imageFileName) {
      this.onFilesUploaded.emit(this.imageFileName);
    }
  }

  podHandleProcessFile(event: any) {
    console.log('A file was updated', event);
    if(localStorage.getItem('professional_gallery_image_file') == 'complete' && this.imageFileName) {
      this.onFilesUploaded.emit(this.imageFileName);
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('professional_gallery_image_file');
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}