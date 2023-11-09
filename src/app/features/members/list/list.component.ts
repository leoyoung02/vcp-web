import { Component, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageTitleComponent } from '@share/components';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { SearchComponent } from "@share/components/search/search.component";
import { NgxPaginationModule } from "ngx-pagination";
import { CompanyService, LocalService, UserService } from '@share/services';
import { MembersService } from '@features/services/members/members.service';
import { environment } from '@env/environment';
import { MemberCardComponent } from '@share/components/card/member/member.component';
import moment from "moment";
import get from 'lodash/get';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
    NgOptimizedImage,
    PageTitleComponent,
    SearchComponent,
    MemberCardComponent,
  ],
  templateUrl: './list.component.html'
})
export class ListComponent {
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

  constructor(
    private _router: Router,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _userService: UserService,
    private _membersService: MembersService
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
          this.allMembers = data?.members;
          this.formatMembers(data?.members);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapFeatures(features) {
    this.membersFeature = features?.find((f) => f.feature_id == 15);
    this.featureId = this.membersFeature?.id;
    this.pageName = this.getFeatureTitle(this.membersFeature);
    this.pageDescription = this.getFeatureDescription(this.membersFeature);
  }

  mapSubfeatures(subfeatures) {
    if (subfeatures?.length > 0) {
      
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
      return {
        ...item,
        id: item?.id,
        path: `/members/details/${item.id}`,
        image: `${environment.api}/${item.image}`,
        display_name: item?.first_name ? `${item?.first_name} ${item?.first_name}` : item?.name,
        email: `mailto:${item?.email}`,
        phone: `tel:${item?.phone}`
      };
    });

    this.members = members;
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

    this.formatMembers(members);
  }
}
