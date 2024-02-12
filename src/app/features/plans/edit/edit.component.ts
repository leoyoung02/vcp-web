import { CommonModule, DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { PlansService } from "@features/services";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ButtonGroupComponent,
  NoAccessComponent,
  PageTitleComponent,
  ToastComponent,
} from "@share/components";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { EditorModule } from "@tinymce/tinymce-angular";
import {
  ImageCropperModule,
  ImageCroppedEvent,
  ImageTransform,
  base64ToFile,
} from "ngx-image-cropper";
import { DomSanitizer } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { environment } from "@env/environment";
import { initFlowbite } from "flowbite";
import { faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import moment from "moment";
import get from "lodash/get";

@Component({
  selector: "app-clubs-edit",
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
    ButtonGroupComponent,
    PageTitleComponent,
    NoAccessComponent,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ToastComponent,
  ],
  templateUrl: "./edit.component.html",
})
export class PlanEditComponent {
  private destroy$ = new Subject<void>();

  @Input() id: any;
  @Input() planTypeId: any;

  languageChangeSubscription: any;
  isMobile: boolean = false;
  apiPath: string = environment.api;
  datePipe = new DatePipe("en-US");
  showCategorySelect = false;
  CompanySupercategories: any = [];
  CompanyGroups: any = [];
  dropdownSettings: any;
  plan: any = {};
  emailDomain;
  isLoading = true;
  companyUsers: any = [];
  noRecipients = false;
  openSuccessModal = false;
  url = "";
  user: any;
  company_id: any;
  endDate: any;

  terms: boolean = false;
  buttonDisabled: boolean = false;
  planForm: FormGroup = new FormGroup({
    group_id: new FormControl("", [Validators.required]),
    title_es: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    title_en: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    title_fr: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    title_eu: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    title_ca: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    title_de: new FormControl("", [
      Validators.required,
      Validators.maxLength(150),
    ]),
    descriptionEs: new FormControl("", [Validators.required]),
    descriptionEn: new FormControl("", [Validators.required]),
    descriptionFr: new FormControl("", [Validators.required]),
    descriptionEu: new FormControl("", [Validators.required]),
    descriptionCa: new FormControl("", [Validators.required]),
    descriptionDe: new FormControl("", [Validators.required]),
    address: new FormControl(""),
    meeting_point: new FormControl("", [Validators.maxLength(150)]),
    plan_date: new FormControl(null, [Validators.required]),
    plan_date_hh: new FormControl("00", [Validators.required]),
    plan_date_mm: new FormControl("00", [Validators.required]),
    end_date: new FormControl(null),
    end_date_hh: new FormControl(""),
    end_date_mm: new FormControl(""),
    time_slot: new FormControl("00", [Validators.required]),
    seats: new FormControl(null),
    member_seats: new FormControl(null),
    guest_seats: new FormControl(null),
    price: new FormControl(null),
    zoom_link: new FormControl(""),
    zoom_link_text: new FormControl(""),
    teams_link: new FormControl(""),
    teams_link_text: new FormControl(""),
    youtube_link: new FormControl(""),
    youtube_link_text: new FormControl(""),
  });
  createdBy: any = 4;
  planType: any = 0;
  privateType: any = 0;
  group_id: any;
  selectedClub: any = "";
  selectedCompany: any = "";
  errorMessage =
    "Something went wrong. Please check network or provided data for any errors.";
  showError = false;
  category_id = [];
  localStorageEvent: any = {};
  localStorageGroup: any = {};
  planUrl: any = "";
  imageFile: any;
  medical = false;
  netcultura = false;
  isShowAttendee: boolean = true;
  isShowComments: boolean = true;
  isShowDescription: boolean = true;
  isShowPrice: boolean = true;

  show_attendee_field: boolean = false;
  show_description_field: boolean = false;
  show_comments_field: boolean = false;
  show_price_field: boolean = false;

  // Cropper
  showImageCropper: boolean = false;
  imageChangedEvent: any;
  croppedImage: any;
  clubList: any = [];
  file: any;

  imgSrc: any;
  createdPlanId: any;
  userEmailDomain: any;
  language: any;
  formSubmitted: boolean = false;
  initialLoad: boolean = true;
  issaving: boolean = false;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  transform: ImageTransform = {};

  videoFile: any;
  fileExtension: any;
  videoSrc: any;

  noImage: boolean = false;

  companyId: any;
  types: any = [];
  categories: any;
  subcategories: any;
  allSubcategories: any = [];
  selectedSubcategory: any;
  subcategoryDropdownSettings: any;
  subcats: any;
  eventType: any = "";
  eventCategory: any = "";
  eventSubcategory: any = "";
  userRole: any;
  slugs: any;

  allClubs: any = [];
  roles: any;

  speedGroups: any;
  speedGroup: any = "";
  planSlug: any;

  companies: any;
  primaryColor: any;
  buttonColor: any;
  features: any;
  pageName: any;
  clubTitle: any;
  subfeatures: any;
  activityFeeEnabled: boolean = false;
  selectedPaymentType: any = 1;
  paymentTypes: any;
  withFee: boolean = false;
  description: any;
  price: any;

  isloading: boolean = true;
  subfeatures2: any;
  isPlanDurationActive: boolean = false;

  admin1: boolean = false;
  admin2: boolean = false;
  superAdmin: boolean = false;
  companyName: any = "";
  isStripePayment: boolean = false;
  showCanaryTime: boolean = false;
  displayCanaryTime: boolean = false;
  guestMemberSeatActive: boolean = false;
  showGuestMemberSeat: boolean = false;
  invitationLinkActive: boolean = false;
  showInvitationLink: boolean = false;
  waitingListActive: boolean = false;
  waitingListEnabled: boolean = false;
  waitingListButtonTextEn: any;
  waitingListButtonTextEs: any;
  waitingListCancelButtonTextEn: any;
  waitingListCancelButtonTextEs: any;
  credits: boolean = false;
  creditsValue: any = 0;

  hasEmailInvite: boolean = false;
  emailInviteQuestions: any;
  emailInviteModal: boolean = false;
  emailInviteFormSubmitted: boolean = false;

  createZoomMeeting: boolean = false;
  generateZoomMeeting: boolean = false;
  zoomStartUrl: any;
  zoomJoinUrl: any;
  zoomApiKey: any;
  zoomApiSecret: any;
  zoomMeetingId: any;
  zoomPassword: any;

  hasTypeOfActivity: boolean = false;
  typeOfActivity: any = "";
  typeOfActivities: any = [];
  showProlongedActivitySection: boolean = false;
  prolongedDaysNumber: any;
  prolongedActivities: any = [];

  hasSubgroups: boolean = false;
  allSubgroups: any = [];
  subgroups: any = [];
  selectedSubgroup: any = "";
  userId: any;
  languages: any;
  selectedLanguage: any = "es";
  defaultLanguage: any = "es";
  title: any;
  descriptionEs: any;
  descriptionEn: any;
  descriptionFr: any;
  descriptionEu: any;
  descriptionCa: any;
  descriptionDe: any;
  selectedLanguageChanged: boolean = false;
  showLanguageNote: boolean = true;
  fileTypeSelected: any = "image";
  showLanguages: boolean = false;
  showZoomLink: boolean = false;
  showTeamsLink: boolean = false;
  showYouTubeLink: boolean = false;

  cities: any;
  selectedCity: any = "";
  featureId: any;
  hasCustomMemberTypeSettings: boolean = false;
  hasAccess: boolean = false;
  isAccessChecked: boolean = false;
  clubActivityApproveRoles: any = [];
  userRoles: any = [];
  memberTypes: any = [];
  hasClubActivitiesApprovalSettings: boolean = false;
  modal: any;
  canAssignMultipleCities: boolean = false;
  hasRepeatingEvents: boolean = false;
  repeatEvent: any;
  cityDropdownSettings: any;
  repeatEventFrequency: any = 1;
  repeatEventFrequencyUnit: any = "";
  repeatEventFrequencyUnitLabel: any = "";
  repeatEventUntil: any = "";
  repeatEventUntilOccurences: any = "";
  durationUnits: any = [];
  repeatEventSettingsSubmitted: boolean = false;
  showRepeatingEventSettingsModal: boolean = false;
  repeatMonthlyOn: boolean = false;
  repeatMonthlyOnOrder: any = "";
  repeatMonthlyOnOrderDay: any = "";
  monthlyOrders: any = [];
  monthlyOrderDays: any = [];
  recurringCustomDurationOptions: any = [];
  repeatEveryOnForWeeksOptions: any = [];
  repeatEveryOnFoMonthsOptions: any = [];
  endsOptions: any = [];
  isClubPresident: boolean = false;
  hasFeatured: boolean = false;
  featured: boolean = false;
  featuredTextValue: any;
  featuredTextValueEn: any;
  featuredTextValueFr: any;
  featuredTextValueEu: any;
  featuredTextValueCa: any;
  featuredTextValueDe: any;
  showSeats: boolean = false;
  allowExternalRegistration: boolean = false;
  isExternalRegistration: boolean = false;
  editorToUse: any = "tinymce";
  editor: any;
  hasSpeaker: boolean = false;
  hasGuestSpeaker: boolean = false;
  members: any = [];
  selectedSpeaker: any = "";
  guestSpeaker: any = "";
  hasRequestDNI: boolean = false;
  requestDNI: boolean = false;
  membersSettings: any = {};
  clubName: any = "";
  startDateTimeError: boolean = false;
  endDateTimeError: boolean = false;
  otherSettings: any;
  clubFeatureId: any = 0;
  plansFeature: any;
  clubsFeature: any;
  canCreatePlan: any;
  canViewPlan: boolean = false;
  canManagePlan: boolean = false;
  buttonList: any = [];
  status: boolean = true;
  waitingListNotification: boolean = false;
  rotateLeftIcon = faRotateLeft;
  rotateRightIcon = faRotateRight;
  @ViewChild("modalbutton", { static: false })
  modalbutton: ElementRef<HTMLInputElement> = {} as ElementRef;
  draftStatus: any;
  planAddress: any;
  seats: any;

