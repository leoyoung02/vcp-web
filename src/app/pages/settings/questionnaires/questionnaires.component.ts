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
import { CoursesService } from "@features/services";
import { initFlowbite } from "flowbite";
import get from "lodash/get";

@Component({
  selector: "app-settings-lead-questionnaires",
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
    SearchComponent,
    BreadcrumbComponent,
    ToastComponent,
    PageTitleComponent,
  ],
  templateUrl: "./questionnaires.component.html",
})
export class QuestionnairesComponent {
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
  questions: any = [];
  allQuestions: any = [];
  selectedId: any;
  question: any;
  sequence: any;
  mode: any;
  formSubmitted: boolean = false;
  questionForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl(""),
  });
  pageSize: number = 10;
  pageIndex: number = 0;
  dataSource: any;
  displayedColumns = ["title", "location", "action"];
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
  selectedLocation: any = '';
  questionLocations: any = [];
  tabIndex = 0;
  tabSelected: boolean = false;
  createdQuestionId: any;
  questionItems: any = [];
  questionTypes: any;
  questionItemMode: any;
  showQuestionItemDetails: boolean = false;
  selectedQuestionItemId: any;
  selectedQuestionItemType: any = '';
  questionItemTitle: any;
  questionItemFormSubmitted: boolean = false;
  selectedQuestionItem: any;
  selectedMultipleChoiceOption: any;
  selectedMultipleChoiceOptionId: any;
  showMultipleChoiceOptionDetails: boolean = false;
  multipleChoiceOptionFormSubmitted: boolean = false;
  multipleChoiceChoice: any;
  confirmMode: any;
  multipleChoiceOptionMode: any;
  ruleMode: any;
  showRuleDetails: boolean = false;
  rules: any = [];
  rulesTemp: any = [];
  whatsAppCommunityUrl: any;
  ruleConditions: any = [];
  ruleOperators: any = [];
  selectedCondition: any = '';
  selectedOperator: any = '';
  conditionValue: any;
  selectedRule: any;
  selectedRuleId: any;

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
    this.initializeRuleData();
    this.getQuestions();
  }

  initializeBreadcrumb() {
    this.level1Title = this._translateService.instant(
      "company-settings.settings"
    );
    this.level2Title = this._translateService.instant(
      "company-settings.channels"
    );
    this.level3Title = "TikTok";
    this.level4Title = this._translateService.instant("leads.questionnaires");
  }

  initializeSearch() {
    this.searchText = this._translateService.instant("guests.search");
    this.placeholderText = this._translateService.instant(
      "news.searchbykeyword"
    );
  }

  initializeRuleData() {
    this.ruleConditions = [
      {
        id: 1,
        value: '',
        text: '-'
      },
      {
        id: 2,
        value: 'contains',
        text: this._translateService.instant('leads.contains'),
      },
      {
        id: 3,
        value: 'equals',
        text: this._translateService.instant('leads.equals')
      },
      {
        id: 4,
        value: 'notequals',
        text: this._translateService.instant('leads.notequals')
      }
    ]
    this.ruleOperators = [
      {
        id: 1,
        value: '',
        text: '-'
      },
      {
        id: 2,
        value: 'and',
        text: this._translateService.instant('plan-create.and')?.toLowerCase(),
      },
      {
        id: 3,
        value: 'or',
        text: this._translateService.instant('plan-create.or')
      }
    ]
  }

  getQuestions() {
    this._companyService
      .getLeadsQuestions(this.companyId, this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.questionLocations = response.question_locations;
          this.questionTypes = response.question_types;
          this.formatQuestions(response.questions);
          this.allQuestions = this.questions;
          this.refreshTable(this.questions);
          this.isloading = false;
        },
        (error) => {
          
        }
      );
  }

  formatQuestions(questions) {
    questions = questions?.map((item) => {
      return {
        ...item,
        id: item?.id,
        location: this.getLocation(item?.location_id),
      };
    });

    this.questions = questions;
    if(this.createdQuestionId) {
      if(this.questions?.length > 0) {
        let question_row = this.questions?.filter(q => {
          return q.id == this.createdQuestionId
        })
        if(question_row?.length > 0) {
          this.editQuestion(question_row[0]);
        }
      }
    }
  }

  getLocation(id) {
    let location = ''
    if(this.questionLocations?.length > 0) {
      let loc = this.questionLocations?.filter(l => {
        return l.id == id
      })
      if(loc?.length > 0) {
        location = loc[0].location;
      }
    }

    return location
  }

  getQuestionType(id) {
    let type = ''
    if(this.questionTypes?.length > 0) {
      let typ = this.questionTypes?.filter(l => {
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
      this.questions.slice(
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
    this.questions = this.filterQuestions();
    this.refreshTable(this.questions);
  }

  filterQuestions() {
    let questions = this.allQuestions;
    if (questions?.length > 0 && this.searchKeyword) {
      return questions.filter((m) => {
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
      return questions;
    }
  }

  create() {
    this.createdQuestionId = '';
    this.questionForm.controls["title"].setValue("");
    this.questionForm.controls["description"].setValue("");

    this.mode = "add";
    this.formSubmitted = false;

    this.modalbutton0?.nativeElement.click();
  }

  editQuestion(item) {
    this.selectedId = item.id;
    this.title = item.title;
    this.description = item.description;
    this.selectedLocation = item.location_id || '';
    this.formatQuestionItems(item.items);
    
    this.rules = item?.question_rules?.filter(qr => {
      return qr.question_id == item.id
    });

    this.questionForm.controls["title"].setValue(this.title);
    this.questionForm.controls["description"].setValue(this.description);

    if(this.createdQuestionId) {
      this.createdQuestionId = '';
      this.tabIndex = 1;
    }

    this.mode = "edit";
    this.modalbutton0?.nativeElement.click();
  }

  formatQuestionItems(items) {
    items = items?.map((item) => {
      return {
        ...item,
        id: item?.id,
        type: this.getQuestionType(item?.question_type_id),
      };
    });

    this.questionItems = items;
  }

  save() {
    this.formSubmitted = true;

    if (
      this.questionForm.get("title")?.errors
    ) {
      return false;
    }

    let params = {
      title: this.questionForm.get("title")?.value,
      description: this.questionForm.get("description")?.value,
      company_id: this.companyId,
      location_id: this.selectedLocation,
      category: 'Leads',
      created_by: this.userId,
    };

    if (this.mode == "add") {
      this._companyService.addLeadsQuestion(params).subscribe(
        (response) => {
          this.closemodalbutton0?.nativeElement.click();
          this.createdQuestionId = response?.id;
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          setTimeout(() => {
            this.getQuestions();
          }, 500);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.mode == "edit") {
      this._companyService.editLeadsQuestion(this.selectedId, params).subscribe(
        (response) => {
          this.closemodalbutton0?.nativeElement.click();
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.getQuestions();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  deleteQuestion(item) {
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
    this._companyService.deleteLeadsQuestion(this.selectedItem).subscribe(
      (response) => {
        this.questions.forEach((cat, index) => {
          if (cat.id == this.selectedItem) {
            this.questions.splice(index, 1);
          }
        });
        this.allQuestions.forEach((cat, index) => {
          if (cat.id == this.selectedItem) {
            this.allQuestions.splice(index, 1);
          }
        });
        this.refreshTable(this.questions);
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

  handleEditQuestionItem(item) {
    this.questionItemMode = 'edit';
    this.selectedQuestionItem = item;
    this.selectedQuestionItemId = item.id;
    this.selectedQuestionItemType = item.question_type_id;
    this.questionItemTitle = item.title;
    this.showQuestionItemDetails = true;
  }

  handleDeleteQuestionItem(item) {
    this._companyService.deleteLeadsQuestionItem(item.id).subscribe(
      (response) => {
        this.questionItems.forEach((cat, index) => {
          if (cat.id == item.id) {
            this.questionItems.splice(index, 1);
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

  addQuestionItem() {
    this.resetQuestionItemFields()
    this.questionItemMode = 'add';
    this.showQuestionItemDetails = true;
  }

  resetQuestionItemFields() {
    this.questionItemMode = '';
    this.selectedQuestionItemId = '';
    this.selectedQuestionItemType = '';
    this.questionItemTitle = '';
    this.questionItemFormSubmitted = false;
    this.showQuestionItemDetails = false;
  }

  saveQuestionItem() {
    this.questionItemFormSubmitted = true;

    if (
      !this.questionItemTitle ||
      !this.selectedQuestionItemType
    ) {
      return false;
    }

    let params = {
      company_id: this.companyId,
      question_id: this.selectedId,
      question_type_id: this.selectedQuestionItemType,
      title: this.questionItemTitle,
      created_by: this.userId,
    };

    if (this.questionItemMode == "add") {
      this._companyService.addLeadsQuestionItem(params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.questionItems = response.question_items;
          this.resetQuestionItemFields();
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.questionItemMode == "edit") {
      this._companyService.editLeadsQuestionItem(this.selectedQuestionItemId, params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.questionItems = response.question_items;
          this.resetQuestionItemFields();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  cancelQuestionItem() {
    this.resetQuestionItemFields()
    this.questionItemMode = '';
    this.showQuestionItemDetails = false;
  }

  handleEditMultipleChoiceOption(option) {
    this.multipleChoiceOptionMode = 'edit';
    this.selectedMultipleChoiceOption = option;
    this.selectedMultipleChoiceOptionId = option.id;
    this.multipleChoiceChoice = option.choice;
    this.showMultipleChoiceOptionDetails = true;
  }

  addMultipleChoiceOption() {
    this.multipleChoiceOptionMode = 'add';
    this.selectedMultipleChoiceOption = '';
    this.selectedMultipleChoiceOptionId = '';
    this.multipleChoiceChoice = '';
    this.showMultipleChoiceOptionDetails = true;
  }

  cancelMultipleChoiceOption() {
    this.multipleChoiceOptionMode = '';
    this.selectedMultipleChoiceOption = '';
    this.selectedMultipleChoiceOptionId = '';
    this.multipleChoiceChoice = '';
    this.showMultipleChoiceOptionDetails = false;
  }

  handleDeleteMultipleChoiceOption(option) {
    this._companyService.deleteLeadsQuestionMultipleChoice(option.id).subscribe(
      (response) => {
        this.questionItems.forEach(cat => {
          if(cat?.question_multiple_choice_options) {
            cat?.question_multiple_choice_options?.forEach((co, index) => {
              if (co.id == option.id) {
                cat?.question_multiple_choice_options?.splice(index, 1);
              }
            })
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

  saveMultipleChoice() {
    if (
      !this.multipleChoiceChoice
    ) {
      return false;
    }

    let params = {
      company_id: this.companyId,
      question_id: this.selectedId,
      question_type_id: this.selectedQuestionItemType,
      question_item_id: this.selectedQuestionItemId,
      choice: this.multipleChoiceChoice,
      created_by: this.userId,
    };

    if (this.multipleChoiceOptionMode == "add") {
      this._companyService.addLeadsQuestionMultipleChoice(params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.questionItems = response.question_items;
          let question_item
          if(this.questionItems?.length > 0) {
            let question_item_row = this.questionItems?.filter(qi => {
              return qi.id == this.selectedQuestionItemId
            })
            if(question_item_row?.length > 0) {
              question_item = question_item_row[0];
            }
          }
          this.selectedQuestionItem = question_item;
          this.multipleChoiceChoice = '';
          this.multipleChoiceOptionMode = '';
          this.showMultipleChoiceOptionDetails = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.multipleChoiceOptionMode == "edit") {
      this._companyService.editLeadsQuestionMultipleChoice(this.selectedMultipleChoiceOptionId, params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.questionItems = response.question_items;
          let question_item
          if(this.questionItems?.length > 0) {
            let question_item_row = this.questionItems?.filter(qi => {
              return qi.id == this.selectedQuestionItemId
            })
            if(question_item_row?.length > 0) {
              question_item = question_item_row[0];
            }
          }
          this.selectedQuestionItem = question_item;
          this.multipleChoiceChoice = '';
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
      this.updateCourseListSequence(type, array);
    }
  }

  moveDown(type, array, index) {
    if (index < array.length - 1) {
      this.swap(array, index, index + 1);
      this.updateCourseListSequence(type, array);
    }
  }

  swap(array: any[], x: any, y: any) {
    var b = array[x];
    array[x] = array[y];
    array[y] = b;
  }

  updateCourseListSequence(type, array) {
    let params = {
      id: this.selectedQuestionItemId,
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

  addRule() {
    this.ruleMode = 'add';
    this.whatsAppCommunityUrl = '';
    this.formatRuleItems();
    this.showRuleDetails = true;
  }

  formatRuleItems() {
    this.rulesTemp = [];
    if(this.ruleMode == 'add') {
      if(this.questionItems?.length > 0) {
        this.questionItems?.forEach(qu => {
          this.rulesTemp.push({
            id: (this.rulesTemp?.length || 0) + 1,
            question_id: this.selectedId,
            question_item_id: qu.id,
            title: qu.title,
            value: '',
            condition: '',
            operator: '',
            whatsapp_community: '',
          })
        })
      }   
    } else if(this.ruleMode == 'edit') {
      let whatsapp_community = '';
      if(this.questionItems?.length > 0) {
        this.questionItems?.forEach(qu => {
          let id = '';
          let value = '';
          let condition = '';
          let operator = '';
          this.rules?.forEach(r => {
            if(r.question_rule_items?.length > 0) {
              let question_rule_item_row = r.question_rule_items?.filter(qri => {
                return qri.question_item_id == qu.id && 
                  qri.question_id == this.selectedId &&
                  qri.question_rule_id == this.selectedRuleId
              })

              if(question_rule_item_row?.length > 0) {
                id = question_rule_item_row[0].id;
                value = question_rule_item_row[0].value;
                condition = question_rule_item_row[0].condition;
                operator = question_rule_item_row[0].operator;
                whatsapp_community = question_rule_item_row[0].whatsapp_community;
              }
            }
          })
          this.rulesTemp.push({
            id: (this.rulesTemp?.length || 0) + 1,
            question_id: this.selectedId,
            question_item_id: qu.id,
            title: qu.title,
            value,
            condition,
            operator,
            whatsapp_community,
          })
        })
      }
    }
  }

  cancelRule() {
    this.ruleMode = '';
    this.whatsAppCommunityUrl = '';
    this.showRuleDetails = false;
  }

  saveRule() {
    if (
      !this.whatsAppCommunityUrl
    ) {
      return false;
    }

    let params = {
      company_id: this.companyId,
      question_id: this.selectedId,
      whatsapp_community: this.whatsAppCommunityUrl,
      question_rule_items: this.rulesTemp,
      created_by: this.userId,
    };

    if (this.ruleMode == "add") {
      this._companyService.addLeadsQuestionRule(params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.rules = response.question_rules;
          this.whatsAppCommunityUrl = '';
          this.selectedRuleId = '';
          this.selectedRule = '';
          this.showRuleDetails = false;
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.ruleMode == "edit") {
      this._companyService.editLeadsQuestionRule(this.selectedRuleId, params).subscribe(
        (response) => {
          this.open(
            this._translateService.instant("dialog.savedsuccessfully"),
            ""
          );
          this.rules = response.question_rules;
          console.log(this.rules)
          this.whatsAppCommunityUrl = '';
          this.selectedRuleId = '';
          this.selectedRule = '';
          this.showRuleDetails = false;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  handleEditRule(rule) {
    this.selectedRule = rule;
    this.selectedRuleId = rule.id;
    this.ruleMode = 'edit';
    this.whatsAppCommunityUrl = rule.whatsapp_community;
    this.formatRuleItems();
    this.showRuleDetails = true;
  }

  handleDeleteRule(rule) {
    this._companyService.deleteLeadsQuestionRule(rule.id).subscribe(
      (response) => {
        this.rules = response.question_rules;
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