import { CommonModule, NgOptimizedImage, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { TestimonialsService } from "@features/services";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { BreadcrumbComponent, PageTitleComponent, ToastComponent } from "@share/components";
import { LocalService, CompanyService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import { MembersService } from "@features/services/members/members.service";
import { initFlowbite } from "flowbite";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import moment from "moment";
import get from "lodash/get";

@Component({
  selector: 'app-members-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    NgOptimizedImage,
    ToastComponent,
    PageTitleComponent,
  ],
  templateUrl: './detail.component.html'
})
export class MemberDetailComponent {
  private destroy$ = new Subject<void>();

  @Input() id!: number;

  languageChangeSubscription;
  emailDomain;
  user;
  canCreate: boolean = false;
  language: any;
  userId: any;
  companyId: any;
  pageName: any;
  pageDescription: any;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  hoverColor: any;
  superAdmin: boolean = false;
  company: any;
  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";
  memberData: any;
  member: any;
  showConfirmationModal: boolean = false;
  selectedItem: any;
  confirmDeleteItemTitle: any;
  confirmDeleteItemDescription: any;
  acceptText: string = "";
  cancelText: any = "";
  confirmMode: string = "";
  featureId: any;
  membersFeature: any;
  editHover: boolean = false;
  deleteHover: boolean = false;
  createQuestionHover: boolean = false;
  createReferenceHover: boolean = false;
  questionForm: any;
  questionFormSubmitted: boolean = false;
  message: any = '';
  dialogMode: string = "";
  dialogTitle: any;
  errorMessage: string = '';
  processing: boolean = false;
  apiPath: string = environment.api + '/';
  sendReferenceForm: any;
  sendReferenceFormSubmitted: boolean = false;
  processingSendReference: boolean = false;
  @ViewChild("modalbutton", { static: false }) modalbutton:
    | ElementRef
    | undefined;
  @ViewChild("closemodalbutton", { static: false }) closemodalbutton:
    | ElementRef
    | undefined;

  constructor(
    private _router: Router,
    private _membersService: MembersService,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _location: Location,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.language =
      this._localService.getLocalStorage(environment.lslang) || "es";
    this._translateService.use(this.language || "es");

    this.emailDomain = this._localService.getLocalStorage(environment.lsemail);
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
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
      this.emailDomain = company[0].domain;
      this.companyId = company[0].id;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
      this.hoverColor = company[0].hover_color
        ? company[0].hover_color
        : company[0].primary_color;
    }

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );

    this.getMember();

    setTimeout(() => {
      initFlowbite();
    }, 2000);
  }

  getMember() {
    this._membersService
      .fetchMember(this.id, this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          console.log(data)
          this.memberData = data;
          this.initializePage();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializePage() {
    this.sendReferenceForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [Validators.required]),
      'description': new FormControl(''),
    })
    let data = this.memberData;
    this.user = data?.user_permissions?.user;
    this.mapFeatures(data?.features_mapping);
    this.mapUserPermissions(data?.user_permissions);
    this.formatMember(data?.member);
    this.initializeBreadcrumb(data);
  }

  mapFeatures(features) {
    this.membersFeature = features?.find((f) => f.feature_id == 15);
    this.featureId = this.membersFeature?.feature_id;
    this.pageName = this.getFeatureTitle(this.membersFeature);
    this.pageDescription = this.getFeatureDescription(this.membersFeature);
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canCreate =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find(
        (f) => f.create == 1 && f.feature_id == 15
      );
  }

  formatMember(member) {
    let t = {
      id: member.id,
      image: `${environment.api}/${member.image}`,
      display_name: member?.first_name ? `${member?.first_name} ${member?.first_name}` : member?.name,
      email: `mailto:${member?.email}`,
      email_display: member?.email,
      phone: `tel:${member?.phone}`,
      phone_display: member?.phone,
      city: member?.city,
      sector: member?.sector,
      zip_code: member?.zip_code,
      country: member?.country,
      company_name: member?.company_name,
      area_group: member?.area_group,
      linkedin: member?.linkedin,
      website: member?.website,
      references: member?.references,
      questions: member?.questions,
    }
    this.member = t;
  }

  initializeBreadcrumb(data) {
    this.level1Title = this.pageName;
    this.level2Title = "";
    this.level3Title = "";
    this.level4Title = "";
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

  getFeatureDescription(feature) {
    return feature
      ? this.language == "en"
        ? feature.description_en || feature.description_es
        : this.language == "fr"
        ? feature.description_fr || feature.description_es
        : this.language == "eu"
        ? feature.description_eu || feature.description_es
        : this.language == "ca"
        ? feature.description_ca || feature.description_es
        : this.language == "de"
        ? feature.description_de || feature.description_es
        : feature.description_es
      : "";
  }

  handleCreateQuestion() {
    this.questionFormSubmitted = false;
    this.dialogMode = "question";
    this.dialogTitle =  this._translateService.instant('members.askaquestion');
    this.modalbutton?.nativeElement.click();
  }

  toggleCreateQuestionHover(event) {
    this.createQuestionHover = event;
  }

  handleCreateReference() {
    this.sendReferenceFormSubmitted = false;
    this.dialogMode = "reference";
    this.dialogTitle =  this._translateService.instant('members.sendreference');
    this.modalbutton?.nativeElement.click();
  }

  toggleCreateReferenceHover(event) {
    this.createReferenceHover = event;
  }

  sendNewQuestion() {
    this.questionFormSubmitted = true

    if(!this.message) {
      return false
    }

    let params = {
      'company_id': this.companyId,
      'user_id': this.id,
      'message': this.message,
      'question_id': 0,
      'created_by': this.userId,
    }
    this._membersService.askQuestion(params).subscribe(data => {
      this.open(this._translateService.instant('dialog.sentsuccessfully'), '');
      this.getMember();
      this.closemodalbutton?.nativeElement.click();
    }, err => {
      console.log('err: ', err);
    })
  }

  sendReference() {
    this.sendReferenceFormSubmitted = true

    if(!this.isValidReferenceForm()) {
      return false
    }

    this.processingSendReference = true

    let params = {
      'company_id': this.companyId,
      'user_id': this.id,
      'name': this.sendReferenceForm.get('name').value,
      'email': this.sendReferenceForm.get('email').value,
      'phone': this.sendReferenceForm.get('phone').value,
      'description': this.sendReferenceForm.get('description').value,
      'created_by': this.userId,
    }
    this._membersService.sendReference(params).subscribe(data => {
      this.open(this._translateService.instant('dialog.sentsuccessfully'), '');
      this.processingSendReference = false
      this.closemodalbutton?.nativeElement.click();
      this.getMember();
    }, err => {
      console.log('err: ', err);
      this.open(this._translateService.instant('dialog.error'), '');
    })
  }

  isValidReferenceForm() {
    let valid = true;
    Object.keys(this.sendReferenceForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.sendReferenceForm.get(key).errors;
      if(controlErrors != null) {
        valid = false;
      }
    });
    return valid;
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
  }

  handleGoBack() {
    this._location.back();
  }

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