  showConfirmationModal: boolean = false;
  selectedItem: any;
  company: any;
  confirmDoneItemTitle: any;
  confirmDoneItemDescription: any;
  acceptText: string = "";
  cancelText: any = "";
  planId: number = 0;
  pageTitle: string = "";
  hasActivityCodeActivated: boolean = false;
  activityCode: any;
  isUESchoolOfLife: boolean = false;
  hasCredits: boolean = false;

  eventCategoryDropdownSettings: any;
  eventSubcategoryDropdownSettings: any;
  planCategoryMapping: any = [];

  allowCourseAccess: boolean = false;
  campusList: any = [];
  selectedCampus: any = '';
  facultyList: any = [];  
  selectedFaculty: any = '';
  businessUnitList: any = [];  
  selectedBusinessUnit: any = '';
  typeList: any = [];  
  selectedType: any = '';
  segmentList: any = [];  
  selectedSegment: any = '';
  brandingList: any = [];  
  selectedBranding: any = '';
  dropdownList: any;
  selectedItems :any;
  additionalPropertiesDropdownSettings = {};
  membersLimitGreaterThanSeats: boolean = false;
  guestsLimitGreaterThanSeats: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _plansService: PlansService,
    private sanitizer: DomSanitizer
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

    this.createdBy = this.planTypeId;
    this.language = this._localService.getLocalStorage(environment.lslang);
    this._translateService.use(this.language || "es");

