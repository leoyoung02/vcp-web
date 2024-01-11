import { CommonModule, Location } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { BreadcrumbComponent, PageTitleComponent, ToastComponent } from "@share/components";
import { SearchComponent } from "@share/components/search/search.component";
import {
  CompanyService,
  LocalService,
} from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { EditorModule } from "@tinymce/tinymce-angular";
import { CoursesService } from "@features/services";
import { initFlowbite } from "flowbite";
import get from "lodash/get";

@Component({
  selector: "app-course-assessments-list",
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatTabsModule,
    EditorModule,
    SearchComponent,
    BreadcrumbComponent,
    ToastComponent,
    PageTitleComponent,
  ],
  templateUrl: "./assessments-list.component.html",
})
export class CourseAssessmentsListComponent {
  private destroy$ = new Subject<void>();

  @Input() list: any;

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
  company: any;
  domain: any;
  assessments: any = [];
  allAssessments: any = [];
  selectedId: any;
  question: any;
  sequence: any;
  mode: any;
  formSubmitted: boolean = false;
  assessmentForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl(""),
  });
  pageSize: number = 10;
  pageIndex: number = 0;
  dataSource: any;
  displayedColumns = ["title", "action"];
  showConfirmationModal: boolean = false;
  selectedItem: any;
  confirmDeleteItemTitle: any;
  confirmDeleteItemDescription: any;
  acceptText: string = "";
  cancelText: any = "";
  @ViewChild(MatPaginator, { static: false }) paginator:
    | MatPaginator
    | undefined;
  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  @ViewChild("modalbutton0", { static: false }) modalbutton0:
    | ElementRef
    | undefined;
  @ViewChild("closemodalbutton0", { static: false }) closemodalbutton0:
    | ElementRef
    | undefined;
  searchKeyword: any;
  title: any;
  description: any;
  tabIndex = 0;
  tabSelected: boolean = false;
  createdAssessmentId: any;
  assessmentItems: any = [];
  assessmentTypes: any;
  assessmentItemMode: any;
  showAssessmentItemDetails: boolean = false;
  selectedAssessmentItemId: any;
  selectedAssessmentItemType: any = '';
  assessmentItemTitle: any;
  assessmentItemFormSubmitted: boolean = false;
  selectedAssessmentItem: any;
  selectedMultipleChoiceOption: any;
  selectedMultipleChoiceOptionId: any;
  showMultipleChoiceOptionDetails: boolean = false;
  multipleChoiceOptionFormSubmitted: boolean = false;
  multipleChoiceChoice: any;
  multipleChoiceCorrect: boolean = false;
  confirmMode: any;
  multipleChoiceOptionMode: any;

  constructor(
    private _companyService: CompanyService,
    private _coursesService: CoursesService,
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _snackBar: MatSnackBar,
    private _location: Location
  ) {}

  async ngOnInit() {
    this.language =
      this._localService.getLocalStorage(environment.lslanguage) || "es";
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
      this.domain = company[0].domain;
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
    this.initializeBreadcrumb();
    this.initializeSearch();
    this.getAssessments();
  }

  initializeBreadcrumb() {
    this.level1Title = this._translateService.instant(
      "company-settings.settings"
    );
    this.level2Title = this._translateService.instant(
      "search.courses"
    );
    this.level3Title = this._translateService.instant(
      "course-assessment.manageassessments"
    );
    this.level4Title = "";
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  getAssessments() {
    this._companyService
      .getAssessments(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.assessmentTypes = response.assessment_types;
          this.formatAssessments(response.assessments);
          this.allAssessments = this.assessments;
          this.refreshTable(this.assessments);
          this.isloading = false;
        },
        (error) => {
          
        }
      );
  }

  formatAssessments(assessments) {
    assessments = assessments?.map((item) => {
      return {
        ...item,
        id: item?.id,
      };
    });
    if(this.assessmentItemMode == 'edit') {
      let selected_assessment_type = localStorage.getItem('selected_assessment_type');
      this.selectedAssessmentItemType = '';
      setTimeout(() => {
        this.selectedAssessmentItemType = selected_assessment_type;
      }, 500);
    }

    this.assessments = assessments;
    if(this.createdAssessmentId) {
      if(this.assessments?.length > 0) {
        let assessment_row = this.assessments?.filter(q => {
          return q.id == this.createdAssessmentId
        })
        if(assessment_row?.length > 0) {
          this.editAssessment(assessment_row[0]);
        }
      }
    }
  }

  getAssessmentType(id) {
    let type = ''
    if(this.assessmentTypes?.length > 0) {
      let typ = this.assessmentTypes?.filter(l => {
        return l.id == id
      })
      if(typ?.length > 0) {
        type = this.getTypeTitle(typ[0]);
      }
    }

    return type
  }

  getTypeTitle(type) {
    return type ? this.language == 'en' ? (type.type_en || type.type_es) : (this.language == 'fr' ? (type.type_fr || type.type_es) : 
      (this.language == 'eu' ? (type.type_eu || type.type_es) : (this.language == 'ca' ? (type.type_ca || type.type_es) : 
      (this.language == 'de' ? (type.type_de || type.type_es) : type.type_es)
      ))
    ) : ''
  }

  refreshTable(array) {
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
      this.assessments.slice(
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
    this.assessments = this.filterAssessments();
    this.refreshTable(this.assessments);
  }

  filterAssessments() {
    let assessments = this.allAssessments;
    if (assessments?.length > 0 && this.searchKeyword) {
      return assessments.filter((m) => {
        let include = false;
        if (
          m.title &&
          m.title.toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .indexOf(
            this.searchKeyword
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
          ) >= 0
        ) {
          include = true;
        }

        return include;
      });
    } else {
      return assessments;
    }
  }

  create() {
    this.createdAssessmentId = '';
    this.assessmentForm.controls["title"].setValue("");
    this.assessmentForm.controls["description"].setValue("");

    this.mode = "add";
    this.formSubmitted = false;

    this.modalbutton0?.nativeElement.click();
  }

  editAssessment(item) {
    this.resetModes();
    this.selectedId = item.id;
    this.title = item.title;
    this.description = item.description;
    this.formatAssessmentItems(item.details);
    
    this.assessmentForm.controls["title"].setValue(this.title);
    this.assessmentForm.controls["description"].setValue(this.description);

    if(this.createdAssessmentId) {
      this.createdAssessmentId = '';
      this.tabIndex = 1;
    }

    this.mode = "edit";
    this.modalbutton0?.nativeElement.click();
  }

  resetModes() {
    this.createdAssessmentId = '';
    this.assessmentItemMode = '';
    this.showAssessmentItemDetails = false;
    this.selectedAssessmentItem = '';
    this.selectedAssessmentItemType = '';
    this.selectedAssessmentItem = '';
    this.selectedMultipleChoiceOption = '';
    this.selectedMultipleChoiceOptionId = '';
    this.showMultipleChoiceOptionDetails = false;
    this.multipleChoiceOptionMode = '';
  }

  formatAssessmentItems(items) {
    items = items?.map((item) => {
      return {
        ...item,
        id: item?.id,
        type: this.getAssessmentType(item?.assessment_type_id),
      };
    });

    this.assessmentItems = items;
  }

  save() {
    this.formSubmitted = true;

    if (
      this.assessmentForm.get("title")?.errors
    ) {
      return false;
    }

    let params = {
      title: this.assessmentForm.get("title")?.value,
      description: this.assessmentForm.get("description")?.value,
      company_id: this.companyId,
      created_by: this.userId,
    };

    if (this.mode == "add") {
      this._companyService.addAssessment(params).subscribe(
        (response) => {
          this.closemodalbutton0?.nativeElement.click();
          this.createdAssessmentId = response?.id;
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          setTimeout(() => {
            this.getAssessments();
          }, 500);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.mode == "edit") {
      this._companyService.editAssessment(this.selectedId, params).subscribe(
        (response) => {
          this.closemodalbutton0?.nativeElement.click();
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.getAssessments();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deleteAssessment(item) {
    this.showConfirmationModal = false;
    this.confirmDeleteItemTitle = this._translateService.instant(
      "dialog.confirmdelete"
    );
    this.confirmDeleteItemDescription = this._translateService.instant(
      "dialog.confirmdeleteMember"
    );
    this.acceptText = "OK";
    this.selectedItem = item.id;
    setTimeout(() => (this.showConfirmationModal = true));
  }

  confirm() {
    this._companyService.deleteAssessment(this.selectedItem).subscribe(
      (response) => {
        this.assessments.forEach((cat, index) => {
          if (cat.id == this.selectedItem) {
            this.assessments.splice(index, 1);
          }
        });
        this.allAssessments.forEach((cat, index) => {
          if (cat.id == this.selectedItem) {
            this.allAssessments.splice(index, 1);
          }
        });
        this.refreshTable(this.assessments);
        this.open(
          this._translateService.instant("dialog.deletedsuccessfully"),
          ""
        );
        this.showConfirmationModal = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeTab(event) {

  }

  handleEditAssessmentItem(item) {
    this.assessmentItemMode = 'edit';
    this.selectedAssessmentItem = item;
    this.selectedAssessmentItemId = item.id;
    this.selectedAssessmentItemType = item.assessment_type_id;
    this.assessmentItemTitle = item.title;
    this.showAssessmentItemDetails = true;
  }

  handleDeleteAssessmentItem(item) {
    this._companyService.deleteAssessmentItem(item.id).subscribe(
      (response) => {
        this.assessmentItems.forEach((cat, index) => {
          if (cat.id == item.id) {
            this.assessmentItems.splice(index, 1);
          }
        });
        this.open(
          this._translateService.instant("dialog.deletedsuccessfully"),
          ""
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addAssessmentItem() {
    this.resetAssessmentItemFields()
    this.assessmentItemMode = 'add';
    this.showAssessmentItemDetails = true;
  }

  resetAssessmentItemFields() {
    this.assessmentItemMode = '';
    this.selectedAssessmentItemId = '';
    this.selectedAssessmentItemType = '';
    this.assessmentItemTitle = '';
    this.assessmentItemFormSubmitted = false;
    this.showAssessmentItemDetails = false;
    localStorage.removeItem('selected_assessment_type');
  }

  saveAssessmentItem() {
    this.assessmentItemFormSubmitted = true;

    if (
      !this.assessmentItemTitle ||
      !this.selectedAssessmentItemType
    ) {
      return false;
    }

    let params = {
      company_id: this.companyId,
      assessment_id: this.selectedId,
      assessment_type_id: this.selectedAssessmentItemType,
      title: this.assessmentItemTitle,
      created_by: this.userId,
    };

    if (this.assessmentItemMode == "add") {
      this._companyService.addAssessmentItem(params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.assessmentItems = response.assessment_items;
          this.getAssessments();
          this.resetAssessmentItemFields();
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.assessmentItemMode == "edit") {
      this._companyService.editAssessmentItem(this.selectedAssessmentItemId, params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.assessmentItems = response.assessment_items;
          this.getAssessments();
          this.resetAssessmentItemFields();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  cancelAssessmentItem() {
    this.resetAssessmentItemFields();
    this.assessmentItemMode = '';
    this.showAssessmentItemDetails = false;
  }

  handleEditMultipleChoiceOption(option) {
    this.multipleChoiceOptionMode = 'edit';
    this.selectedMultipleChoiceOption = option;
    this.selectedMultipleChoiceOptionId = option.id;
    this.multipleChoiceChoice = option.choice;
    this.multipleChoiceCorrect = option.correct == 1 ? true : false;
    this.showMultipleChoiceOptionDetails = true;
  }

  addMultipleChoiceOption() {
    this.multipleChoiceOptionMode = 'add';
    this.selectedMultipleChoiceOption = '';
    this.selectedMultipleChoiceOptionId = '';
    this.multipleChoiceChoice = '';
    this.multipleChoiceCorrect = false;
    this.showMultipleChoiceOptionDetails = true;
  }

  cancelMultipleChoiceOption() {
    this.multipleChoiceOptionMode = '';
    this.selectedMultipleChoiceOption = '';
    this.selectedMultipleChoiceOptionId = '';
    this.multipleChoiceChoice = '';
    this.multipleChoiceCorrect = false;
    this.showMultipleChoiceOptionDetails = false;
  }

  handleDeleteMultipleChoiceOption(option) {
    this._companyService.deleteAssessmentMultipleChoice(option.id).subscribe(
      (response) => {
        this.assessmentItems.forEach(cat => {
          if(cat?.assessment_multiple_choice_options) {
            cat?.assessment_multiple_choice_options?.forEach((co, index) => {
              if (co.id == option.id) {
                cat?.assessment_multiple_choice_options?.splice(index, 1);
              }
            })
          }
        });
        this.getAssessments();
        this.open(
          this._translateService.instant("dialog.deletedsuccessfully"),
          ""
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveMultipleChoice() {
    if (
      !this.multipleChoiceChoice
    ) {
      return false;
    }

    let params = {
      company_id: this.companyId,
      assessment_id: this.selectedId,
      assessment_type_id: this.selectedAssessmentItemType,
      assessment_detail_id: this.selectedAssessmentItemId,
      choice: this.multipleChoiceChoice,
      correct: this.multipleChoiceCorrect ? 1 : 0,
      created_by: this.userId,
    };

    if (this.multipleChoiceOptionMode == "add") {
      this._companyService.addAssessmentMultipleChoice(params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.assessmentItems = response.assessment_items;
          let assessment_item
          if(this.assessmentItems?.length > 0) {
            let assessment_item_row = this.assessmentItems?.filter(qi => {
              return qi.id == this.selectedAssessmentItemId
            })
            if(assessment_item_row?.length > 0) {
              assessment_item = assessment_item_row[0];
            }
          }
          localStorage.setItem('selected_assessment_type', this.selectedAssessmentItemType);
          this.getAssessments();
          this.selectedAssessmentItem = assessment_item;
          this.multipleChoiceChoice = '';
          this.multipleChoiceCorrect = false;
          this.multipleChoiceOptionMode = '';
          this.showMultipleChoiceOptionDetails = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.multipleChoiceOptionMode == "edit") {
      this._companyService.editAssessmentMultipleChoice(this.selectedMultipleChoiceOptionId, params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.assessmentItems = response.assessment_items;
          let assessment_item
          if(this.assessmentItems?.length > 0) {
            let assessment_item_row = this.assessmentItems?.filter(qi => {
              return qi.id == this.selectedAssessmentItemId
            })
            if(assessment_item_row?.length > 0) {
              assessment_item = assessment_item_row[0];
            }
          }
          localStorage.setItem('selected_assessment_type', this.selectedAssessmentItemType);
          this.getAssessments();
          this.selectedAssessmentItem = assessment_item;
          this.multipleChoiceChoice = '';
          this.multipleChoiceCorrect = false;
          this.multipleChoiceOptionMode = '';
          this.showMultipleChoiceOptionDetails = false;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  cancelMultipleChoice() {
    this.showMultipleChoiceOptionDetails = false;
  }

  moveUp(type, array, index) {
    if (index >= 1) {
      this.swap(array, index, index - 1);
      this.updateAssessmentListSequence(type, array);
    }
  }

  moveDown(type, array, index) {
    if (index < array.length - 1) {
      this.swap(array, index, index + 1);
      this.updateAssessmentListSequence(type, array);
    }
  }

  swap(array: any[], x: any, y: any) {
    var b = array[x];
    array[x] = array[y];
    array[y] = b;
  }

  updateAssessmentListSequence(type, array) {
    let params = {
      id: this.selectedAssessmentItemId,
      list_type: type,
      list: array
    }
    this._coursesService.editCourseListSequence(params).subscribe(
      response => {
        this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
      },
      error => {
        console.log(error);
      }
    )
  }

  handleGoBack() {
    this._location.back();
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