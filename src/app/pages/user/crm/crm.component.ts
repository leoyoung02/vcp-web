import { CommonModule, Location } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ButtonGroupComponent, PageTitleComponent, ToastComponent } from "@share/components";
import { SearchComponent } from "@share/components/search/search.component";
import { CompanyService, LocalService, UserService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { initFlowbite } from "flowbite";
import { EditorModule } from "@tinymce/tinymce-angular";
import moment from "moment";
import get from "lodash/get";

@Component({
  selector: "app-crm",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    EditorModule,
    SearchComponent,
    ToastComponent,
    PageTitleComponent,
    ButtonGroupComponent,
  ],
  templateUrl: "./crm.component.html",
})
export class CRMComponent {
  private destroy$ = new Subject<void>();

  languageChangeSubscription;
  level1Title: string = "";
  level2Title: string = "";
  level3Title: string = "";
  level4Title: string = "";
  searchText: any;
  placeholderText: any;
  userId: any;
  companyId: any;
  language: any;
  isloading: boolean = true;
  companies: any;
  primaryColor: any;
  buttonColor: any;
  pageSize: number = 10;
  pageIndex: number = 0;
  dataSource: any;
  displayedColumns = [
    "guest_name",
    "guest_phone",
    "guest_email",
    "zip_code",
    "sector",
  ];
  @ViewChild(MatPaginator, { static: false }) paginator:
      | MatPaginator
      | undefined;
  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  searchKeyword: any;
  company: any;
  user: any;
  superAdmin: boolean = false;
  filterType: string = "crm";
  allInvites: any;
  data: any;
  categories: any;
  buttonList: any = [];
  selectedCategory: any = 'All';
  hasSalesFunnel: boolean = false;
  filterRole: any = 'All';
  selectedFilterStatus: any = '';
  status: any = [];
  selectedStatus: any = 'Contacted';
  followup: any = [];
  selectedFollowup: any = '';
  notfollowupreason: any = [];
  selectedNotfollowupReason: any = '';
  contactDate: any;
  followupDate: any;
  sectors: any = [];
  eventparticipants: any = [];
  communicationTypes: any = [];
  roles: any = [];
  memberTypeId: any;
  admin1: boolean = false;
  admin2: boolean = false;
  salesPerson: any = [];
  isSalesPerson: boolean = false;
  canCRM: boolean = false;
  adminGarList: any = [];
  adminThematicList: any = [];
  memberGarList: any = [];
  memberThematicList: any = [];
  crmData: any = [];
  filteredData: any = [];
  cities: any = [];
  events: any = [];
  latestEvents: any = [];
  allData: any = [];
  manageGuestsData: any = [];
  allManagedGuestsData: any = [];
  allCRMData: any;