    this.localStorageEvent = JSON.parse(
      this._localService.getLocalStorage(environment.lsevent)
    );
    this.localStorageGroup = JSON.parse(
      this._localService.getLocalStorage(environment.lsgroup)
    );
    this.url = this._router.url.substring(
      this._router.url.lastIndexOf("/") + 1
    );
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
    this.userRole = this._localService.getLocalStorage(environment.lsuserRole);
    this.showLanguageNote = this._localService.getLocalStorage(
      "showLanguageNote"
    )
      ? false
      : true;

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
      this.isUESchoolOfLife = this._companyService.isUESchoolOfLife(company[0]);
      this.emailDomain = company[0].domain;
      this.userEmailDomain = this.emailDomain;
      this.companyId = company[0].id;
      this.companyName = company[0].entity_name;
      this.selectedCompany = this.companyName;
      this.company_id = this.companyId;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
      this.featuredTextValue =
        company[0].featured_text ||
        this._translateService.instant("courses.featured");
      this.featuredTextValueEn =
        company[0].featured_text_en ||
        this._translateService.instant("courses.featured");
      this.featuredTextValueFr =
        company[0].featured_text_fr ||
        this._translateService.instant("courses.featured");
      this.featuredTextValueEu =
        company[0].featured_text_eu ||
        this._translateService.instant("courses.featured");
      this.featuredTextValueCa =
        company[0].featured_text_ca ||
        this._translateService.instant("courses.featured");
      this.featuredTextValueDe =
        company[0].featured_text_de ||
        this._translateService.instant("courses.featured");
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
      idField: "fk_supercategory_id",
      textField:
        this.language == "en"
          ? "name_EN"
          : this.language == "fr"
          ? "name_FR"
          : this.language == "eu"
          ? "name_EU"
          : this.language == "ca"
          ? "name_CA"
          : this.language == "de"
          ? "name_DE"
          : "name_ES",
      selectAllText: this._translateService.instant("dialog.selectall"),
      unSelectAllText: this._translateService.instant("dialog.clearall"),
      limitSelection: 3,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: this._translateService.instant('guests.search'),
    };
    this.eventCategoryDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.language == 'en' ? 'name_en' :
      (this.language == 'fr' ? 'name_fr' : 
        (this.language == 'eu' ? 'name_eu' : 
          (this.language == 'ca' ? 'name_ca' : 
            (this.language == 'de' ? 'name_de' : 'name_es')
          )
        )
      ),
      selectAllText: this._translateService.instant('dialog.selectall'),
      unSelectAllText: this._translateService.instant('dialog.clearall'),
      limitSelection: 3,
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    this.eventSubcategoryDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: this.language == 'en' ? 'name_en' :
      (this.language == 'fr' ? 'name_fr' : 
        (this.language == 'eu' ? 'name_eu' : 
          (this.language == 'ca' ? 'name_ca' : 
            (this.language == 'de' ? 'name_de' : 'name_es')
          )
        )
      ),
      selectAllText: this._translateService.instant('dialog.selectall'),
      unSelectAllText: this._translateService.instant('dialog.clearall'),
      limitSelection: 3,
      itemsShowLimit: 2,
      allowSearchFilter: true
    }
    this.membersSettings = {
      singleSelection: true,
      idField: "id",
      textField: "name",
      allowSearchFilter: true,
      searchPlaceholderText: this._translateService.instant('guests.search'),
    };
    this.cityDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "city",
      selectAllText: this._translateService.instant("dialog.selectall"),
      unSelectAllText: this._translateService.instant("dialog.clearall"),
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: this._translateService.instant('guests.search'),
    };
    this.subcategoryDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField:
        this.language == "en"
          ? "name_EN"
          : this.language == "fr"
          ? "name_FR"
          : this.language == "eu"
          ? "name_EU"
          : this.language == "ca"
          ? "name_CA"
          : this.language == "de"
          ? "name_DE"
          : "name_ES",
      selectAllText: this._translateService.instant("dialog.selectall"),
      unSelectAllText: this._translateService.instant("dialog.clearall"),
      limitSelection: 3,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: this._translateService.instant('guests.search'),
    };
    this.additionalPropertiesDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'value',
      selectAllText: this._translateService.instant('dialog.selectall'),
      unSelectAllText: this._translateService.instant('dialog.clearall'),
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.paymentTypes = [
      {
        id: 1,
        type_en: "One time",
        type_es: "Una vez",
        type_fr: "Une fois",
        type_eu: "Behin",
        type_ca: "Una vegada",
        type_de: "Einmal",
      },
      {
        id: 2,
        type_en: "Monthly recurring",
        type_es: "Mensual recurrente",
        type_fr: "Récurrent mensuel",
        type_eu: "Hilero errepikakorra",
        type_ca: "Recurrent mensual",
        type_de: "Monatlich wiederkehrend",
      },
    ];
    if(this.companyId == 32) { this.fetchAdditionalProperties(); }
    this.fetchPlansData();
  }

  fetchPlansData() {
    this._plansService
      .fetchPlansOtherDataCombined(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data);
          this.mapUserPermissions(data?.user_permissions);

          this.CompanySupercategories = data?.plan_categories;
          if(data?.types?.length > 0) {
            this.types = data?.types;
            this.categories = data?.plan_categories;
          }
          this.subcategories = data?.plan_subcategories;
          this.allSubcategories = data?.plan_subcategories;
          this.cities = data?.cities;
          this.mapLanguages(data?.languages);
          this.mapClubs(data);

          this.isLoading = false;

          if (this.id > 0) {
            this.fetchPlan();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  fetchAdditionalProperties() {
    this._companyService
      .fetchAdditionalPropertiesAdmin(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          const {campus,faculty,bussines_unit,type,segment,branding} = data.data;
          this.campusList = campus;
          this.facultyList = faculty;
          this.businessUnitList = bussines_unit;
          this.typeList = type;
          this.segmentList = segment;
          this.brandingList = branding;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.plansFeature = features?.find((f) => f.feature_id == 1);
    this.featureId = this.plansFeature?.feature_id;
    this.pageName = this.getFeatureTitle(this.plansFeature);
    if(this.isUESchoolOfLife && this.companyId == 32) {
      this.pageName = this.pageName?.replace('de Vida Universitaria', 'de School of Life')
    }
    this.pageTitle = `${this.id > 0 ? this._translateService.instant('plan-create.edityouractivity') : this._translateService.instant('plan-create.createyouractivity')} ${this.pageName}` 

    this.clubsFeature = features?.find(
      (f) => f.feature_id == 5 && f.status == 1
    );
    this.clubTitle = this.clubsFeature
      ? this.getFeatureTitle(this.clubsFeature)
      : "";
  }

  mapSubfeatures(data) {
    let subfeatures = data?.settings?.subfeatures;
    let club_subfeatures = data?.settings?.club_subfeatures;
    if (subfeatures?.length > 0) {
      this.activityFeeEnabled = subfeatures.some(
        (a) => a.name_en == "Fee" && a.active == 1
      );
      this.isPlanDurationActive = subfeatures.some(
        (a) => a.name_en == "Duration" && a.active == 1
      );
      this.guestMemberSeatActive = subfeatures.some(
        (a) => a.name_en == "Guest/Member seats" && a.active == 1
      );
      this.invitationLinkActive = subfeatures.some(
        (a) => a.name_en == "Invitation link" && a.active == 1
      );
      this.showCanaryTime = subfeatures.some(
        (a) => a.name_en == "Show Canary time" && a.active == 1
      );
      this.waitingListActive = subfeatures.some(
        (a) => a.name_en == "Waiting list" && a.active == 1
      );
      this.hasEmailInvite = subfeatures.some(
        (a) => a.name_en == "Email invite" && a.active == 1
      );
      this.createZoomMeeting = subfeatures.some(
        (a) => a.name_en == "Zoom meeting" && a.active == 1
      );
      this.hasTypeOfActivity = subfeatures.some(
        (a) => a.name_en == "Type of activity" && a.active == 1
      );
      this.showZoomLink = subfeatures.some(
        (a) => a.name_en == "Zoom link" && a.active == 1
      );
      this.showTeamsLink = subfeatures.some(
        (a) => a.name_en == "Teams link" && a.active == 1
      );
      this.showYouTubeLink = subfeatures.some(
        (a) => a.name_en == "YouTube link" && a.active == 1
      );
      this.hasSubgroups = club_subfeatures?.some(
        (a) => a.name_en == "Subgroups" && a.active == 1
      );
      this.hasClubActivitiesApprovalSettings = club_subfeatures.some(
        (a) => a.name_en == "Created activities authorization" && a.active == 1
      );
      this.canAssignMultipleCities = subfeatures.some(
        (a) => a.name_en == "Assign multiple cities" && a.active == 1
      );
      this.hasRepeatingEvents = subfeatures.some(
        (a) => a.name_en == "Recurring" && a.active == 1
      );
      this.hasFeatured = subfeatures.some(
        (a) => a.name_en == "Featured" && a.active == 1
      );
      this.allowExternalRegistration = subfeatures.some(
        (a) => a.name_en == "Allow external registration" && a.active == 1
      );
      this.hasSpeaker = subfeatures.some(
        (a) => a.name_en == "Speaker" && a.active == 1
      );
      this.hasGuestSpeaker = subfeatures.some(
        (a) => a.name_en == "Guest Speaker" && a.active == 1
      );
      this.hasRequestDNI = subfeatures.some(
        (a) => a.name_en == "Request DNI" && a.active == 1
      );
      this.show_price_field = subfeatures.some(
        (a) => a.name_en == "Price" && a.active == 1
      );
      this.show_attendee_field = subfeatures.some(
        (a) => a.name_en == "Attendee" && a.active == 1
      );
      this.show_description_field = subfeatures.some(
        (a) => a.name_en == "Description" && a.active == 1
      );
      this.show_comments_field = subfeatures.some(
        (a) => a.name_en == "Comments" && a.active == 1
      );
      this.hasActivityCodeActivated = subfeatures.some(
        (a) => a.name_en == "Activity Code" && a.active == 1
      );
      this.hasCredits = subfeatures.some(
        (a) => a.name_en == "Credits" && a.active == 1
      );
    }

    let languages = data?.languages;
    this.languages = languages
      ? languages.filter((lang) => {
          return lang.status == 1;
        })
      : [];
    if (this.languages?.length > 0) {
      this.languages = this.languages.sort((a, b) => {
        return b.default - a.default;
      });
    }
    this.defaultLanguage = languages
      ? languages.filter((lang) => {
          return lang.default == true;
        })
      : [];
    this.showLanguages = true;
    this.selectedLanguage = this.language;
    if (this.guestMemberSeatActive) {
      this, (this.showSeats = true);
      this.showGuestMemberSeat = true;
    }
    if (this.invitationLinkActive) {
      this.showInvitationLink = true;
    }
    if (this.showCanaryTime) {
      this.displayCanaryTime = true;
    }
    if (this.waitingListActive) {
      let subf = subfeatures.filter((sf) => {
        return sf.name_en == "Waiting list";
      });
      if (subf?.length > 0) {
        let waiting_list_details = data?.subfeature_options;
        if (waiting_list_details) {
          waiting_list_details.forEach((d) => {
            if (d.option_id == 1) {
              this.waitingListButtonTextEs = d.value;
            }
            if (d.option_id == 2) {
              this.waitingListButtonTextEn = d.value;
            }
            if (d.option_id == 3) {
              this.waitingListCancelButtonTextEs = d.value;
            }
            if (d.option_id == 4) {
              this.waitingListCancelButtonTextEn = d.value;
            }
            if (d.option_id == 5) {
              this.waitingListNotification = d.value ? true : false;
            }
          });
        }
      }
    }
    if (this.hasEmailInvite) {
      this.emailInviteQuestions = data?.settings?.email_invite_questions;
      this._localService.setLocalStorage(
        environment.lsemailinvitequestions,
        this.emailInviteQuestions && this.emailInviteQuestions.length > 0
          ? JSON.stringify(this.emailInviteQuestions)
          : ""
      );
    }
    if (this.hasTypeOfActivity) {
      this.typeOfActivities = data?.activity_types;
    }
    if (this.hasSpeaker) {
      //this.loadUsers()
    }
    this.showCategorySelect = true;
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

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canViewPlan = user_permissions?.member_type_permissions?.find(
      (f) => f.view == 1 && f.feature_id == 1
    )
      ? true
      : false;
    this.canCreatePlan =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find((f) => f.create == 1 && f.feature_id == 1);
    this.canManagePlan = user_permissions?.member_type_permissions?.find(
      (f) => f.manage == 1 && f.feature_id == 1
    )
      ? true
      : false;
  }

  mapLanguages(languages) {
    languages = languages?.map((language) => {
      return {
        ...language,
        name: this.getLanguageName(language),
      };
    });

    this.languages = languages?.filter((lang) => {
      return lang.status == 1;
    });
    this.defaultLanguage = languages
      ? languages.filter((lang) => {
          return lang.default == true;
        })
      : [];
    this.selectedLanguage = this.language || "es";
    this.initializeButtonGroup();
  }

  mapClubs(data) {
    if (!this.subcategories) {
      this.clubList = data?.clubs;
      this.clubList = this.clubList.filter((club) => {
        return club.fk_company_id == this.user.fk_company_id;
      });
      if (this.user.fk_company_id == 10) {
        this.selectedClub = 364;
      }
    } else {
      this.allClubs = data?.clubs;
      this.clubList = data?.clubs;

      if (!this.superAdmin) {
        if (this.hasSubgroups) {
          let club_access = this.clubList.filter((club) => {
            return club.fk_user_id == this.user.id;
          });
          this.clubList = this.clubList.filter((club) => {
            let include = false;

            let match = club_access.some(
              (a) => a.id == club.id || a.parent_group_id == club.id
            );
            if (match) {
              include = true;
            }

            return include;
          });
        } else {
          this.clubList = this.clubList.filter((c) => {
            return c.fk_user_id == this.user.id;
          });
        }
      } else {
      }
    }

    if (this.hasSubgroups) {
      this.allSubgroups = this.clubList.filter((group) => {
        return group.parent_group_id > 0;
      });
      this.clubList = this.clubList.filter((club) => {
        return !club.parent_group_id;
      });
    }

    if (this.clubList?.length > 0) {
      this.clubList = this.clubList.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }

        if (a.title > b.title) {
          return 1;
        }

        return 0;
      });
    }

    if (this.companyId == 32 && !this.superAdmin) {
      this.getClubPresidents(data?.club_presidents_mapping);
    }
  }

  getClubPresidents(club_presidents_mapping) {
    let clubs =
      club_presidents_mapping &&
      club_presidents_mapping.filter((club) => {
        return club.user_id == this.userId;
      });

    if (clubs && clubs.length > 0) {
      this.isClubPresident = true;
      this.assignDefaultCategorySub();
      this.clubList = this.allClubs.filter((club) => {
        let include = false;
        clubs.forEach((cm) => {
          if (this.userId == cm.user_id && cm.club_id == club.id) {
            include = true;
          }
        });

        return include;
      });
    }
  }

  assignDefaultCategorySub() {
    let category =
      this.CompanySupercategories &&
      this.CompanySupercategories.filter((cs) => {
        return cs.name_ES == "Vida Universitaria";
      });
    this.category_id =
      category &&
      category.map((category) => {
        const { id, name_EN, name_ES, name_FR, name_EU, name_CA, name_DE } =
          category;

        if (this.language == "en") {
          return {
            id,
            name_EN,
          };
        } else if (this.language == "fr") {
          return {
            id,
            name_FR,
          };
        } else if (this.language == "eu") {
          return {
            id,
            name_EU,
          };
        } else if (this.language == "ca") {
          return {
            id,
            name_CA,
          };
        } else if (this.language == "de") {
          return {
            id,
            name_DE,
          };
        } else {
          return {
            id,
            name_ES,
          };
        }
      });

    if (category && category[0]) {
      let subcats =
        this.allSubcategories &&
        this.allSubcategories.filter((sc) => {
          return sc.category_id == category[0].id;
        });

      this.subcategories =
        subcats &&
        subcats.filter((sc) => {
          return sc.name_ES == "Presencial" || sc.name_ES == "Virtual";
        });
    }
  }

  fetchPlan() {
    this._plansService
      .fetchPlanDetailsCombined(this.id, this.planTypeId, this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          if(this.types?.length > 0) {
            this.planCategoryMapping = data?.plan_category_mapping;
          }
          if(this.companyId == 32) { this.formatAdditionalProperties(data); }
          this.formatPlan(data);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  formatAdditionalProperties(data) {
    if(data?.plan_additional_properties_access){
      this.allowCourseAccess = data?.plan_additional_properties_access

      if(data?.plan_additional_properties?.length > 0) {
        this.selectedCampus = data?.plan_additional_properties?.map(category => {
          if(category.type === "campus") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)

        this.selectedFaculty = data?.plan_additional_properties?.map(category => {
          if(category.type === "faculty") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)

        this.selectedBusinessUnit = data?.plan_additional_properties?.map(category => {
          if(category.type === "bussines_unit") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)

        this.selectedType = data?.plan_additional_properties?.map(category => {
          if(category.type === "type") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)

        this.selectedSegment = data?.plan_additional_properties?.map(category => {
          if(category.type === "segment") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)

        this.selectedBranding = data?.plan_additional_properties?.map(category => {
          if(category.type === "branding") {
            return {
              id: category.id,
              value: category.value
            }
          }
        }).filter(category => category !== undefined)
      }
    }
  }

  formatPlan(data) {
    this.user = data?.user_permissions?.user;
    this.plan = data?.plan?.details;
    this.imgSrc = `${this.apiPath}${this.plan.path}${this.plan.image}`;

    const {
      private: privacy,
      fk_group_id,
      group_id,
      fk_user_id,
      user_id,
      title,
      title_en,
      title_fr,
      title_eu,
      title_ca,
      title_de,
      plan_type_id,
      description,
      description_en,
      description_fr,
      description_eu,
      description_ca,
      description_de,
      plan_date,
      limit_date,
      address,
      seats,
      image,
      meeting_point,
      price,
      medical,
      end_date,
      time_slot,
      event_type_id,
      event_category_id,
      event_subcategory_id,
      zoom_link,
      zoom_link_text,
      payment_type,
      hour_canary,
      guest_member_seats,
      invite_link,
      waiting_list,
      stripe_pay,
      teams_link,
      teams_link_text,
      youtube_link,
      youtube_link_text,
      credits,
      credits_value,
      draft,
      repeat_event,
      parent_event_id,
      featured,
      private_type,
      show_seats,
      external_registration,
      speaker_id,
      request_dni,
      guest_speaker,
      show_price,
      show_attendee,
      show_comments,
      show_description,
      activity_code,
      member_seats,
      guest_seats,
    } = this.plan;

    if(this.types && this.types.length > 0 && this.planCategoryMapping?.length > 0) {
      this.eventCategory = this.planCategoryMapping
        .map(category => {
          if(this.language == 'en') {
            return {
              id: category.plan_category_id,
              name_en: category.name_en,
            }
          } else if(this.language == 'fr') {
            return {
              id: category.plan_category_id,
              name_fr: category.name_fr,
            }
          } else if(this.language == 'eu') {
            return {
              id: category.plan_category_id,
              name_eu: category.name_eu,
            }
          } else if(this.language == 'ca') {
            return {
              id: category.plan_category_id,
              name_ca: category.name_ca,
            }
          } else if(this.language == 'de') {
              return {
                id: category.plan_category_id,
                name_de: category.name_de,
              }
          } else {
            return {
              id: category.plan_category_id,
              name_es: category.name_es,
            }
          }
        })
    } else {
      let categories = this.mapCategories(data?.plan?.categories_mapping);
      this.category_id = categories.map((category) => {
        const { id, name_EN, name_ES, name_FR, name_EU, name_CA, name_DE } =
          category;

        if (this.language == "en") {
          return {
            fk_supercategory_id: id,
            name_EN,
          };
        } else if (this.language == "fr") {
          return {
            fk_supercategory_id: id,
            name_FR,
          };
        } else if (this.language == "eu") {
          return {
            fk_supercategory_id: id,
            name_EU,
          };
        } else if (this.language == "ca") {
          return {
            fk_supercategory_id: id,
            name_CA,
          };
        } else if (this.language == "de") {
          return {
            fk_supercategory_id: id,
            name_DE,
          };
        } else {
          return {
            fk_supercategory_id: id,
            name_ES,
          };
        }
      });
      if (this.category_id && this.allSubcategories) {
        this.subcategories = this.allSubcategories.filter((sc) => {
          let include = false;

          if (this.category_id) {
            this.category_id.forEach((cat: any) => {
              if (cat?.id == sc.category_id || cat?.fk_supercategory_id == sc.category_id) {
                include = true;
              }
            });
          }

          return include;
        });
      }
      this.getSubcategoryMapping(
        this.id,
        this.planTypeId,
        data?.plan?.subcategories_mapping
      );
    }
    if (plan_date) {
      let timezoneOffset = new Date().getTimezoneOffset();
      let pd = (
        moment(plan_date)
          .utc()
          .utcOffset(timezoneOffset)
          .format("YYYY-MM-DD HH:mm")
          .toString() + ":00Z"
      ).replace(" ", "T");
      this.planForm.controls["plan_date"].setValue(pd);
    }
    if (end_date) {
      let timezoneOffset = new Date().getTimezoneOffset();
      let pd = (
        moment(end_date)
          .utc()
          .utcOffset(timezoneOffset)
          .format("YYYY-MM-DD HH:mm")
          .toString() + ":00Z"
      ).replace(" ", "T");
      this.planForm.controls["end_date"].setValue(pd);
    }
    this.planForm.controls["title_es"].setValue(title);
    this.planForm.controls["title_en"].setValue(title_en);
    this.planForm.controls["title_fr"].setValue(title_fr);
    this.planForm.controls["title_eu"].setValue(title_eu);
    this.planForm.controls["title_ca"].setValue(title_ca);
    this.planForm.controls["title_de"].setValue(title_de);
    this.planForm.controls["address"].setValue(
      address && address != "null" ? address : ""
    );
    this.planForm.controls["meeting_point"].setValue(
      meeting_point && meeting_point != "null" ? meeting_point : ""
    );
    this.planAddress = address;
    if(this.types?.length > 0) {
      this.eventType = event_type_id;
    }
    this.getSelectedCity(address);

    if (this.planForm.controls["zoom_link"] && zoom_link) {
      this.planForm.controls["zoom_link"].setValue(zoom_link);
    }
    if (this.planForm.controls["zoom_link_text"] && "zoom_link_text") {
      this.planForm.controls["zoom_link_text"].setValue(zoom_link_text);
    }
    if (this.planForm.controls["teams_link"] && teams_link) {
      this.planForm.controls["teams_link"].setValue(teams_link);
    }
    if (this.planForm.controls["teams_link_text"] && teams_link_text) {
      this.planForm.controls["teams_link_text"].setValue(teams_link_text);
    }
    if (this.planForm.controls["youtube_link"] && youtube_link) {
      this.planForm.controls["youtube_link"].setValue(youtube_link);
    }
    if (this.planForm.controls["youtube_link_text"] && youtube_link_text) {
      this.planForm.controls["youtube_link_text"].setValue(youtube_link_text);
    }
    this.seats = seats == 0 ? "" : seats;
    let memberseats = member_seats == 0 ? "" : member_seats;
    let guestseats = guest_seats == 0 ? "" : guest_seats;
    let totalseats = seats == 0 ? "" : seats;
    this.planForm.controls["seats"].setValue(totalseats);
    this.planForm.controls["member_seats"].setValue(memberseats);
    this.planForm.controls["guest_seats"].setValue(guestseats);

    if (price && parseInt(price) > 0) {
      this.price = price;
      this.withFee = true;
      if (payment_type > 0) {
        this.selectedPaymentType = payment_type;
      }
    } else {
      this.price = "";
    }
    if(this.planForm.controls["price"] && this.withFee) {
      this.planForm.controls["price"].setValue(this.price);
    }
    if (this.planForm.controls["zoom_link"]) {
      this.planForm.controls["zoom_link"].setValue(zoom_link);
    }
    this.showInvitationLink =
      this.invitationLinkActive && invite_link == 1 ? true : false;
    this.showGuestMemberSeat =
      this.guestMemberSeatActive && guest_member_seats == 1 ? true : false;
    this.showSeats =
      this.guestMemberSeatActive && show_seats == 1 ? true : false;
    this.displayCanaryTime =
      this.showCanaryTime && hour_canary == 1 ? true : false;
    this.waitingListEnabled =
      this.waitingListActive && waiting_list == 1 ? true : false;
    this.isStripePayment =
      this.activityFeeEnabled && stripe_pay == 1 ? true : false;
    this.credits = credits == 1 ? true : false;
    this.creditsValue = credits_value;
    this.featured = featured == 1 ? true : false;
    (this.isExternalRegistration = external_registration == 1 ? true : false),
      (this.requestDNI = request_dni == 1 ? true : false);
    this.planForm.controls["descriptionEs"].setValue(description);
    this.planForm.controls["descriptionEn"].setValue(description_en);
    this.planForm.controls["descriptionFr"].setValue(description_fr);
    this.planForm.controls["descriptionEu"].setValue(description_eu);
    this.planForm.controls["descriptionCa"].setValue(description_ca);
    this.planForm.controls["descriptionDe"].setValue(description_de);
    this.planType = privacy ? 1 : 0;
    this.privateType = private_type == 1 ? 1 : 0;
    this.createdBy = plan_type_id || 4;
    this.draftStatus = draft;
    this.selectedClub = fk_group_id ? fk_group_id : "";
    if (this.hasSubgroups) {
      let club_match = this.clubList.some((a) => a.id == fk_group_id);
      if (!club_match && this.allSubgroups) {
        let subgroup_row = this.allSubgroups.filter((subgroup) => {
          return subgroup.id == fk_group_id;
        });
        if (subgroup_row && subgroup_row[0]) {
          this.selectedClub = subgroup_row[0].parent_group_id;
          if (this.selectedClub) {
            this.subgroups = this.allSubgroups.filter((subgroup) => {
              return subgroup.parent_group_id == this.selectedClub;
            });
            this.selectedSubgroup = fk_group_id;
          }
        }
      }
    }
    this.imageFile = image;
    this.isShowPrice = show_price == 1 ? true : false;
    this.isShowAttendee = show_attendee == 1 ? true : false;
    this.isShowComments = show_comments == 1 ? true : false;
    this.isShowDescription = show_description == 1 ? true : false;
    if(this.hasActivityCodeActivated) {
      this.activityCode = activity_code
    }
  }

  mapCategories(category_mapping) {
    let categories = category_mapping?.map((cat) => {
      let cat_row = this.CompanySupercategories?.filter((c) => {
        return c.fk_supercategory_id == cat.fk_supercategory_id;
      });
      let categ = cat_row?.length > 0 ? cat_row[0] : {};
      return {
        ...cat,
        id: categ.fk_supercategory_id,
        name_EN: categ?.name_EN,
        name_ES: categ?.name_ES,
        name_FR: categ?.name_FR,
        name_EU: categ?.name_EU,
        name_CA: categ?.name_CA,
        name_DE: categ?.name_DE,
      };
    });

    return categories;
  }

  getSubcategoryMapping(id, plan_type_id, subcategories_mapping) {
    let subcategories = this.subcategories;
    if (subcategories) {
      let subcats = [];
      if (this.allSubcategories) {
        subcats = this.allSubcategories.filter((sc) => {
          let match = subcategories_mapping.some(
            (a) => a.subcategory_id === sc.id
          );
          return match;
        });
      }

      this.selectedSubcategory = subcats.map((subcat) => {
        const { id, name_EN, name_ES, name_FR, name_EU, name_CA, name_DE } =
          subcat;
        if (this.language == "en") {
          return {
            id,
            name_EN,
          };
        } else if (this.language == "fr") {
          return {
            id,
            name_FR,
          };
        } else if (this.language == "eu") {
          return {
            id,
            name_EU,
          };
        } else if (this.language == "ca") {
          return {
            id,
            name_CA,
          };
        } else if (this.language == "de") {
          return {
            id,
            name_DE,
          };
        } else {
          return {
            id,
            name_ES,
          };
        }
      });
    }
  }

  getSelectedCity(address) {
    if (this.cities) {
      if (address && !this.canAssignMultipleCities) {
        let match = this.cities.some((a) => a.city === address);
        this.selectedCity = match ? address : "";
      } else if (address && this.canAssignMultipleCities) {
        this.selectedCity =
          this.cities &&
          this.cities.filter((city) => {
            return city.city == address;
          });
      } else if (!address && this.canAssignMultipleCities) {
        this.getActivityCities();
      }
    }
  }

  getActivityCities() {
    this._plansService.getActivityCities(this.id, this.planTypeId).subscribe(
      (response) => {
        let cities = response.activity_cities;
        let act_cities: any[] = [];
        if (cities && cities.length > 0) {
          cities.forEach((ct) => {
            act_cities.push({
              id: ct.city_id,
              city: ct.city,
            });
          });
        }
        this.selectedCity = act_cities;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  initializeButtonGroup() {
    let list: any[] = [];

    this.languages?.forEach((language) => {
      list.push({
        id: language.id,
        value: language.code,
        text: this.getLanguageName(language),
        selected: language.default ? true : false,
        code: language.code,
      });
    });

    this.buttonList = list;
  }

  getLanguageName(language) {
    return this.language == "en"
      ? language.name_EN
      : this.language == "fr"
      ? language.name_FR
      : this.language == "eu"
      ? language.name_EU
      : this.language == "ca"
      ? language.name_CA
      : this.language == "de"
      ? language.name_DE
      : language.name_ES;
  }

  closeLanguageNote() {
    this._localService.setLocalStorage("showLanguageNote", new Date());
    this.showLanguageNote = false;
  }

  handleChangeLanguageFilter(event) {
    this.buttonList?.forEach((item) => {
      if (item.code == event.code) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.selectedLanguage = event.code;
    this.selectedLanguageChanged = true;
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

  checkDescription() {
    let result = false;
    let code =
      this.defaultLanguage?.length > 0 ? this.defaultLanguage[0].code : "es";
    switch (code) {
      case "ca":
        this.description = this.planForm.get("descriptionCa")?.value;
        result = !this.planForm.get("descriptionCa")?.value;
        break;
      case "de":
        this.description = this.planForm.get("descriptionDe")?.value;
        result = !this.planForm.get("descriptionDe")?.value;
        break;
      case "es":
        this.description = this.planForm.get("descriptionEs")?.value;
        result = !this.planForm.get("descriptionEs")?.value;
        break;
      case "eu":
        this.description = this.planForm.get("descriptionEu")?.value;
        result = !this.planForm.get("descriptionEu")?.value;
        break;
      case "fr":
        this.description = this.planForm.get("descriptionFr")?.value;
        result = !this.planForm.get("descriptionFr")?.value;
        break;
      default:
        this.description = this.planForm.get("descriptionEs")?.value;
        result = !this.planForm.get("descriptionEs")?.value;
        break;
    }

    return result;
  }

  setDescription() {
    if (this.editorToUse == "tinymce" && this.editor) {
      if (this.planForm.controls["descriptionEs"]) {
        this.planForm.controls["descriptionEs"].setValue(
          this.editor.getContent()
        );
      }
      if (this.planForm.controls["descriptionEn"]) {
        this.planForm.controls["descriptionEn"].setValue(
          this.editor.getContent()
        );
      }
      if (this.planForm.controls["descriptionFr"]) {
        this.planForm.controls["descriptionFr"].setValue(
          this.editor.getContent()
        );
      }
      if (this.planForm.controls["description_eu"]) {
        this.planForm.controls["description_eu"].setValue(
          this.editor.getContent()
        );
      }
      if (this.planForm.controls["descriptionCa"]) {
        this.planForm.controls["descriptionCa"].setValue(
          this.editor.getContent()
        );
      }
      if (this.planForm.controls["descriptionDe"]) {
        this.planForm.controls["descriptionDe"].setValue(
          this.editor.getContent()
        );
      }
    }

    if (this.planForm.controls["descriptionEs"]) {
      this.planForm.controls["descriptionEs"].setValue(
        this.planForm
          .get("descriptionEs")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }

    if (this.planForm.controls["descriptionEn"]) {
      this.planForm.controls["descriptionEn"].setValue(
        this.planForm
          .get("descriptionEn")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }

    if (this.planForm.controls["descriptionFr"]) {
      this.planForm.controls["descriptionFr"].setValue(
        this.planForm
          .get("descriptionFr")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }

    if (this.planForm.controls["descriptionEu"]) {
      this.planForm.controls["descriptionEu"].setValue(
        this.planForm
          .get("descriptionEu")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }

    if (this.planForm.controls["descriptionCa"]) {
      this.planForm.controls["descriptionCa"].setValue(
        this.planForm
          .get("descriptionCa")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }

    if (this.planForm.controls["descriptionDe"]) {
      this.planForm.controls["descriptionDe"].setValue(
        this.planForm
          .get("descriptionDe")
          ?.value.replace("*|MC:SUBJECT|*", "")
          .replace("<!--*|IF:MC_PREVIEW_TEXT|*-->", "")
          .replace(
            '<!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none;visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->',
            ""
          )
          .replace("<!--*|END:IF|*-->", "")
      );
    }
  }

  public getTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();

    return timestamp;
  }

  savePlan() {
    this.errorMessage = "";
    this.formSubmitted = true;
    this.issaving = true;

    let start_date = moment(this.planForm.get("plan_date")?.value).format(
      "YYYY-MM-DD"
    );
    let start_time = moment(this.planForm.get("plan_date")?.value).format(
      "HH:mm"
    );
    start_date = start_date + " " + start_time;

    let start_date_time = new Date(start_date).getTime();
    let today_date_time = new Date().getTime();
    if (start_date_time < today_date_time) {
      this.showError = true;
      this.startDateTimeError = true;
      this.open(
        this._translateService.instant("dialog.lessthantodaydate"),
        ""
      );
      this.issaving = false;
      setTimeout(() => {
        this.scrollToTop();
      }, 1000);
      return false;
    } else {
      this.showError = false;
      this.startDateTimeError = false;
    }

    let end_date;
    if (this.planForm.get("end_date")?.value) {
      let end_date = moment(this.planForm.get("end_date")?.value).format(
        "YYYY-MM-DD"
      );
      let end_time = moment(this.planForm.get("end_date")?.value).format(
        "HH:mm"
      );
      end_date = end_date + " " + end_time;
      this.endDate = end_date;

      let end_date_time = new Date(end_date).getTime();
      if (end_date_time <= start_date_time) {
        this.showError = true;
        this.endDateTimeError = true;
        this.open(
          this._translateService.instant("dialog.dateerror"),
          ""
        );
        this.issaving = false;
        setTimeout(() => {
          this.scrollToTop();
        }, 1000);
        return false;
      } else {
        this.showError = false;
        this.endDateTimeError = false;
      }
    }

    let code = this.defaultLanguage[0].code;
    this.title = this.planForm.get("title_" + code)?.value;
    if (
      this.planForm.get("title_" + code)?.errors ||
      this.planForm.get("plan_date")?.errors ||
      (this.guestMemberSeatActive && (this.membersLimitGreaterThanSeats || this.guestsLimitGreaterThanSeats)) ||
      this.checkDescription()
    ) {
      this.issaving = false;
      this.scrollToTop();
      return false;
    }

    this.setDescription();

    if (this.hasTypeOfActivity) {
      if (this.showProlongedActivitySection) {
        if (!this.prolongedDaysNumber) {
          this.issaving = false;
          this.scrollToTop();
          return false;
        }

        if (this.prolongedActivities) {
          let incomplete_loc = this.prolongedActivities.filter((a) => {
            return !a.location;
          });
          if (incomplete_loc && incomplete_loc[0]) {
            this.issaving = false;
            this.scrollToTop();
            return false;
          }
        }
      }
    }

    if (!this.imgSrc) {
      this.noImage = true;
      this.showError = true;
      this.open(
        this._translateService.instant("dialog.pleaseuploadanimage"),
        ""
      );
      this.issaving = false;
      this.scrollToTop();
      return false;
    } else {
      this.noImage = false;
      this.showError = false;
      this.errorMessage = "";
    }

    let require_approval = false;
    if (
      this.hasClubActivitiesApprovalSettings &&
      this.hasCustomMemberTypeSettings &&
      this.id == 4 &&
      this.clubActivityApproveRoles &&
      this.clubActivityApproveRoles.length > 0
    ) {
      let custom_member_type_id = this.user
        ? this.user.custom_member_type_id
        : 0;
      this.clubActivityApproveRoles.forEach((caar) => {
        if (caar.id == custom_member_type_id) {
          require_approval = true;
        }
      });
    }

    this.issaving = true;
    this.showError = false;

    Object.assign(this.plan, this.planForm.value);
    this.plan.category_id = this.category_id;
    this.plan.subcategory_id = this.selectedSubcategory || "";
    this.plan.company_id = this.company_id;
    this.plan.time_slot = start_time + ":00";
    this.plan.medical = false;
    this.plan.privacy = this.planType === 0 ? 0 : 1;
    this.plan.private_type =
      this.planType == 1 ? (this.privateType == 1 ? 1 : 0) : 0;
    this.plan.fk_group_id =
      this.hasSubgroups && this.selectedSubgroup
        ? this.selectedSubgroup
        : this.group_id || this.selectedClub;
    this.plan.price = this.planForm.get("price")?.value || this.price;

    this.plan.description = this.description;
    this.plan.description_es = this.descriptionEs || this.description;
    this.plan.description_en = this.descriptionEn || this.description;
    this.plan.description_fr = this.descriptionFr || this.description;
    this.plan.description_eu = this.descriptionEu || this.description;
    this.plan.description_ca = this.descriptionCa || this.description;
    this.plan.description_de = this.descriptionDe || this.description;
    if (this.activityFeeEnabled && this.withFee && this.selectedPaymentType) {
      this.plan.payment_type = this.selectedPaymentType;
    }
    if (this.cities && this.cities.length > 0 && this.selectedCity) {
      if (this.canAssignMultipleCities) {
        if (this.selectedCity.length == 1) {
          this.plan["address"] = this.canAssignMultipleCities
            ? this.selectedCity[0].city
            : this.selectedCity;
        } else if (
          this.selectedCity.length > 1 &&
          this.canAssignMultipleCities
        ) {
          this.plan["city_id"] = this.selectedCity;
        }
      } else {
        this.plan["address"] = this.selectedCity;
      }
    }

    this.plan["multiple_cities"] =
      this.canAssignMultipleCities && this.selectedCity.length > 1 ? 1 : 0;
    this.plan["hour_canary"] =
      this.showCanaryTime && this.displayCanaryTime ? 1 : 0;
    this.plan["guest_member_seats"] =
      this.guestMemberSeatActive && this.showGuestMemberSeat ? 1 : 0;
    this.plan["show_seats"] =
      this.guestMemberSeatActive && this.showSeats ? 1 : 0;
    this.plan["invite_link"] =
      this.invitationLinkActive && this.showInvitationLink ? 1 : 0;
    this.plan["waiting_list"] =
      this.waitingListActive && this.waitingListEnabled ? 1 : 0;
    this.plan["credits"] = this.credits ? 1 : 0;
    this.plan["credits_value"] = this.creditsValue || 0;
    this.plan["featured"] = this.featured ? 1 : 0;
    this.plan["require_approval"] = require_approval ? 1 : 0;
    this.plan["external_registration"] = this.isExternalRegistration ? 1 : 0;
    this.plan["request_dni"] = this.requestDNI ? 1 : 0;
    this.plan["school_of_life"] = this.isUESchoolOfLife ? 1 : 0;
    this.plan["member_seats"] = this.guestMemberSeatActive && this.planForm.get("member_seats")?.value ? this.planForm.get("member_seats")?.value : null;
    this.plan["guest_seats"] = this.guestMemberSeatActive && this.planForm.get("guest_seats")?.value ? this.planForm.get("guest_seats")?.value : null;

    if(this.companyId == 32) {
      this.plan['additional_properties_course_access'] = this.allowCourseAccess == true ? '1' : '0',
      this.plan['additional_properties_campus_ids'] = this.selectedCampus?.length > 0 ? this.selectedCampus?.map( (data) => { return data.id }).join() : '';
      this.plan['additional_properties_faculty_ids'] = this.selectedFaculty?.length > 0 ? this.selectedFaculty?.map( (data) => { return data.id }).join() : '';
      this.plan['additional_properties_business_unit_ids'] = this.selectedBusinessUnit?.length > 0 ? this.selectedBusinessUnit?.map( (data) => { return data.id }).join() : '';
      this.plan['additional_properties_type_ids'] = this.selectedType?.length > 0 ? this.selectedType?.map( (data) => { return data.id }).join() : '';
      this.plan['additional_properties_segment_ids'] = this.selectedSegment?.length > 0 ? this.selectedSegment?.map( (data) => { return data.id }).join() : '';
      this.plan['additional_properties_branding_ids'] = this.selectedBranding?.length > 0 ? this.selectedBranding?.map( (data) => { return data.id }).join() : '';
    }

    if(this.hasActivityCodeActivated) {
      this.plan["activity_code"] = this.activityCode || "";
    }

    let publish = 1;
    if (this.id > 0) {
      this.plan["publish"] = publish || 1;
      this.plan["isShowAttendee"] = this.isShowAttendee ? 1 : 0;
      this.plan["isShowComments"] = this.isShowComments ? 1 : 0;
      this.plan["isShowDescription"] = this.isShowDescription ? 1 : 0;
      this.plan["isShowPrice"] = this.isShowPrice ? 1 : 0;
    }

    this.plan["speaker_id"] =
      this.hasSpeaker && this.selectedSpeaker && this.selectedSpeaker.length > 0
        ? this.selectedSpeaker[0].id
        : null;
    this.plan["guest_speaker"] = this.guestSpeaker ? this.guestSpeaker : null;
    if (this.activityFeeEnabled) {
      this.plan["stripe_pay"] = this.isStripePayment ? 1 : 0;
    }
    if (this.companyId == 12) {
      this.plan.netcultura = this.netcultura ? 1 : 0;
    }
    this.plan.plan_date = start_date;
    if (this.planForm.get("end_date")?.value) {
      this.plan.end_datetime = end_date;
      this.plan.end_date = this.endDate;
    }
    if (this.eventType) {
      this.plan.event_type_id = this.eventType;
      this.plan.event_category_id = this.eventCategory?.length > 0 ? this.eventCategory[0].id : 0;
      this.plan.event_subcategory_id = this.eventSubcategory?.length > 0 ? this.eventSubcategory[0].id : 0;
      this.plan.netcultura = this.netcultura ? 1 : 0;
      if(this.subcategories?.length > 0 && this.eventSubcategory?.length > 0) {
        this.subcategories.forEach((sc) => {
          if (sc.id == this.eventSubcategory[0].id) {
            this.plan.privacy = sc.private == 1 ? 1 : 0;
          }
        });
      }

      this.plan.kcn_event_category_id = this.eventCategory
      if(this.eventSubcategory?.length > 0) {
        this.plan.kcn_event_subcategory_id = this.eventSubcategory || ''
        if(this.subcategories) {
          this.subcategories.forEach(sc => {
            let match = this.eventSubcategory.some(a => a.id === sc.id)
            if(match) {
              this.plan.privacy = sc.private == 1 ? 1 : 0
            }
          })
        }
      }

      let slug = "";
      let new_slug = "";
      let updated_slug = "";
      if (this.planForm.get("title_" + code)?.value) {
        slug = this.planForm
          .get("title_" + code)
          ?.value.toString()
          .toLowerCase()
          .replace(/ /g, "-");
        if (this.slugs) {
          let ctr = 0;
          this.slugs.forEach((s) => {
            if (s.slug == slug) {
              ctr++;
            }
          });
          if (ctr > 0) {
            new_slug = slug + "-" + (ctr + 1);
          } else {
            new_slug = slug;
          }
        }
        if (new_slug) {
          updated_slug = new_slug;
          this.slugs.forEach((s) => {
            if (s.slug == new_slug) {
              updated_slug = new_slug + "-1";
            }
          });
        }
        this.plan.slug = updated_slug;
      }
    }
    if (this.eventType) {
      if (this.eventType && this.eventCategory) {
      } else {
        this.scrollToTop();
        this.issaving = false;
        return false;
      }
    }

    let activities;
    if (
      this.hasTypeOfActivity &&
      this.prolongedActivities &&
      this.prolongedActivities.length > 0
    ) {
      activities = this.prolongedActivities;
    }

    if (this.id > 0) {
      if (this.cities && this.cities.length > 0 && this.selectedCity) {
        if (this.canAssignMultipleCities) {
          if (this.selectedCity.length == 1) {
            this.plan["address"] = this.canAssignMultipleCities
              ? this.selectedCity[0].city
              : this.selectedCity;
          } else if (
            this.selectedCity.length > 1 &&
            this.canAssignMultipleCities
          ) {
            this.plan["city_id"] = this.selectedCity;
          }
        } else {
          this.plan["address"] = this.selectedCity;
        }
      }
    }

    if (this.id == 4) {
      if (!this.types || (this.types && this.types.length == 0)) {
        if (!this.selectedClub) {
          this.scrollToTop();
          this.issaving = false;
          return false;
        }
      }
    }

    if (this.id > 0) {
      //   Edit
      this._plansService
        .updatePlan(
          this.companyId,
          this.userId,
          this.id,
          this.planTypeId,
          this.plan,
          this.file,
          this.imageFile,
          this.typeOfActivity ? this.typeOfActivity : 0,
          this.prolongedDaysNumber ? this.prolongedDaysNumber : 0,
          activities ? activities : "",
          publish,
          this.hasActivityCodeActivated,
        )
        .subscribe(
          (response) => {
            this.open(
              this._translateService.instant("dialog.savedsuccessfully"),
              ""
            );
            this._router.navigate([
              `/plans/details/${this.id}/${this.planTypeId}`,
            ]);
          },
          (error) => {
            this.showError = true;
            this.issaving = false;
            this.errorMessage = error?.message;
          }
        );
    } else {
      // Create
      this._plansService
        .createPlan(
          this.companyId,
          this.userId,
          this.planTypeId,
          this.plan,
          this.file,
          this.imageFile,
          this.zoomApiKey,
          this.zoomApiSecret,
          this.zoomStartUrl,
          this.zoomJoinUrl,
          this.zoomMeetingId,
          this.zoomPassword,
          this.typeOfActivity ? this.typeOfActivity : 0,
          this.prolongedDaysNumber ? this.prolongedDaysNumber : 0,
          activities ? activities : "",
          this.isShowAttendee ? 1 : 0,
          this.isShowComments ? 1 : 0,
          this.isShowDescription ? 1 : 0,
          this.isShowPrice ? 1 : 0,
          0,
          this.hasActivityCodeActivated,
          this.allowCourseAccess,
        )
        .subscribe(
          (response) => {
            if (response) {
              this.setCurrentPlan(response, require_approval);
            } else {
              this.showError = true;
              this.issaving = false;
            }
          },
          (error) => {
            this.showError = true;
            this.issaving = false;
            this.errorMessage = error?.message;
          }
        );
    }
  }

  setCurrentPlan(response, require_approval: boolean = false) {
    this.planUrl = `/plans/details/${response.id}/${this.planTypeId}`;
    this.createdPlanId = response.id;
    this._localService.setLocalStorage(environment.lsplanId, response.id);
    if (this.id == 4 && response.slug) {
      this.planSlug = response.slug;
    }
    this.showError = false;

    this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
    this.redirectToDetailsPage(require_approval);
  }

  redirectToDetailsPage(require_approval: boolean = false) {
    if (
      this.hasClubActivitiesApprovalSettings &&
      require_approval &&
      this.id == 4
    ) {
      // Send notification to admins
      let payload = {
        activity_id: this.createdPlanId,
        company_id: this.companyId,
      };
      this._plansService.createApprovalNotification(payload).subscribe(
        (response: any) => {
          this.showDoneForApprovalModal(this.createdPlanId);
        },
        (error) => {}
      );
    } else {
      this._router.navigate([this.planUrl]);
    }
  }

  showDoneForApprovalModal(id: number = 0) {
    this.showConfirmationModal = false;
    this.planId = id;
    this.confirmDoneItemTitle = this._translateService.instant(
      "create-content.done"
    );
    this.confirmDoneItemDescription = this._translateService.instant(
      "create-content.desc"
    );
    this.acceptText = "OK";
    setTimeout(() => (this.showConfirmationModal = true));
  }

  confirm() {
    this.planUrl = `/plans/details/${this.planId}/${this.planTypeId}`;
    this._router.navigate([this.planUrl]);
  }

  changePlanType(event) {
    this.initialLoad = false;
  }

  changePrivateType(event) {
    this.initialLoad = false;
  }

  changePlanTypeId(event) {
    if (event) {
      this.createdBy = event.target.value;
      if (this.createdBy == 5) {
        this.initialLoad = true;
        this.planType = 0;
      }
      this._router.navigate([`/plans/create/0/${event.target.value}`]);
    }
  }

  changeEventType(event) {
    this.initialLoad = false;
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

  changeTab(event) {}

  changeEventCategory(event) {
    this.selectedClub = "";
    this.eventSubcategory = "";

    this.planForm.controls["seats"].setValue("");

    let admin1 = false;
    let admin2 = false;
    let superAdmin = false;
    if (this.roles) {
      this.roles.forEach((role) => {
        if (role.role == "Admin 1") {
          admin1 = true;
        } else if (role.role == "Admin 2") {
          admin2 = true;
        } else if (role.role == "Super Admin") {
          superAdmin = true;
        }
      });
    }

    let subcats = this.subcategories.filter((category) => {
      return category.category_id == event.target.value;
    });
    let ctr = 0;
    this.subcats = subcats.filter((category) => {
      let include = false;

      if (admin1) {
        if (ctr == 0) {
          include = true;
        }
      }

      if (admin2) {
        if (ctr > 0) {
          include = true;
        }
      }

      if (superAdmin) {
        include = true;
      }

      ctr++;
      return include;
    });
  }

  changeEventSubcategory(event) {
    this.selectedClub = "";
    let subcategory_id = event.target.value;

    let sc = this.subcategories.filter((s) => {
      return s.id == subcategory_id;
    });

    if (sc && sc[0]) {
      if (sc[0].name_es == "Speed") {
        this.planForm.controls["seats"].setValue(55);
      } else {
        this.planForm.controls["seats"].setValue("");
      }
    } else {
      this.planForm.controls["seats"].setValue("");
    }

    let admin1 = false;
    let admin2 = false;
    let superAdmin = false;
    if (this.roles) {
      this.roles.forEach((role) => {
        if (role.role == "Admin 1") {
          admin1 = true;
        } else if (role.role == "Admin 2") {
          admin2 = true;
        } else if (role.role == "Super Admin") {
          superAdmin = true;
        }
      });
    }

    let group_id = 0;
    if (parseInt(subcategory_id) > 0) {
      if (this.subcategories) {
        this.subcategories.forEach((subcategory) => {
          if (subcategory.id == subcategory_id) {
            if (subcategory.group_id) {
              group_id = subcategory.group_id;
            }
          }
        });
      }
    }

    if (group_id > 0) {
      // Show only subcategory groups
      if (this.allClubs) {
        this.clubList = this.allClubs.filter((club) => {
          return club.id == group_id;
        });
        if (this.clubList) {
          this.selectedClub = this.clubList[0].id;
        }
      }
    } else {
      // Show area groups
      this.clubList = this.allClubs.filter((club) => {
        let include = false;

        let match = this.subcategories.some((a) => a.group_id === club.id);
        if (!match) {
          if (superAdmin) {
            include = true;
          } else if (admin1) {
            if (club.fk_user_id == this.user.id) {
              include = true;
            }
          }
        }

        return include;
      });
      if (admin1 && this.clubList) {
        this.selectedClub = this.clubList[0].id;
      }
    }
  }

  changeTypeOfActivity(event) {
    let selected = event.target.value;

    let selected_multiple = 0;
    if (this.typeOfActivities && this.typeOfActivities.length > 0) {
      let selected_row = this.typeOfActivities.filter((t) => {
        return t.id == selected;
      });
      if (selected_row && selected_row[0]) {
        selected_multiple = selected_row[0].multiple;
      }
    }

    if (selected_multiple == 1) {
      this.showProlongedActivitySection = true;
      this.prolongedActivities = [];
    }
  }

  onProlongedDaysNumberChange(event) {
    this.prolongedActivities = [];
    let no = 0;
    if (event && event.target.value && parseInt(event.target.value) > 0) {
      no = parseInt(event.target.value);
    }

    if (no && no > 0) {
      for (var i = 0; i < no; i++) {
        this.prolongedActivities.push({
          number: i + 1,
          location: "",
        });
      }
    }
  }

  updateActivityDayLocation(event, activity) {
    if (this.prolongedActivities) {
      this.prolongedActivities.forEach((a) => {
        if (a.number == activity.number) {
          a.location = event.target.value;
        }
      });
    }
  }

  getClubActivityApproveRoles() {
    // this._userService.getClubActivityApproveRoles(this.companyId).subscribe(
    //   async (response) => {
    //     let user_roles = response.create_plan_roles;
    //     let selected_user_roles = [];
    //     if (user_roles) {
    //       user_roles.forEach((r) => {
    //         let userRole =
    //           this.userRoles &&
    //           this.userRoles.filter((ur) => {
    //             return ur.id == r.role_id;
    //           });
    //         if (userRole && userRole[0]) {
    //           selected_user_roles.push(userRole[0]);
    //         }
    //       });
    //     }
    //     this.clubActivityApproveRoles = selected_user_roles;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  fileChangeEvent(event: any): void {
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
      this.imgSrc = this.croppedImage = event.base64;
      this.file = {
        name: "image",
        image: base64ToFile(event.base64), //event.file
      };
      this.noImage = false;
      this.showError = false;
      this.errorMessage = "";
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

  onPriceChange(event): void {
    let priceValue = event?.target?.value;
    this.price = priceValue;
    this.withFee = priceValue && parseInt(priceValue) > 0 ? true : false;
  }

  getEventType(id) {
    let type_en = "";
    let type = this.types.filter((e) => {
      return e.id == id;
    });
    if (type && type[0]) {
      type_en = type[0].type_en;
    }
    return type_en;
  }

  showAddressMeetingPoint() {
    let show = false;

    if (
      (this.hasTypeOfActivity && !this.prolongedDaysNumber) ||
      (!this.hasTypeOfActivity &&
        ((this.types?.length == 0 &&
          this.planForm.controls["zoom_link"] &&
          !this.planForm.controls["zoom_link"].value) ||
          (this.types?.length > 0 &&
            this.getEventType(this.eventType) != "Online")))
    ) {
      show = true;
    }

    return show;
  }

  handleClubChange(event) {
    if (this.hasSubgroups && this.allSubgroups) {
      this.subgroups = this.allSubgroups.filter((group) => {
        return group.parent_group_id == event.target.value;
      });
      this.selectedSubgroup = "";
    }
  }

  changeFileTypeSelected(type) {
    this.fileTypeSelected = type;
  }

  handleChangeCategory(event) {
    let subcats = [];
    if ((event.id || event.fk_supercategory_id) && this.allSubcategories) {
      subcats = this.allSubcategories.filter((sc) => {
        return (
          sc.category_id == event.id ||
          sc.category_id == event.fk_supercategory_id
        );
      });
    }

    this.subcategories = subcats;
  }

  handleCreditsChange(event) {
    if (this.companyId == 32 && this.hasFeatured) {
      this.featured = event.target.checked ? true : false;
    }
  }

  getFeaturedTitle() {
    return this.language == "en"
      ? this.featuredTextValueEn
        ? this.featuredTextValueEn || this.featuredTextValue
        : this.featuredTextValue
      : this.language == "fr"
      ? this.featuredTextValueFr
        ? this.featuredTextValueFr || this.featuredTextValue
        : this.featuredTextValue
      : this.language == "eu"
      ? this.featuredTextValueEu
        ? this.featuredTextValueEu || this.featuredTextValue
        : this.featuredTextValue
      : this.language == "ca"
      ? this.featuredTextValueCa
        ? this.featuredTextValueCa || this.featuredTextValue
        : this.featuredTextValue
      : this.language == "de"
      ? this.featuredTextValueDe
        ? this.featuredTextValueDe || this.featuredTextValue
        : this.featuredTextValue
      : this.featuredTextValue;
  }

  setEditor(editor) {
    this.editorToUse = editor;
  }

  setTinymceValue() {
    if (this.description) {
      this.editor.setContent(this.description);
    }

    if (this.descriptionEn) {
      this.editor.setContent(this.descriptionEn);
    }

    if (this.descriptionFr) {
      this.editor.setContent(this.descriptionFr);
    }

    if (this.descriptionEu) {
      this.editor.setContent(this.descriptionEu);
    }

    if (this.descriptionCa) {
      this.editor.setContent(this.descriptionCa);
    }

    if (this.descriptionDe) {
      this.editor.setContent(this.descriptionDe);
    }
  }

  onSpeakerSelect(event) {}

  calculateLimit(mode) {
    let total_seats = parseInt(this.planForm.controls["seats"]?.value?.toString()) || 0;
    let member_seats = parseInt(this.planForm.controls["member_seats"]?.value?.toString()) || 0;
    let guest_seats = parseInt(this.planForm.controls["guest_seats"]?.value?.toString()) || 0;
    this.membersLimitGreaterThanSeats = false;
    this.guestsLimitGreaterThanSeats = false;

    switch(mode) {
      case 'members':
        if(member_seats > (total_seats - guest_seats)) {
          this.membersLimitGreaterThanSeats = true;
          this.open(this._translateService.instant('plan-create.limitgreaterthanseats'), '');
        }
        break;
      case 'guests':
        if(guest_seats > (total_seats - member_seats)) {
          this.guestsLimitGreaterThanSeats = true;
          this.open(this._translateService.instant('plan-create.limitgreaterthanseats'), '');
        }
        break;
      case 'seats': 
        this.membersLimitGreaterThanSeats = member_seats > (total_seats - guest_seats) ? true : false;
        this.guestsLimitGreaterThanSeats = guest_seats > (total_seats - member_seats) ? true : false;
        break;
    }
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