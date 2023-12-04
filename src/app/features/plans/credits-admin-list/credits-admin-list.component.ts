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
    selector: 'app-credits-admin-list',
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
    templateUrl: './credits-admin-list.component.html',
})
export class CreditsAdminListComponent {
    private destroy$ = new Subject<void>();

    @Input() list: any;
    @Input() company: any;
    @Input() buttonColor: any;
    @Input() primaryColor: any;
    @Input() userId: any;
    @Input() superAdmin: any;
    @Input() language: any;

    languageChangeSubscription;
    isMobile: boolean = false;
    searchText: any;
    placeholderText: any;
    creditsData: any = [];
    dataSource: any;
    displayedColumns = ["name", "city", "event", "date_display", "credits"];
    pageSize: number = 10;
    pageIndex: number = 0;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined;
    @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
    planParticipants: any = [];
    searchKeyword: any;
    date: Date = new Date();
    allCreditsData: any[] = [];
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
        this.fetchCreditsData();
        this.initializeSearch();
    }

    fetchCreditsData() {
      this._plansService
        .fetchCreditsData(this.company?.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            console.log(data)
            this.formatCredits(data?.credits);
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

    handleSearch(event) {
      this.searchKeyword = event;
      this.loadCredits(this.allCreditsData);
    }

    formatCredits(credits) {
      let data;
      if (credits?.length > 0) {
        data = credits?.map((item) => {
          let name = item?.first_name ? `${item?.first_name} ${item?.last_name}` : (item?.name || item?.email);
  
          return {
            ...item,
            name,
            event: this.getEventTitle(item),
            date_display: moment.utc(item.created_at).locale(this.language).format('D MMMM YYYY')
          };
        });
      }
      if (this.allCreditsData?.length == 0) {
        this.allCreditsData = data;
      }
  
      if (data?.length > 0) {
        data = data.sort((a, b) => {
          const oldDate: any = new Date(a.created_at);
          const newDate: any = new Date(b.created_at);
          return newDate - oldDate;
        });
      }
  
      this.loadCredits(data);
    }

    getEventTitle(event) {
      return this.language == "en"
        ? (event.title_en && event.title_en != 'undefined')
          ? event.title_en || event.title
          : event.title
        : this.language == "fr"
        ? event.title_fr
          ? event.title_fr || event.title
          : event.title
        : this.language == "eu"
        ? event.title_eu
          ? event.title_eu || event.title
          : event.title
        : this.language == "ca"
        ? event.title_ca
          ? event.title_ca || event.title
          : event.title
        : this.language == "de"
        ? event.title_de
          ? event.title_de || event.title
          : event.title
        : event.title;
    }

    loadCredits(data) {
      this.creditsData = this.allCreditsData;

      if(this.searchKeyword && this.creditsData) {
        this.creditsData = this.creditsData.filter(p => {
          return (p.name && p.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >= 0 ) ||
            p.event && p.event.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) >= 0 
        })
      }

      if(this.selectedCity) {
        this.creditsData = this.creditsData.filter(p => {
          return p.city && p.city.toLowerCase().indexOf(this.selectedCity.toLowerCase()) >= 0 
        })
      }

      this.refreshTable(this.creditsData);
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
        this.creditsData.slice(
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
      this.loadCredits(this.allCreditsData);
    }

    downloadExcel() {
      let credits_data: any[] = [];
      if(this.creditsData?.length > 0) {
        this.creditsData.forEach(p => {
          let date_display = moment.utc(p?.created_at).locale(this.language).format('DD-MM-YYYY')
          credits_data.push({
            'Nombre': p.name,
            'Actividad': p.event,
            'Fecha': date_display,
            'Campus': p.city,
            'Créditos': p.credits,
          })
        });
      }
    
      this._excelService.exportAsExcelFile(credits_data, 'creditos-' +  moment().format('YYYYMMDDHHmmss'));
      this.open(this._translateService.instant("dialog.savedsuccessfully"), "");
    }

    ngOnDestroy() {
      this.languageChangeSubscription?.unsubscribe();
      this.destroy$.next();
      this.destroy$.complete();
    }
}