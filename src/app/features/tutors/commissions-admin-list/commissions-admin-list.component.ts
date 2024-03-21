import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  Input,
  SimpleChange,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, ExcelService, LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { SearchComponent } from "@share/components/search/search.component";
import { TutorsService } from "@features/services";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NoAccessComponent, ToastComponent } from "@share/components";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import moment from "moment";
import { searchSpecialCase } from "src/app/utils/search/helper";

@Component({
  selector: "app-commissions-admin-list",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    SearchComponent,
    ToastComponent,
    NoAccessComponent,
  ],
  templateUrl: "./commissions-admin-list.component.html",
})
export class CommissionsAdminListComponent {
  private destroy$ = new Subject<void>();

  @Input() list: any;
  @Input() company: any;
  @Input() buttonColor: any;
  @Input() primaryColor: any;
  @Input() canCreateJobOffer: any;
  @Input() commissionsTitle: any;
  @Input() userId: any;
  @Input() superAdmin: any;
  @Input() status: any;
  @Input() language: any;
  languageChangeSubscription;
  isMobile: boolean = false;
  searchText: any;
  placeholderText: any;
  allCommissionsData: any = [];
  commissionsData: any = [];
  searchKeyword: any;
  dataSource: any;
  displayedColumns = [
    "checked",
    "date",
    "student_name",
    "tutor_name",
    "course_title",
    "commission",
    "action"
  ];
  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  selected: any = [];
  selectedBulkAction: any = '';
  showConfirmationModal: boolean = false;
  selectedItem: any;
  confirmDeleteItemTitle: string = "";
  confirmDeleteItemDescription: string = "";
  acceptText: string = "";
  cancelText: string = "";
  isProcessing: boolean = false;
  courses: any = [];
  selectedCourse: any = '';
  selectedDateFilter: any;
  selectedStartDate: any;
  selectedEndDate: any;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  actionMode: string = '';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _tutorsService: TutorsService,
    private _excelService: ExcelService
  ) {}

  @HostListener("window:resize", [])
  private onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnChanges(changes: SimpleChange) {
    let statusChange = changes["status"];
    if (statusChange?.previousValue != statusChange?.currentValue) {
      this.status = statusChange.currentValue;
      this.loadCommissions(this.allCommissionsData);
    }
  }
  async ngOnInit() {
    this.onResize();
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
    if(this.superAdmin) {
      this.fetchCommissions();
      this.initializeSearch();
    }
  }

  fetchCommissions(mode: any = '', status: any = '') {
    this._tutorsService
      .getCommissions(this.company?.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
          response => {
            let commissions = response.commissions
            this.formatCommissions(commissions)
          },
          error => {
              console.log(error);
          }
      )
  }

  formatCommissions(commissions) {
    let data;
    if (commissions?.length > 0) {
      data = commissions?.map((commission) => {
        let match = this.courses?.some(
          (a) => a.course_title == commission.course_title
        );
        if(!match) {
          this.courses.push({
            course_title: commission?.course_title,
            value: commission?.course_title
          })
        }

        return {
          ...commission,
          student_name: commission?.student_name || (`${commission?.student_first_name} ${commission?.student_last_name}`),
          tutor_name: commission?.tutor_name || (`${commission?.tutor_first_name} ${commission?.tutor_last_name}`),
          date: moment(commission.booking_date).format('DD MMM YYYY'),
          commission_display: `€ ${commission.commission_per_hour}`,
          checked: false,
        };
      });
    }
    if (this.allCommissionsData?.length == 0) {
      this.allCommissionsData = data;
    }

    this.loadCommissions(data);
  }

  loadCommissions(data) {
    let commissions = data;

    commissions = commissions?.filter((commission) => {
      let include = false
      if(this.status == "Completed" && commission.commission_transfer_id) {
        include = true
      }

      if(this.status != "Completed" && !commission?.commission_transfer_id) {
        include = true
      }

      return include;
    });

    if (this.searchKeyword && commissions?.length > 0) {
      commissions = commissions?.filter((commission) => {
        let include = false;
       if(
        (commission?.student_first_name && (commission?.student_first_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.student_first_name)
        ) || 
        (commission?.student_last_name && (commission?.student_last_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.student_last_name)
        ) ||
        (commission?.student_name && (commission?.student_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.student_name)
        ) ||
        (commission?.student_email && (commission?.student_email?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0) ||
        (commission?.tutor_first_name && (commission?.tutor_first_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.tutor_first_name)
        ) ||
        (commission?.tutor_last_name && (commission?.tutor_last_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.tutor_last_name)
        ) ||
        (commission?.tutor_name && (commission?.tutor_name?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0 
        || searchSpecialCase(this.searchKeyword,commission.tutor_name)
        ) ||
        (commission?.tutor_email && (commission?.tutor_email?.toLowerCase()).normalize("NFD").replace(/\p{Diacritic}/gu, "").indexOf(this.searchKeyword?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")) >= 0)
       ) {
        include = true;
       }

        return include;
      });
    }

    if(this.selectedCourse) {
      commissions = commissions?.filter((commission) => {
        return commission?.course_title == this.selectedCourse
      })
    }

    if(this.selectedStartDate && this.selectedEndDate) {
      commissions = commissions?.filter((commission) => {
        let include = false

        let formatted_booking_date = moment(commission?.booking_date)?.format('YYYY-MM-DD');
        if(
          moment(formatted_booking_date).isSameOrAfter(moment(this.selectedStartDate))
          && moment(formatted_booking_date).isSameOrBefore(moment(this.selectedEndDate))
         ) {
          include = true;
        }

        return include
      })
    }

    this.commissionsData = commissions;
    this.refreshTable(this.commissionsData);
  }

  refreshTable(list) {
    this.dataSource = new MatTableDataSource(list);
    if (this.sort) {
      this.dataSource.sort = this.sort;
    } else {
      setTimeout(() => (this.dataSource.sort = this.sort));
    }
  }

  changeCourseFilter(event) {
    this.loadCommissions(this.allCommissionsData);
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  handleCreateRoute() {
    this._router.navigate([`/employmentchannel/create`]);
  }

  handleSearch(event) {
    this.searchKeyword = event;
    this.loadCommissions(this.allCommissionsData);
  }

  handleDateChange(type, event) {
    if (type == "start") {
      if(moment(event?.value).isValid()) {
        this.selectedStartDate = moment(event.value).format("YYYY-MM-DD");
      } else {
        this.selectedStartDate = '';
      }
    }
    if (type == "end") {
      if(moment(event?.value).isValid()) {
        this.selectedEndDate = moment(event.value).format("YYYY-MM-DD");
      } else {
        this.selectedEndDate = '';
      }
    }

    this.loadCommissions(this.allCommissionsData);
  }

  onUserSelected(event, user) {
    let selected = this.selected;
    if(event.target.checked) {
      selected.push(user);
      this.selected = [...selected]
    } else {
      if(selected.length >0) {
        selected = selected.filter(item => item.user_id != user.user_id)
        this.selected = [...selected]
      }
    }
  }

  onAllSelected(event) {
    let selected: any[] = []
    if(event.target.checked) {
      if(this.commissionsData?.length > 0) {
        this.commissionsData?.forEach(item => {
          item.checked = true;
          selected.push(item);
        });
      }
      this.selected = [...selected]
    } else {
      this.selected = [];
      this.commissionsData?.forEach(item => {
        item.checked = false;
      });
    }
    this.refreshTable(this.commissionsData);
  }

  bulkApply() {
    if(this.selectedBulkAction && this.selected?.length > 0) {
      this.showConfirmationModal = false;
      this.confirmDeleteItemTitle = this._translateService.instant(
        "dialog.confirmtransfer"
      );
      this.confirmDeleteItemDescription = this._translateService.instant(
        "dialog.confirmtransferitem"
      );
      this.acceptText = "OK";
      this.actionMode = 'bulk';
      setTimeout(() => (this.showConfirmationModal = true));
    } else {
      this.open(this._translateService.instant('dialog.pleaseselectanaction'), '');
    }
  }

  confirm() {
    if(this.actionMode == 'bulk') {
      this.applyBulkAction(true);
    } else if(this.actionMode == 'delete') {
      this.handleDeleteCommission(true);
    }
  }

  applyBulkAction(confirmed) {
    if(confirmed) {
      this.showConfirmationModal = false;
      this.isProcessing = true;
      let params = {
        user_id: this.userId,
        booking_id: this.selected.map( (data) => { return data.booking_id }).join(),
        company_id: this.company?.id,
        action: this.selectedBulkAction
      }
      
      this._tutorsService.bulkTransferCommission(params).subscribe(
        response => {
          this.selected = [];
          this.open(`${this._translateService.instant('tutors.transfercompleted')}`, '');
          setTimeout(() => {
            location.reload();
          }, 500);
        },
        error => {
            console.log(error);
        }
      )
    }
  }

  deleteCommission(row) {
    this.showConfirmationModal = false;
    
    this.confirmDeleteItemTitle = this._translateService.instant(
      "dialog.confirmdelete"
    );

    this.confirmDeleteItemDescription = this._translateService.instant(
      "dialog.confirmdeleteitem"
    );

    this.acceptText = "OK";
    this.selectedItem = row;
    this.actionMode = 'delete';
    setTimeout(() => (this.showConfirmationModal = true));
  }

  handleDeleteCommission(confirmed) {
    if(confirmed) {
      this.showConfirmationModal = false;
      this._tutorsService.deleteCommission(this.selectedItem?.id).subscribe(
        response => {
          this.commissionsData.forEach((cat, index) => {
            if (cat.id == this.selectedItem?.id) {
              this.commissionsData.splice(index, 1);
            }
          });
          this.allCommissionsData.forEach((cat, index) => {
            if (cat.id == this.selectedItem?.id) {
              this.allCommissionsData.splice(index, 1);
            }
          });
          this.selectedItem = '';
          this.actionMode = '';
          this.refreshTable(this.commissionsData)
          this.open(`${this._translateService.instant('dialog.deletedsuccessfully')}`, '');
        },
        error => {
            console.log(error);
        }
      )
    }
  }

  downloadExcel() {
      let event_data: any[] = [];
      if(this.commissionsData?.length > 0){
        this.commissionsData?.forEach(booking => {
            event_data.push({
              'Fecha para registrarse':booking.booking_date,
              'Alumno':booking.student_name,
              'Tutor':booking.tutor_name,
              'Curso':booking.course_title,
              'Comisión':booking.commission,
            })
        });


      if(this.status == "Completed") {
        this._excelService.exportAsExcelFile(event_data, 'paid_commission_' + this.getTimestamp());
      }
      
      if(this.status != "Completed") {
        this._excelService.exportAsExcelFile(event_data, 'pending_commission' + this.getTimestamp());
      }


      this.open(this._translateService.instant("dialog.filedownloaded"), "");
      }
  }


  public getTimestamp() {
    const date = new Date();
    const timestamp = date.getTime();

    return timestamp;
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