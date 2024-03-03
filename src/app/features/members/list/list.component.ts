import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { FilterComponent, PageTitleComponent } from '@share/components';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { SearchComponent } from "@share/components/search/search.component";
import { NgxPaginationModule } from "ngx-pagination";
import { CompanyService, LocalService, UserService } from '@share/services';
import { MembersService } from '@features/services/members/members.service';
import { environment } from '@env/environment';
import { MemberCardComponent } from '@share/components/card/member/member.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from "@angular/material/snack-bar";
import get from 'lodash/get';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgOptimizedImage,
    PageTitleComponent,
    SearchComponent,
    MemberCardComponent,
    FilterComponent,
  ],
  templateUrl: './list.component.html'
})
export class MembersListComponent {
  private destroy$ = new Subject<void>();

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
  membersFeature: any;
  featureId: any;
  canViewMember: boolean = false;
  canCreateMember: boolean = false;
  canManageMember: boolean = false;
  createHover: boolean = false;
  searchText: any;
  placeholderText: any;
  search: any;
  p: any;
  members: any = [];
  allMembers: any = [];
  apiPath: string = environment.api + '/';
  sendReferenceForm: any;
  sendReferenceFormSubmitted: boolean = false;
  processingSendReference: boolean = false;
  member: any;
  @ViewChild("modalbutton", { static: false }) modalbutton:
    | ElementRef
    | undefined;
  @ViewChild("closemodalbutton", { static: false }) closemodalbutton:
    | ElementRef
    | undefined;
  dialogMode: string = "";
  dialogTitle: any;
  cities: any;
  list: any;
  sectors: any;
  buttonList: any;
  selectedCity: any;
  selectedSector: any;
  showMembersCount: boolean = false;
  featureTitle: string = '';
  postalCodes: any = [];

  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    private _membersService: MembersService,
    private _snackBar: MatSnackBar
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  async ngOnInit() {
    this.onResize();

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
    this.sendReferenceForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [Validators.required]),
      'description': new FormControl(''),
    })
    this.initializeSearch();
    this.fetchMembers();
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  fetchMembers() {
    this._membersService
      .fetchMembers(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.mapFeatures(data?.features_mapping);
          this.mapSubfeatures(data?.settings?.subfeatures );
          this.mapUserPermissions(data?.user_permissions);
          this.members = data?.members;
          if(this.members?.length > 0) {
            let current = this.members?.filter(member => {
              return member.id == this.userId
            })
            this.user = current?.length > 0 ? current[0] : {}
          }
          this.allMembers = data?.members;
          this.formatMembers(data?.members);

          if(this.companyId != 12) {
            this.cities = data?.cities;
            this.initializeIconFilterList(this.cities);
          }

          this.sectors = data?.sectors;
          this.initializeButtonGroup();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.membersFeature = features?.find((f) => f.feature_id == 15);
    this.featureId = this.membersFeature?.id;
    let featureName = this.getFeatureTitle(this.membersFeature);
    this.featureTitle = featureName;
    this.pageName = featureName;
    this.pageDescription = this.getFeatureDescription(this.membersFeature);
  }

  mapSubfeatures(subfeatures) {
    if (subfeatures?.length > 0) {
      this.showMembersCount = subfeatures.some(
        (a) => a.name_en == "Members count" && a.active == 1 && a.feature_id == 15
      );
    }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
    this.canViewMember = user_permissions?.member_type_permissions?.find(
      (f) => f.view == 1 && f.feature_id == 15
    )
      ? true
      : false;
    this.canCreateMember =
      user_permissions?.create_plan_roles?.length > 0 ||
      user_permissions?.member_type_permissions?.find((f) => f.create == 1 && f.feature_id == 15);
    this.canManageMember = user_permissions?.member_type_permissions?.find(
      (f) => f.manage == 1 && f.feature_id == 15
    )
      ? true
      : false;
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

  formatMembers(members) {
    members = members?.map((item) => {
      if(this.companyId == 12 && item?.zip_code) {
        let match = this.postalCodes?.some((a) => a.value == item.zip_code);
        if(!match) {
          this.postalCodes?.push({
            id: this.postalCodes?.length,
            value: item.zip_code,
            text: item.zip_code,
            selected: false,
            company_id: this.companyId,
            city: item.zip_code,
            province: '',
            region: '',
            country: '',
            sequence: this.postalCodes?.length,
            campus: '',
          })
        }
      }
      
      return {
        ...item,
        id: item?.id,
        path: `/members/details/${item.id}`,
        image: `${environment.api}/${item.image}`,
        company_image: `${environment.api}/${item.company_logo}`,
        display_name: item?.first_name ? `${item?.first_name} ${item?.last_name}` : item?.name,
        email: `mailto:${item?.email}`,
        phone: `tel:${item?.phone}`
      };
    });

    this.members = members;

    if(this.postalCodes?.length > 0) {
      this.postalCodes?.sort(function (a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      this.initializeIconFilterList(this.postalCodes);
    }

    let selected = localStorage.getItem('member-filter-city');
    if(selected && this.list?.length > 0) {
      this.list.forEach(item => {
        if(item.city == selected) {
          item.selected = true;
          this.selectedCity = selected;
        } else {
          item.selected = false;
        }
      })
      this.filterMembers();
    }

    if(this.showMembersCount) {
      this.pageName = this.featureTitle + (this.showMembersCount && this.members?.length > 0 ? ` (+${this.members?.length})` : '');
    }
  }

  initializeIconFilterList(list) {
    this.list = [
      {
        id: "All",
        value: "",
        text: this._translateService.instant("plans.all"),
        selected: true,
        company_id: this.companyId,
        city: "",
        province: "",
        region: "",
        country: "",
        sequence: "",
        campus: "",
      },
    ];

    list?.forEach((item) => {
      this.list.push({
        id: item.id,
        value: item.id,
        text: item.city,
        selected: false,
        company_id: item.company_id,
        city: item.city,
        province: item.province,
        region: item.region,
        country: item.country,
        sequence: item.sequence,
        campus: item.campus,
      });
    });
  }

  initializeButtonGroup() {
    let categories = this.sectors;
    this.buttonList = [
      {
        id: "All",
        value: "All",
        text: this._translateService.instant("plans.all"),
        selected: true,
        fk_company_id: this.companyId,
        fk_supercategory_id: "All",
        name_CA: "All",
        name_DE: "All",
        name_EN: "All",
        name_ES: "All",
        name_EU: "All",
        name_FR: "All",
        sequence: 1,
        status: 1,
      },
    ];

    if(categories?.length > 0) {
      categories = categories.sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    }

    categories?.forEach((category) => {
      this.buttonList.push({
        id: category.id,
        value: category.id,
        text: category.name,
        selected: false,
        fk_company_id: category.company_id,
        fk_supercategory_id: category.id,
        name_CA: category.name,
        name_DE: category.name,
        name_EN: category.name,
        name_ES: category.name,
        name_EU: category.name,
        name_FR: category.name,
        sequence: this.buttonList?.length + 2,
        status: 1,
      });
    });
  }

  filteredList(event) {
    this.list?.forEach((item) => {
      if (item.city === event) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    
    this.selectedCity = event || "";
    localStorage.setItem('member-filter-city', this.selectedCity);
    this.filterMembers();
  }

  filteredType(category) {
    this.buttonList?.forEach((item) => {
      if (item.id === category.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.selectedSector = category?.text || "";
    this.filterMembers();
  }

  handleSearchChanged(event) {
    this.search = event || "";
    this.filterMembers();
  }

  filterMembers() {
    let members = this.allMembers
    if (this.search) {
      members = members.filter(m => {
        let include = false;

        if ((m.display_name?.toLowerCase().indexOf(this.search.toLowerCase()) >= 0) || 
          (m.city?.toLowerCase().indexOf(this.search.toLowerCase()) >= 0) ||
          (m.sector?.toLowerCase().indexOf(this.search.toLowerCase()) >= 0) ||
          (m.email?.toLowerCase().indexOf(this.search.toLowerCase()) >= 0)
        ) {
          include = true
        }

        return include;
      })
    }

    if(this.selectedCity) {
      if(this.companyId == 12) {
        members = members?.filter(m => {
          return m?.zip_code == this.selectedCity
        })
      } else {
        members = members?.filter(m => {
          return m?.city == this.selectedCity
        })
      }
      
    }

    if(this.selectedSector && !(this.selectedSector == 'Todas' || this.selectedSector == 'All')) {
      members = members?.filter(m => {
        return m?.sector == this.selectedSector
      })
    }

    this.formatMembers(members);
  }

  handleSendReference(event) {
    if(event && this.members?.length > 0) {
      let selected = this.members?.filter(member => {
        return member.id == event
      })
      this.member = selected?.length > 0 ? selected[0] : {}
    } 
    this.sendReferenceFormSubmitted = false;
    this.dialogMode = "reference";
    this.dialogTitle =  this._translateService.instant('members.sendreference');
    this.modalbutton?.nativeElement.click();
  }

  sendReference() {
    this.sendReferenceFormSubmitted = true

    if(!this.isValidReferenceForm()) {
      return false
    }

    this.processingSendReference = true

    let params = {
      'company_id': this.companyId,
      'user_id': this.member?.id,
      'name': this.sendReferenceForm.get('name').value,
      'email': this.sendReferenceForm.get('email').value,
      'phone': this.sendReferenceForm.get('phone').value,
      'description': this.sendReferenceForm.get('description').value,
      'created_by': this.userId,
    }
    this._membersService.sendReference(params).subscribe(data => {
      this.open(this._translateService.instant('dialog.sentsuccessfully'), '');
      this.processingSendReference = false;
      if(this.members?.length > 0) {
        this.members?.forEach(member => {
          if(member.id == this.userId) {
            member.references += 1
          }
        })
      }
      if(this.allMembers?.length > 0) {
        this.allMembers?.forEach(member => {
          if(member.id == this.userId) {
            member.references += 1
          }
        })
      }
      this.closemodalbutton?.nativeElement.click();
    }, err => {
      console.log('err: ', err);
      this.open(this._translateService.instant('dialog.error'), '');
    })
  }

  async open(message: string, action: string) {
    await this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: ["info-snackbar"],
    });
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

  ngOnDestroy() {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