  constructor(
    private _router: Router,
    private _companyService: CompanyService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {}

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslanguage) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this.companyId = this._localService.getLocalStorage(
      environment.lscompanyId
    );
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
      this.company = company[0];
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
    initFlowbite();
    this.status = [
      {
        status_en: 'Contacted',
        status_es: 'Contactado',
        value: 'Contacted'
      },
      {
        status_en: 'Contact',
        status_es: 'Contactar',
        value: 'Contact'
      },
      {
        status_en: 'Not to contact',
        status_es: 'No contactar',
        value: 'Not to contact'
      }
    ]
    this.followup = [
      {
        followup_en: 'Follow up',
        followup_es: 'Seguimiento',
        value: 'Follow up'
      },
      {
        followup_en: 'Not follow up',
        followup_es: 'No dar seguimiento',
        value: 'Not follow up'
      }
    ]
    this.notfollowupreason = [
      {
        notfollowupreason_en: 'Customer not interested',
        notfollowupreason_es: 'Cliente no interesado',
        value: 'Customer not interested'
      },
      {
        notfollowupreason_en: 'New customer',
        notfollowupreason_es: 'Nuevo cliente',
        value: 'New customer'
      }
    ]
    this.initializeSearch();
    this.getCRMData();
    this.getAssignedGuests();
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  getCRMData() {
    this._userService
      .fetchCRMData(this.companyId, this.userId)
      .subscribe(
        (data) => {
          this.user = data?.user;
          this.mapUserPermissions(data?.user_permissions);
          this.mapSettings(data);

          this.sectors = data?.sectors;
          this.eventparticipants = data?.participants;
          this.mapCommunicationTypes(data);
          this.mapRolesSales(data);

          this.allData = data?.crm;
          this.allCRMData = data?.crm;
          this.formatCRM(data?.crm);
          this.refreshTable(this.data);
          this.initializeButtonGroup();
          this.isloading = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getAssignedGuests() {
    this._userService
      .fetchCRMAssignedGuestsData(this.companyId, this.userId)
      .subscribe(
        (data) => {
          this.manageGuestsData = data?.assigned_guests;
          this.allManagedGuestsData = data?.assigned_guests;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  mapCommunicationTypes(data) {
    this.communicationTypes = data?.guest_actions;
    if(this.communicationTypes) {
      this.communicationTypes = this.communicationTypes?.filter(ct => {
        return ct.id <= 4
      });
    }
  }

  mapRolesSales(data) {
    this.roles = data?.role;
    if(this.roles) {
      this.roles.forEach(role => {
          if(role.role == 'Super Admin') {
            this.memberTypeId = role.id
            this.superAdmin = true
          }
          if(role.role == 'Admin 1') {
            this.memberTypeId = role.id
            this.admin1 = true
          }
          if(role.role == 'Admin 2') {
            this.memberTypeId = role.id
            this.memberTypeId = 2
            this.admin2 = true
          }
      });
    }

    if(!this.memberTypeId) {
      this.memberTypeId = 1
    }
    this.salesPerson = data?.sales_people
    if(this.salesPerson) {
      this.salesPerson = this.salesPerson.filter(sp => {
        return sp.id && sp.name
      })
      if(this.salesPerson) {
        this.salesPerson.forEach(sp => {
          if(sp.id == this.userId) {
            if(this.memberTypeId == 1) {
              this.memberTypeId = 5
            }
            this.isSalesPerson = true
          }
        });
      }
    }

    if(this.companyId == 12 && this.userId > 0 && !this.admin1 && !this.admin2) {
      this.adminGarList = data?.admin_gar;
      this.adminThematicList = data?.admin_thematic;
      this.memberGarList = data?.member_gar;
      this.memberThematicList = data?.member_thematic;
      
      let mgmatch = this.memberGarList && this.memberGarList?.some(a => a.id == this.userId)
      if(mgmatch && !this.superAdmin) {
        this.memberTypeId = 96
      }

      let mtmatch = this.memberThematicList && this.memberThematicList.some(a => a.id == this.userId)
      if(mtmatch && !this.superAdmin) {
        this.memberTypeId = 97
      }

      let agmatch = this.adminGarList && this.adminGarList.some(a => a.id == this.userId)
      if(agmatch && !this.superAdmin) {
        this.memberTypeId = 98
      }

      let atmatch = this.adminThematicList && this.adminThematicList.some(a => a.id == this.userId)
      if(atmatch && !this.superAdmin) {
        this.memberTypeId = 99
      }
    }
    
    let permissions = data?.user_permissions?.member_permissions;
    let content_permission = permissions && permissions.filter(p => {
      return p.custom_member_type_id == this.memberTypeId && p.feature_id == 1
    })
    if(content_permission && content_permission[0]) {
      this.canCRM = content_permission[0].crm == 1 ? true : false
    } else {
      if(this.superAdmin || this.admin1 || this.admin2) {
        this.canCRM = true
      }
    }
  }

  mapSettings(data) {
    let other_settings = data?.settings?.other_settings;
    if(other_settings?.length > 0) {
      this.hasSalesFunnel = other_settings.some(
        (a) => a.title_en == "Sales funnel" && a.active == 1
      );
    }
  }

  mapUserPermissions(user_permissions) {
    this.superAdmin = user_permissions?.super_admin_user ? true : false;
  }

  initializeButtonGroup() {
    let buttonList: any[] = [];
    buttonList.push({
      id: 1,
      value: "All",
      text: this._translateService.instant("plans.all"),
      selected: true,
      fk_company_id: this.companyId,
    });

    this.categories = [
      {
        id: 2,
        value: 'Member',
        text: this._translateService.instant('crm.member')
      },
      {
        id: 3,
        value: 'Guest',
        text: this._translateService.instant('crm.guest')
      },
      {
        id: 4,
        value: 'ManageGuest',
        text: this._translateService.instant('crm.manageguest')
      },
    ]

    if(this.superAdmin && this.hasSalesFunnel) {
      this.categories.push({
        id: 5,
        value: 'SalesFunnel',
        text: this._translateService.instant('crm.salesfunnel')
      })
    }

    if(this.categories?.length > 0) {
        this.categories?.forEach(category => {
            buttonList.push({
                id: category.id,
                value: category.value,
                text: category.text,
                selected: false,
                fk_company_id: this.companyId,
            });
        })
    }

    this.buttonList = buttonList;
  }

  formatCRM(crm) {
    let evts: any[] = [];
    this.data = crm;
    this.data = this.data?.map((item) => {
      return {
        guest_name: item?.name,
        guest_phone: item?.phone,
        guest_email: item?.email,
        ...item,
      };
    });
    this.crmData = this.data;
    this.filteredData = this.data;
    
    if(!this.filterRole || (this.filterRole && this.filterRole != 'ManageGuest')) {
      if(this.data) {
        this.data.forEach(d => {
          if(d.city) {
            let cityMatch = this.cities.some(a => a.city && a.city.toLowerCase().trim() === d.city.toLowerCase().trim());
            if(!cityMatch && d.city.length > 1) {
              if(d.city) {
                this.cities.push({
                  city: d.city
                });
              }
            }
          }

          let match = evts.some(a => a.id === d.event_id);
          if(!match) {
            let timezoneOffset = new Date().getTimezoneOffset();
            let plan_date = moment(d.plan_date).utc().utcOffset(timezoneOffset).format("ddd, D MMM").toString();
            if(d.event && d.event !== null && plan_date != 'Invalid Date') {
              evts.push({
                id: d.event_id,
                title: d.event + ' - ' + plan_date.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
              })
            }
          }
        });

        // Sort
        this.sectors.sort((a, b) => {
          if (a.sector < b.sector) {
              return -1
          }
  
          if (a.sector > b.sector) {
              return 1
          }
  
          return 0
        });

        this.cities.sort((a, b) => {
          if (a.city < b.city) {
            return -1
          }
  
          if (a.city > b.city) {
            return 1
          }
  
          return 0
        });
      }
    } 
    this.events = evts;
    this.latestEvents = evts;
    if(this.events && this.events.length > 5) {
      this.events = this.latestEvents.slice(0, 5);
    }
  }

  refreshTable(array) {
    this.displayedColumns = [
      "guest_name",
      "guest_phone",
      "guest_email",
      "zip_code",
      "sector",
    ];
    if(this.filterRole != 'Member') {
      this.displayedColumns.push('invited_by');
      this.displayedColumns.push('event');
      this.displayedColumns.push('event_date');
    }
    if(this.filterRole != 'Member' && this.filterRole != 'Guest' && this.filterRole != 'ManageGuest') {
      this.displayedColumns.push('attended');
    }
    if(this.filterRole != 'Member' && this.filterRole != 'Guest' && this.filterRole != 'ManageGuest' && !this.admin1 && !this.admin2 && !this.superAdmin) {
      this.displayedColumns.push('sales_person');
    }
    if(this.filterRole != 'Member') {
      this.displayedColumns.push('status');
    }
    
    this.dataSource = new MatTableDataSource(
      array.slice(
        this.pageIndex * this.pageSize,
        (this.pageIndex + 1) * this.pageSize
      )
    );
    if (this.sort) {
      this.dataSource.sort = this.sort;
    } else {
      setTimeout(() => (this.dataSource.sort = this.sort));
    }
    if (this.paginator) {
      new MatTableDataSource(array).paginator = this.paginator;
      if (this.pageIndex > 0) {
      } else {
        this.paginator.firstPage();
      }
    } else {
      setTimeout(() => {
        if (this.paginator) {
          new MatTableDataSource(array).paginator = this.paginator;
          if (this.pageIndex > 0) {
            this.paginator.firstPage();
          }
        }
      });
    }
  }

  getPageDetails(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.dataSource = new MatTableDataSource(
      this.filteredData.slice(
        event.pageIndex * event.pageSize,
        (event.pageIndex + 1) * event.pageSize
      )
    );
    if (this.sort) {
      this.dataSource.sort = this.sort;
    } else {
      setTimeout(() => (this.dataSource.sort = this.sort));
    }
  }

  handleSearch(event) {
    this.pageIndex = 0;
    this.pageSize = 10;
    this.searchKeyword = event;
    this.filterCRM();
  }

  filterCategory(category) {
    this.buttonList?.forEach((item) => {
        if (item.value == category.value) {
          item.selected = true;
        } else {
          item.selected = false;
        }
    });
    this.filterRole = category.value;
    if(this.filterRole == 'ManageGuest') {
      this.allData = this.allManagedGuestsData;
      this.data = this.allManagedGuestsData;
    } else {
      this.allData = this.allCRMData;
      this.data = this.allCRMData;
    }
    this.crmData = this.data;
      this.filteredData = this.data;

    this.selectedCategory = category;
    this.filterCRM();
  }

  filterByStatus(item) {
    let val = item?.status_en || item;
    if(val != this.selectedFilterStatus) {
      this.selectedFilterStatus = val;
    } else {
      this.selectedFilterStatus = '';
    }
    this.filterCRM();
  }

  filterCRM() {
    let crm = this.allData;
    if (crm?.length > 0) {
      if(this.searchKeyword) {
        crm = crm?.filter((m) => {
          let include = false;
          if (
            (m.name &&
            m.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.phone &&
            m.phone
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.email &&
            m.email
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.sector &&
            m.sector
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.invited_by &&
            m.invited_by
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.sales_person &&
            m.sales_person
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0) ||
            (m.event &&
            m.event
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .indexOf(
              this.searchKeyword
                .toLowerCase()
                .normalize("NFD")
                .replace(/\p{Diacritic}/gu, "")
              ) >= 0)
            ) {
              include = true;
            }

            return include;
          });
      }

      if(this.filterRole != 'All' && this.filterRole != 'ManageGuest') {
        crm = crm?.filter(item => {
          return item.role == this.filterRole;
        }) 
      }

      if(this.filterRole == 'ManageGuest') {
        if(!this.selectedFilterStatus) {
          crm = crm?.filter(d => {
            return d.sales_funnel != 1
          })
        }
      }

      if(this.filterRole == 'SalesFunnel') {
        crm = crm?.filter(d => {
          let active = false
  
          if(d.sales_funnel == 1) {
            active = true
          }
  
          return active
        })
      }

      if(this.selectedFilterStatus) {
        if(this.selectedFilterStatus == 'converted') {
          crm = crm.filter(data => {
            return data.converted == 1 || data.status == 'Signed' || data.status == 'Firmado'
          });
        } else if(this.selectedFilterStatus == 'No action') {
          crm = crm.filter(data => {
            return !data.status && data.converted != 1
          });
        } else if(this.selectedFilterStatus == 'Sales Funnel') {
          crm = crm.filter(d => {
            let active = false
  
            if(d.sales_funnel == 1) {
              active = true
            }
  
            return active
          })
        } else {
          crm = crm.filter(data => {
            if(this.superAdmin && this.hasSalesFunnel) {
              return this.selectedFilterStatus == data.status && data.converted != 1 && data.sales_funnel != 1
            } else {
              return this.selectedFilterStatus == data.status && data.converted != 1
            }
          })
        }
      }
    }

    this.filteredData = crm;
    this.formatCRM(this.filteredData);
    this.refreshTable(this.filteredData);
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