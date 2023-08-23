import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { environment } from "@env/environment";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "src/app/core/services";
import {
  LocalService,
  CompanyService,
  UserService,
} from "src/app/share/services";
import { CompanyLogoComponent } from "@share/components";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { initFlowbite } from "flowbite";
import { COMPANY_IMAGE_URL } from "@lib/api-constants";
import { Subject, takeUntil } from "rxjs";
import { param } from "@lib/utils/param/param.utils";
import Validation from "@lib/utils/validation/validation.utils";
import get from "lodash/get";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    FontAwesomeModule,
    RouterModule,
    CompanyLogoComponent,
  ],
  templateUrl: "./signup.component.html",
})
export class SignupComponent {
  private destroy$ = new Subject<void>();

  getStartedForm: FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });
  language: any;
  companyId: any;
  otherSettings: any = [];
  hasPaidRegistration: boolean = false;
  membershipFee: any = "";
  dashboardDetails: any;
  companies: any;

  dropdownSettings = {};
  allRegistrationFields: any = [];
  registrationFields: any = [];
  allRegistrationFieldMapping: any = [];
  selectedFields: any = [];
  formTemplate: any;
  showDefaultRegistrationFields: boolean = false;
  selectedBusinessCategories: any;
  logoFile: any;
  businessCategories: any;
  hasRegistrationFields: boolean = false;
  hasCustomMemberTypeSettings: boolean = false;
  memberTypes: any;
  primaryColor: any;
  buttonColor: any;

  features: any;
  subfeatures: any;
  countryDropdown: any;
  countries: any;
  userEmailDomain: any;

  hasCustomMemberTypeExpiration: boolean = false;

  sectionFields: any = [];
  isloading: boolean = true;
  hasCompanyInvoiceSettings: boolean = false;
  useCompanyInvoice: boolean = false;
  formSubmitted: boolean = false;
  invalidEmail: boolean = false;
  errors: any = {};

  showLogo: boolean = false;
  agreeTerms: boolean = false;
  termsAndConditions: any = "";
  privacyPolicy: any = "";
  mode;
  modal;
  confirm_email: any = 0;

  signupMode: any = "";
  companyName: any = "";
  registrationUserId: any;
  planTypeChoice: any = "monthly";

  allRegistrationText: any = [];
  registrationText: any = [];
  canEditRegistrationTexts: boolean = false;
  hasConfirmPassword: boolean = false;

  hasError: boolean = false;
  privacyPolicyURL: any;
  privacyPolicyURLEn: any;
  privacyPolicyURLFr: any;
  privacyPolicyURLEu: any;
  privacyPolicyURLCa: any;
  privacyPolicyURLDe: any;
  canShowPrivacyPolicy: boolean = false;
  logoSource: any;
  fieldTextType: boolean = false;
  fieldConfirmTextType: boolean = false;
  eyeIcon = faEye;
  eyeSlashIcon = faEyeSlash;
  checkCircleIcon = faCheckCircle;
  timesCircleIcon = faTimesCircle;

  constructor(
    private _router: Router,
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _snackBar: MatSnackBar,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService
  ) {}

  async ngOnInit() {
    this.signupMode = param.getParam("mode") ? param.getParam("mode") : "";
    this.language = this._localService.getLocalStorage(environment.lslang);
    if (!this.language) {
      this.language = "es";
    }
    this._translateService.use(this.language);

    this.companies = get(
      await this._companyService.getCompanies().toPromise(),
      "companies"
    );
    if (this.companies) {
      let company = this._companyService.getCompany(this.companies);
      if (company && company[0]) {
        this.companyId = company[0].id;
        this.companyName = company[0].entity_name;
        this.userEmailDomain = company[0].domain;
        this.primaryColor = company[0].primary_color;
        this.buttonColor = company[0].button_color
          ? company[0].button_color
          : company[0].primary_color;
        this.showLogo =
          company[0].show_logo_on_member_select == 1 ? true : false;
        this.termsAndConditions = company[0].terms_and_conditions;
        this.privacyPolicy = company[0].policy;
        this.logoSource = `${COMPANY_IMAGE_URL}/${
          company[0].photo || company[0].image
        }`;
        this.privacyPolicyURL = company[0].privacy_policy_url;
        this.privacyPolicyURLEn = company[0].privacy_policy_url_en;
        this.privacyPolicyURLFr = company[0].privacy_policy_url_fr;
        this.privacyPolicyURLEu = company[0].privacy_policy_url_eu;
        this.privacyPolicyURLCa = company[0].privacy_policy_url_ca;
        this.privacyPolicyURLDe = company[0].privacy_policy_url_de;
        this.canShowPrivacyPolicy =
          company[0].show_privacy_policy == 1 ? true : false;
      }
    }

    this.initData();
  }

  initData() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: this._translateService.instant("dialog.selectall"),
      unSelectAllText: this._translateService.instant("dialog.clearall"),
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.getSubfeatures();
    this.checkConfirmEmail();
    this.getOtherSettings();
  }

  getSubfeatures() {
    this._companyService
      .getSubfeaturesCombined(this.companyId, 15)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          let subfeatures = response["subfeatures"];
          this.countryDropdown = subfeatures.some(
            (a) => a.name_en == "Country" && a.active == 1
          );
          if (this.countryDropdown) {
            this.getCountries();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  checkConfirmEmail() {
    this._companyService
      .checkConfirmEmail({ companyId: this.companyId })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.confirm_email = response.active;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCountries() {
    this._companyService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.countries = response.countries;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getRegistrationFields() {
    this._userService
      .getRegistrationFields()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.allRegistrationFields = response.registration_fields;
          this.getRegistrationFieldMapping();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getRegistrationFieldMapping() {
    this._userService
      .getRegistrationFieldMapping(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.allRegistrationFieldMapping =
            response.registration_field_mapping;

          let registration_fields: any[] = [];
          let selected_fields: any[] = [];
          if (this.allRegistrationFields) {
            this.allRegistrationFields.forEach((field) => {
              let match = this.allRegistrationFieldMapping.some(
                (a) => a.field_id === field.id
              );
              if (!match) {
                registration_fields.push(field);

                if (field.field == "password") {
                  // Push another confirm_password field
                  let confirm_password_field = {
                    active: 1,
                    created_at: "",
                    field: "confirm_password",
                    field_desc_en: null,
                    field_desc_es: null,
                    field_display_en: "Confirm password",
                    field_display_es: "Confirmar contraseña",
                    field_group_en: null,
                    field_group_es: null,
                    field_type: "password",
                    id: 5,
                    max_length: 30,
                    min_length: 8,
                    required: 1,
                  };
                  registration_fields.push(confirm_password_field);
                }
              }
            });
          }

          if (this.allRegistrationFieldMapping) {
            this.allRegistrationFieldMapping.forEach((field) => {
              let reg_field = this.allRegistrationFields.filter((f) => {
                return f.id == field.field_id;
              });

              let fld = {};
              if (reg_field && reg_field[0]) {
                let field_display_en = reg_field[0].field_display_en;
                if (field.field_display_en && field.field_display_en != null) {
                  field_display_en = field.field_display_en;
                }
                let field_display_es = reg_field[0].field_display_es;
                if (field.field_display_es && field.field_display_es != null) {
                  field_display_es = field.field_display_es;
                }
                let field_desc_en = reg_field[0].field_desc_en;
                if (field.field_desc_en && field.field_desc_en != null) {
                  field_desc_en = field.field_desc_en;
                }
                let field_desc_es = reg_field[0].field_desc_es;
                if (field.field_desc_es && field.field_desc_es != null) {
                  field_desc_es = field.field_desc_es;
                }
                let field_group_en = reg_field[0].field_group_en;
                if (field.field_group_en && field.field_group_en != null) {
                  field_group_en = field.field_group_en;
                }
                let field_group_es = reg_field[0].field_group_es;
                if (field.field_group_es && field.field_group_es != null) {
                  field_group_es = field.field_group_es;
                }

                fld = {
                  id: reg_field[0].id,
                  field: reg_field[0].field,
                  field_type: reg_field[0].field_type,
                  field_display_en: field_display_en,
                  field_display_es: field_display_es,
                  field_group_en: field_group_en,
                  field_group_es: field_group_es,
                  field_desc_en: field_desc_en,
                  field_desc_es: field_desc_es,
                  min_length: reg_field[0].min_length,
                  max_length: reg_field[0].max_length,
                  active: reg_field[0].active,
                  required:
                    field.required != null
                      ? field.required
                      : reg_field[0].required,
                  created_at: reg_field[0].created_at,
                  step_1: field.step_1,
                  step_3: field.step_3,
                  step_4: field.step_4,
                };

                selected_fields.push(fld);

                if (reg_field[0].field == "password") {
                  let confirm_password_field = {
                    id: 5,
                    field: "confirm_password",
                    field_type: "password",
                    field_display_en: "Confirm password",
                    field_display_es: "Confirmar contraseña",
                    field_group_en: null,
                    field_group_es: null,
                    field_desc_en: "",
                    field_desc_es: "",
                    min_length: 8,
                    max_length: 30,
                    active: 1,
                    required: 1,
                    created_at: "",
                    step_1: this.companyId == 15 ? 1 : 0,
                    step_3: 0,
                    step_4: 0,
                  };
                  selected_fields.push(confirm_password_field);
                  this.hasConfirmPassword = true;
                }
              }
            });
          }

          let sections: any[] = [];
          let section_fields: any[] = [];
          let selected_startup_fields: any[] = [];
          let startup_sections: any[] = [];
          let startup_section_fields: any[] = [];
          if (selected_fields && !this.showLogo) {
            selected_fields.forEach((f) => {
              let match = sections.some(
                (a) => a.field_group_es === f.field_group_es
              );
              if (!match) {
                sections.push({
                  field_group_en: f.field_group_en,
                  field_group_es: f.field_group_es,
                });
              }
            });

            if (sections) {
              sections.forEach((s) => {
                let fields: any[] = [];
                if (selected_fields) {
                  fields = selected_fields.filter((sf) => {
                    return sf.field_group_es == s.field_group_es;
                  });
                }

                section_fields.push({
                  field_group_en: s.field_group_en,
                  field_group_es: s.field_group_es,
                  fields: fields,
                });
              });
            }
          }

          this.registrationFields = registration_fields;
          this.sectionFields = section_fields;
          this.selectedFields = selected_fields;

          if (this.selectedFields && this.selectedFields.length > 0) {
            this.initializeFormGroup();
          } else {
            this.showDefaultRegistrationFields = true;
            this.initializeDefaultForm();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  initializeFormGroup() {
    this.formTemplate = [];

    this.selectedFields.forEach((field) => {
      if (field.field_type) {
        this.formTemplate.push({
          label: field.field,
          required: field.required,
          min_length: field.min_length,
          max_length: field.max_length,
        });
      }
    });

    let group = {};
    this.formTemplate.forEach((input_template) => {
      const validators: any[] = [];
      if (input_template.label == "password") {
        validators.push(
          Validation.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true,
          })
        );
        validators.push(
          Validation.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true,
          })
        );
        validators.push(
          Validation.patternValidator(new RegExp("(?=.*[a-z])"), {
            requiresLowercase: true,
          })
        );
        validators.push(
          Validation.patternValidator(new RegExp("(?=.*[$@^!%*?&])"), {
            requiresSpecialChars: true,
          })
        );
      }
      if (input_template.label == "email") validators.push(Validators.email);
      if (input_template.required) validators.push(Validators.required);
      if (input_template.min_length > 0)
        validators.push(Validators.minLength(input_template.min_length));
      if (input_template.max_length > 0)
        validators.push(Validators.maxLength(input_template.max_length));
      group[input_template.label] = new FormControl("", validators);
    });

    this.getStartedForm = new FormGroup(group);

    if (this.getStartedForm) {
      // Set default to Spain
      if (this.getStartedForm.controls["country"]) {
        this.getStartedForm.controls["country"].setValue("Spain");
      }
      if (this.getStartedForm.controls["company_country"]) {
        this.getStartedForm.controls["company_country"].setValue("Spain");
      }
    }

    this.isloading = false;
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  initializeDefaultForm() {
    this.getStartedForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
    this.isloading = false;
  }

  getOtherSettings() {
    this._companyService
      .getOtherSettings(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          this.otherSettings = response["other_settings"];
          if (this.otherSettings) {
            this.otherSettings.forEach((m) => {
              if (m.title_es == "Registro / Servicios") {
                if (m.content) {
                  let registrationFieldsSettings = m.content.filter((c) => {
                    return c.title_en.indexOf("Registration fields") >= 0;
                  });
                  if (
                    registrationFieldsSettings &&
                    registrationFieldsSettings[0]
                  ) {
                    this.hasRegistrationFields =
                      registrationFieldsSettings[0].active == 1 ? true : false;
                    if (this.hasRegistrationFields) {
                      this.getRegistrationFields();
                    } else {
                      this.showDefaultRegistrationFields = true;
                      this.initializeDefaultForm();
                    }
                  }

                  let companyInvoiceSettings = m.content.filter((c) => {
                    return (
                      c.title_en.indexOf("Company details for invoicing") >= 0
                    );
                  });
                  if (companyInvoiceSettings && companyInvoiceSettings[0]) {
                    this.hasCompanyInvoiceSettings =
                      companyInvoiceSettings[0].active == 1 ? true : false;
                  }
                }
              }

              if (m.title_es == "Stripe") {
                if (m.content) {
                  let membershipFeeSettings = m.content.filter((x) => {
                    return x.title_en == "Monthly Subscription Fee";
                  });
                  if (membershipFeeSettings && membershipFeeSettings[0]) {
                    this.membershipFee = membershipFeeSettings[0].value;
                  }

                  let customMemberTypeSettings = m.content.filter((c) => {
                    return (
                      c.title_en.indexOf(
                        "Require Stripe payment on specific member types"
                      ) >= 0
                    );
                  });
                  if (customMemberTypeSettings && customMemberTypeSettings[0]) {
                    this.hasCustomMemberTypeSettings =
                      customMemberTypeSettings[0].active == 1 ? true : false;
                    this.getCustomMemberTypes();
                  }

                  if (!this.hasCustomMemberTypeSettings) {
                    let paidRegistrationSettings = m.content.filter((c) => {
                      return c.title_en.indexOf("Stripe payment") >= 0;
                    });
                    if (
                      paidRegistrationSettings &&
                      paidRegistrationSettings[0]
                    ) {
                      this.hasPaidRegistration =
                        paidRegistrationSettings[0].active == 1 ? true : false;
                    }
                  }

                  let customMemberTypeExpirationSettings = m.content.filter(
                    (c) => {
                      return (
                        c.title_en.indexOf("Custom member type expiration") >= 0
                      );
                    }
                  );
                  if (
                    customMemberTypeExpirationSettings &&
                    customMemberTypeExpirationSettings[0]
                  ) {
                    this.hasCustomMemberTypeExpiration =
                      customMemberTypeExpirationSettings[0].active == 1
                        ? true
                        : false;
                  }
                }
              }
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCustomMemberTypes() {
    this._userService
      .getCustomMemberTypes(this.companyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.memberTypes = response.member_types;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  trimWhitespace() {
    const keys = Object.keys(this.getStartedForm.value);
    keys.forEach((key) => {
      const value = this.getStartedForm.value[key];
      if (typeof value == "string") {
        const value2 = value.replace(/^\s+|\s+$/gm, "");
        if (value != value2) {
          this.getStartedForm.controls[key].setValue(value2);
        }
      }
    });
  }

  async signUp() {
    this.trimWhitespace();

    this.hasError = false;
    this.formSubmitted = true;

    if (
      this.hasConfirmPassword &&
      this.getStartedForm.value["password"] &&
      this.getStartedForm.value["confirm_password"] &&
      this.getStartedForm.value["password"] !=
        this.getStartedForm.value["confirm_password"]
    ) {
      this.errors["password"] = this._translateService.instant(
        "signup.passwordmatch"
      );
      this.errors["confirm_password"] = this._translateService.instant(
        "signup.passwordmatch"
      );
      this.hasError = true;
      this.formSubmitted = false;
      return false;
    }

    if (this.isValidForm()) {
      if (
        this.hasCustomMemberTypeSettings &&
        this.hasCustomMemberTypeExpiration
      ) {
        let expired_member = get(
          await this._userService
            .getCustomMemberTypeExpiration(
              this.companyId,
              this.getStartedForm.controls["email"].value
            )
            .toPromise(),
          "expired_member"
        );
        if (expired_member && expired_member.id) {
          this.open(
            this._translateService.instant("dialog.membershipexpired"),
            ""
          );
          this.hasError = true;
          this.formSubmitted = false;
          return false;
        }
      }

      let formData = [];
      formData = this.getStartedForm.value;
      formData["company_id"] = this.companyId;
      formData["payment"] = this.hasPaidRegistration ? 1 : 0;

      let invited_by_guid = this._localService.getLocalStorage(
        environment.lsinvitedbyguid
      );
      if (invited_by_guid) {
        formData["invited_by_guid"] = invited_by_guid;
      }

      if (this.selectedBusinessCategories) {
        formData["business_category_id"] = this.selectedBusinessCategories
          .map((data) => {
            return data.id;
          })
          .join();
      }

      this._authService
        .userSignupDynamicNoPayment(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (response) => {
            if (response["user"]) {
              this._localService.setLocalStorage(
                environment.lsuserId,
                response["user"]["id"]
              );
              this._localService.setLocalStorage(
                environment.lsemail,
                response["user"]["email"]
              );
              this._localService.setLocalStorage(
                environment.lscompanyId,
                response["user"]["fk_company_id"]
              );
              this._localService.setLocalStorage(
                environment.lsdomain,
                response["user"]["domain"]
              );
              if (!this._localService.getLocalStorage(environment.lslang)) {
                this._localService.setLocalStorage(environment.lslang, "es");
              }

              if (
                this.hasCustomMemberTypeSettings &&
                this.memberTypes &&
                this.memberTypes.length > 0
              ) {
                this._router.navigate([
                  `/payment/select-plan/${response["user"]["id"]}`,
                ]);
              } else {
                if (this.confirm_email) {
                  await this._authService
                    .sendConfirmationEmail({
                      companyId: this.companyId,
                      userId: response["user"]["id"],
                    })
                    .toPromise();
                }

                this._router.navigate([`/auth/login`]);
              }
            } else if (response["code"] == "user_exists") {
              let error = true;
              if (
                this.hasCustomMemberTypeSettings &&
                response["existing_user"]
              ) {
                if (
                  response["existing_user"]["custom_member_type_id"] == 0 ||
                  response["existing_user"]["status"] == 0
                ) {
                  error = false;
                  this._router.navigate([
                    `/payment/select-plan/${response["existing_user"]["id"]}`,
                  ]);
                }
              }

              if (error) {
                this.open(
                  this._translateService.instant("dialog.emailexists"),
                  ""
                );
                this.hasError = true;
                this.formSubmitted = false;
              }
            }
          },
          (error) => {
            console.log(error);
            this.open(this._translateService.instant("dialog.error"), "");
            this.hasError = true;
            this.formSubmitted = false;
          }
        );
    } else {
      this.hasError = true;
      this.formSubmitted = false;
    }
  }

  memberTypeSelectPlan(type) {
    this._localService.setLocalStorage(
      environment.lsselectedMemberType,
      type ? type.id : ""
    );
    let params = {
      id: this.registrationUserId,
      company_id: this.companyId,
      custom_member_type_id: type.id,
      expire_days: type.expire_days,
    };

    this._userService
      .updateUserCustomMemberType(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async (response) => {
          let redirect_url = `/payment/checkout/${this.registrationUserId}/${type.id}`;
          if ((type.require_payment == 1 && type.price > 0) || this.showLogo) {
            this._localService.setLocalStorage(
              environment.lsplanFrequency,
              this.planTypeChoice == "yearly" ? this.planTypeChoice : ""
            );
            if (type.price == 0) {
              if (this.confirm_email) {
                await this._authService
                  .sendConfirmationEmail({
                    companyId: this.companyId,
                    userId: this.registrationUserId,
                  })
                  .toPromise();
              }
              this.beforeExitCheck(redirect_url);
            } else {
              this._router.navigate([redirect_url]);
            }
          } else {
            if (this.confirm_email) {
              await this._authService
                .sendConfirmationEmail({
                  companyId: this.companyId,
                  userId: this.registrationUserId,
                })
                .toPromise();
            }
            this.redirectToLogin(type);
          }
        },
        (error) => {
          console.log(error);
          this.open(this._translateService.instant("dialog.error"), "");
        }
      );
  }

  redirectToLogin(type) {
    if (type.require_approval == 1) {
      this._router.navigate([`/auth/login?type=${type.id}`]);
    } else {
      this._router.navigate([`/auth/login`]);
    }
  }

  async beforeExitCheck(redirect_url = "") {
    const selectedMemberType = this._localService.getLocalStorage(
      environment.lsselectedMemberType
    );
    let sendEmail = false;
    if (selectedMemberType && parseInt(selectedMemberType) > 0) {
      if (this.memberTypes) {
        let selected_plan_row = this.memberTypes.filter((mt) => {
          return mt.id == selectedMemberType;
        });

        if (selected_plan_row && selected_plan_row[0].require_payment != 1) {
          sendEmail = true;
        }
      }
    } else {
      sendEmail = true;
    }
    if (sendEmail) {
      await this.sendSelectPlanEmail(redirect_url);
    }
  }

  async sendSelectPlanEmail(redirect_url) {
    await this._authService
      .selectPlanEmail(this.registrationUserId, this.companyId)
      .toPromise();

    this._localService.removeLocalStorage(environment.lsselectedMemberType);
    if (redirect_url) {
      location.href = redirect_url;
    }
  }

  isValidForm() {
    let valid = true;
    this.errors = {};

    Object.keys(this.getStartedForm.controls).forEach((key) => {
      let proceed = true;

      if (this.hasCompanyInvoiceSettings && !this.useCompanyInvoice) {
        // Check if field belongs to Company section
        if (this.selectedFields) {
          let field_row = this.selectedFields.filter((f) => {
            return f.field == key && f.field_group_en == "Company";
          });
          if (field_row && field_row[0]) {
            proceed = false;
          }
        }
      }

      if (proceed) {
        const controlErrors: ValidationErrors =
          this.getStartedForm.controls[key].errors! || null;
        if (controlErrors != null) {
          valid = false;

          if (controlErrors["email"]) {
            this.errors[key] = this._translateService.instant(
              "company-settings.invalidemailaddress"
            );
          } else if (controlErrors["alphabet"]) {
            this.errors[key] = this._translateService.instant(
              "company-settings.lettersonly"
            );
          } else if (controlErrors["number"]) {
            this.errors[key] = this._translateService.instant(
              "company-settings.numbersonly"
            );
          } else if (controlErrors["minlength"]) {
            this.errors[key] = `${this._translateService.instant(
              "dialog.atleast"
            )} ${
              controlErrors["minlength"].requiredLength
            } ${this._translateService.instant("dialog.characters")}`;
          } else if (controlErrors["maxlength"]) {
            this.errors[key] = `${this._translateService.instant(
              "dialog.maximumof"
            )} ${
              controlErrors["maxlength"].requiredLength
            } ${this._translateService.instant("dialog.characters")}`;
          }
        }
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

  login() {
    this._router.navigate(["/auth/login"]);
  }

  openPrivacyPolicy() {
    if (!this.canShowPrivacyPolicy && this.privacyPolicyURL) {
      let link =
        this.language == "en"
          ? this.privacyPolicyURLEn
          : this.language == "fr"
          ? this.privacyPolicyURLFr || this.privacyPolicyURL
          : this.language == "eu"
          ? this.privacyPolicyURLEu || this.privacyPolicyURL
          : this.language == "ca"
          ? this.privacyPolicyURLCa || this.privacyPolicyURL
          : this.language == "de"
          ? this.privacyPolicyURLDe || this.privacyPolicyURL
          : this.privacyPolicyURL;

      window.open(link, "_blank");
    } else {
      this._router.navigate(["/privacy-policy"]);
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldConfirmTextType() {
    this.fieldConfirmTextType = !this.fieldConfirmTextType;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.getStartedForm.controls;
  }

  get passwordValid() {
    return this.getStartedForm.controls["password"].errors === null;
  }

  get requiredValid() {
    return !this.getStartedForm.controls["password"].hasError("required");
  }

  get minLengthValid() {
    return !this.getStartedForm.controls["password"].hasError("minlength");
  }

  get requiresDigitValid() {
    return !this.getStartedForm.controls["password"].hasError("requiresDigit");
  }

  get requiresUppercaseValid() {
    return !this.getStartedForm.controls["password"].hasError(
      "requiresUppercase"
    );
  }

  get requiresLowercaseValid() {
    return !this.getStartedForm.controls["password"].hasError(
      "requiresLowercase"
    );
  }

  get requiresSpecialCharsValid() {
    return !this.getStartedForm.controls["password"].hasError(
      "requiresSpecialChars"
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
