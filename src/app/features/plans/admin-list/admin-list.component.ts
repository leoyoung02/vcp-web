import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostListener, Input, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService, ExcelService, LocalService } from '@share/services';
import { Subject, takeUntil } from 'rxjs';
import { IconFilterComponent } from '@share/components';
import { SearchComponent } from '@share/components/search/search.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PlansService } from '@features/services';
import moment from "moment";

@Component({
    selector: 'app-plans-admin-list',
    standalone: true,
    imports: [
        CommonModule, 
        TranslateModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSnackBarModule,
        SearchComponent,
        IconFilterComponent,
        NgOptimizedImage
    ],
    templateUrl: './admin-list.component.html',
})
export class PlansAdminListComponent {
    private destroy$ = new Subject<void>();

    @Input() list: any;
    @Input() company: any;
    @Input() buttonColor: any;
    @Input() primaryColor: any;
    @Input() canCreatePlan: any;
    @Input() plansTitle: any;
    @Input() userId: any;
    @Input() superAdmin: any;
    @Input() status: any;
    @Input() language: any;
    @Input() isUESchoolOfLife: any;

    languageChangeSubscription;
    isMobile: boolean = false;
    searchText: any;
    placeholderText: any;
    plansData: any = [];
    dataSource: any;
    displayedColumns = ["title", "plan_date_display", "attendees", "action"];
    pageSize: number = 10;
    pageIndex: number = 0;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
    planParticipants: any = [];
    searchKeyword: any;
    date: Date = new Date();
    allPlansData: any[] = [];
    selectedCity: any;
    allPlanDrafts: any = [];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _companyService: CompanyService,
        private _plansService: PlansService,
        private _excelService: ExcelService,
    ) { }

    @HostListener("window:resize", [])
    private onResize() {
        this.isMobile = window.innerWidth < 768;
    }

    ngOnChanges(changes: SimpleChange) {
        let statusChange = changes["status"];
        if(statusChange.previousValue != statusChange.currentValue) {
            this.status = statusChange.currentValue;
            this.loadPlans(this.allPlansData);
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
        this.fetchPlansManagementData();
        this.initializeSearch();
    }

    fetchPlansManagementData() {
        this._plansService
          .fetchPlansManagementData(this.company?.id, this.userId, (this.superAdmin ? 'superadmin' : 'user'), this.isUESchoolOfLife)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (data) => {
                this.planParticipants = data?.plan_participants || [];
                this.allPlanDrafts = data?.plan_drafts || [];
                this.formatPlans(data?.plans || []);
            },
            (error) => {
              console.log(error);
            }
          );
    }

    initializeSearch() {
        this.searchText = this._translateService.instant("guests.search");
        this.placeholderText = this._translateService.instant("news.searchbykeyword");
    }

    formatPlans(plans) {
        let data 
        if(plans?.length > 0) {
            data = plans?.map(plan => {
                let participants = this.planParticipants?.filter(pp => {
                    return pp.id == plan.id
                })
                return {
                    ...plan,
                    participants,
                }
            })
        }
        if(this.allPlansData?.length == 0) {
            this.allPlansData = data
        }
        
        this.loadPlans(data);
    }

    handleSearch(event) {
        this.searchKeyword = event;
        this.loadPlans(this.allPlansData);
    }

    loadPlans(data) {
        if(this.status == 'draft') {
            this.plansData = this.allPlanDrafts
        } else {
            this.plansData = data?.filter(activity => {
                let plan_date = moment(activity.plan_date).format("YYYY-MM-DD");
                var day = this.date.getDate();
                var day_number = (day < 10 ? '0' : '') + day;
                var month_number = ((this.date.getMonth() + 1) < 10 ? '0' : '') + (this.date.getMonth() + 1);
                let date = this.date.getFullYear() + "-" + month_number + "-" + day_number;
          
                let active;
                if(activity.type == 2) {
                  let today = moment(new Date()).utcOffset('+0100').format('YYYY-MM-DD HH:mm:ss');
                  let endDateReached = true;
                  if(activity.end_date) {
                      if(activity.end_date > activity.plan_date) {
                          if(activity.end_date >= today.replace(" ", "T") + '.000Z') {
                              endDateReached = false;
                          }
                      }
                  }
          
                  let include = false;
                  if(activity.id == 0) {
                      include = true;
                  } else if(!endDateReached) {
                      include = true;
                  } else if(!activity.end_date && activity.plan_date >= today.replace(" ", "T") + '.000Z' ) {
                      include = true;
                  }
          
                  if(!activity.plan_date) {
                    include = true;
                  } 
                  
                  if(this.status == 'active') {
                    active = include;
                  } else {
                    active = !include;
                  }
                } else {
                  let include = false;
                  if(!activity.plan_date) {
                    include = true;
                  }
          
                  if(this.status == 'active') {
                    if(plan_date != 'Invalid date') {
                      active = plan_date >= date;
                    } else {
                      active = include;
                    }
                  } else {
                    if(plan_date != 'Invalid date') {
                      active = plan_date < date;
                    } else {
                      active = !include;
                    }
                  }
                }
                
                
                return active
            })
        }
        

        if(this.searchKeyword && this.plansData) {
            this.plansData = this.plansData.filter(p => {
              return p.title && p.title.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >= 0 
            })
        }

        if(this.selectedCity) {
            this.plansData = this.plansData.filter(p => {
                return p.address && p.address.toLowerCase().indexOf(this.selectedCity.toLowerCase()) >= 0 
            })
        }

        this.refreshTable(this.plansData);
    }

    refreshTable(list) {
        this.dataSource = new MatTableDataSource(list)
        if (this.sort) {
            this.dataSource.sort = this.sort;
        } else {
            setTimeout(() => this.dataSource.sort = this.sort);
        }

        if (this.paginator) {
            this.dataSource.paginator = this.paginator
            this.paginator.firstPage()
        } else {
            setTimeout(() => {
                this.dataSource.paginator = this.paginator
                this.paginator?.firstPage()
            });
        }
    }

    getPageDetails(event: any) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        this.dataSource = new MatTableDataSource(
          this.plansData.slice(
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

    viewItem(id, planType) {
        let link = '';
        if (planType == 1) {
          link = `/plans/details/${id}/1`;
        } else if (planType == 5) {
          link = `/plans/details/${id}/5`;
        } else if (planType == 2) {
          link = `/plans/details/${id}/4`;
        }
    
        if(link) {
          this._router.navigate([]).then(result => {  window.open(link, 'self'); });
        }
    }

    editItem(id, type) {
        let link = '';
        if(type == 1) {
          link = `/plans/edit/${id}/1`;
        } else if(type == 5) {
          link = `/plans/edit/${id}/5`;
        } else if(type == 2) {
          link = `/plans/edit/${id}/4`;
        }
    
        if(link) {
          this._router.navigate([]).then(result => {  window.open(link, 'self'); });
        }
    }

    deleteItem(id, type) {
        const navigationExtras: NavigationExtras = {
          state: {
              mode: 'delete'
          },
          relativeTo: this._route
        };
    
        if (type == 1) {
          this._router.navigate([`/plans/details/${id}/1`], navigationExtras);
        } else if (type == 5) {
          this._router.navigate([`/plans/details/${id}/5`], navigationExtras);
        } else if (type == 2) {
          this._router.navigate([`/plans/details/${id}/4`], navigationExtras);
        }
    }

    confirmAttendance(id, type, actionUserId, eventId, plan_type) {
        let param = {
          user_id: this.userId,
          action_user_id: actionUserId,
          event_id: eventId
        }
    
        if(plan_type == 'company_plan') {
          this._plansService.confirmPlanParticipantAttendance(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                this.planParticipants[index].attended = 1;
                this.planParticipants[index].clear_attended = 0;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        } else {
          this._plansService.confirmParticipantAttendance(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                this.planParticipants[index].attended = 1;
                this.planParticipants[index].clear_attended = 0;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        }
    }
    
    clearAttendance(id, type, actionUserId, eventId, plan_type) {
        let param = {
          user_id: this.userId,
          action_user_id: actionUserId,
          event_id: eventId
        }
    
        if(plan_type == 'company_plan') {
          this._plansService.clearPlanParticipantAttendance(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].attended = 0;
                  this.planParticipants[index].clear_attended = 1;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        } else {
          this._plansService.clearParticipantAttendance(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].attended = 0;
                  this.planParticipants[index].clear_attended = 1;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        }
    }

    confirmation(id, type, actionUserId, eventId, plan_type) {
        let param = {
          user_id: this.userId,
          action_user_id: actionUserId,
          event_id: eventId
        }
        if(plan_type == 'company_plan') {
          this._plansService.confirmPlanParticipant(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].confirmed = 1;
                  this.planParticipants[index].clear_confirmed = 0;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        } else {
          this._plansService.confirmParticipant(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].confirmed = 1;
                  this.planParticipants[index].clear_confirmed = 0;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        }
    }
    
    clearConfirmation(id, type, actionUserId, eventId, plan_type) {
        let param = {
          user_id: this.userId,
          action_user_id: actionUserId,
          event_id: eventId
        }
        if(plan_type == 'company_plan') {
          this._plansService.clearPlanConfirmation(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].confirmed = 0;
                  this.planParticipants[index].clear_confirmed = 1;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        } else {
          this._plansService.clearConfirmation(id, param)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.planParticipants.forEach((participant, index) => {
              if(participant.participant_id == id) {
                  this.planParticipants[index].confirmed = 0;
                  this.planParticipants[index].clear_confirmed = 1;
              }
            })
            this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
          }, err => {
            console.log('err: ', err);
          })
        }
    }

    async open(message: string, action: string) {
      await this._snackBar.open(message, action, {
          duration: 3000,
          panelClass: ["info-snackbar"],
      });
  }

    filterCity(event) {
        this.list?.forEach((item) => {
            if (item.city === event) {
              item.selected = true;
            } else {
              item.selected = false;
            }
        });
        this.selectedCity = event || "";
        this.loadPlans(this.allPlansData);
    }

    handleCreateRoute() {
        this._router.navigate([`/plans/create/0/4`]);
    }

    downloadEventExcel(event) {
        let plan_data = this.plansData.filter(evt => {
          return event.id == evt.id
        })
        let participants = this.planParticipants.filter(p => {
          return p.id == event.id
        })
        if(participants && participants.length > 0) {
          participants = participants.sort((a, b) => {
            return b.participant_order - a.participant_order
          })
        }
    
        if(this.status == 'past') {
          participants = participants.filter(cp => {
            return cp.confirmed == 1 && cp.clear_confirmed != 1
          })
        } else if(this.status == 'salesprocess') {
          participants = participants.filter(cp => {
            return cp.attended == 1 && cp.clear_attended != 1 && cp.role == 'Guest'
          })
        }
    
        let event_data: any[] = [];
        if(participants) {
          participants.forEach(p => {
            let match = event_data.some(a => a.participant_id === p.participant_id);
            if(!match) {
              let status = this._translateService.instant('guests.notconfirmed');
              if(this.status == 'past') {
                if(p.attended == 1) {
                  status = this._translateService.instant('guests.attended');
                } else {
                  status = this._translateService.instant('guests.notattended');
                }
              } else {
                if(p.confirmed == 1) {
                  status = this._translateService.instant('guests.confirmed');
                }
              }
    
                let plan_date_display = moment.utc(plan_data[0].plan_date).locale(this.language).format('DD-MM-YYYY HH:mm')
                let date_display = moment.utc(plan_data[0].plan_date).locale(this.language).format('M/D/YYYY')
                let time_display = moment.utc(plan_data[0].plan_date).locale(this.language).format('HH') + 'h'
                let user_name = (p.first_name ? (p.first_name + ' ') : '') + (p.last_name ? (p.last_name + ' ') : '')
                event_data.push({
                    title: plan_data[0].title,
                    date: plan_date_display,
                    participant_name: user_name,
                    participant_role: p.role,
                    participant_phone: p.phone,
                    participant_email: p.email,
                    participant_zip_code: p.zip_code,
                    participant_invited_by: p.invited_by,
                    attendance: status,
                    registered: p.participant_created ? moment(p.participant_created).format('DD-MM-YYYY HH:mm') : ''
                })
            }
          });
        }
    
        this._excelService.exportAsExcelFile(event_data, 'event-' + event.id);
        this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}