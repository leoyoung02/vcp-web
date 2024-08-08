import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from "@angular/core";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LocalService } from "@share/services";
import { Subject } from "rxjs";
import { environment } from "@env/environment";
import DateRangePicker from 'flowbite-datepicker/DateRangePicker';

declare var Datepicker: any;
Datepicker.locales.es = {
    days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: "Hoy",
    monthsTitle: "Meses",
    clear: "Borrar",
    weekStart: 1,
    format: "dd/mm/yyyy"
};

@Component({
    selector: "app-astro-ideal-transactions",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    templateUrl: "./transactions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
    private destroy$ = new Subject<void>();

    @Input() buttonColor: any;

    languageChangeSubscription;
    language: any;
    menu: any = [];

    element: HTMLElement | undefined;
    selectedStartDate!: Date;
    selectedEndDate!: Date;

    transactions: any = [];
    dataSource: any;
    displayedColumns = ['service_type', 'date_time', 'invoice_minutes', 'price_per_minute', 'platform_percentage', 'total', 'customer']
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined
    @ViewChild(MatSort, { static: false }) sort: MatSort | undefined

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
    ) { }

    async ngOnInit() {
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");

        this.languageChangeSubscription =
            this._translateService.onLangChange.subscribe(
                (event: LangChangeEvent) => {
                    this.language = event.lang;
                    this.initializePage();
                }
            );

        this.initializePage();
    }

    ngAfterViewInit(): void {
        const dateRangePickerEl = document.getElementById('date-rangepicker');
        console.log(DateRangePicker)
        new DateRangePicker(dateRangePickerEl, {
            format: 'dd/mm/yyyy',
            orientation: 'bottom',
            language: 'es',
            weekStart: 1,
        });
    }

    onDatePicked($event: any, mode) {
        switch(mode) {
            case 'start':
                this.selectedStartDate = new Date($event.detail.date);
                break;
            case 'end':
                this.selectedEndDate = new Date($event.detail.date);
                break;
        }
    }

    onDateFocus($event: any) {
        setTimeout(() => {
            let element = <HTMLElement>document.querySelector('.datepicker.datepicker-dropdown.dropdown.absolute.top-0.left-0.z-50.pt-2.active.block.datepicker-orient-bottom.datepicker-orient-left');
            element?.classList.remove('top-0')
            element?.classList.remove('left-0')
            if(element) {
                element.style.visibility = "initial";
            }
        }, 100)     
    }

    initializePage() {
        this.initializeMenu();
        this.refreshTable();
    }

    initializeMenu() {
        this.menu = [
            {
                id: 1,
                text: this._translateService.instant('user-panel.contactwithprofessional'),
                action: 'contacts',
                selected: true,
            },
            {
                id: 2,
                text: this._translateService.instant('user-panel.salesservices'),
                action: 'services',
                selected: false,
            },
            {
                id: 3,
                text: this._translateService.instant('user-panel.payments'),
                action: 'payments',
                selected: false,
            }
        ]
    }

    refreshTable(keepPage: boolean = false) {
        this.dataSource = new MatTableDataSource(this.transactions)
        if (this.sort) {
            this.dataSource.sort = this.sort;
        } else {
            setTimeout(() => this.dataSource.sort = this.sort);
        }

        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            this.paginator.firstPage();
            this.paginator._intl.itemsPerPageLabel = this._translateService.instant('user-panel.itemsperpage');
        
        } else {
            setTimeout(() => {
                this.dataSource.paginator = this.paginator;
                if(this.paginator) {
                    this.paginator?.firstPage();
                    this.paginator._intl.itemsPerPageLabel = this._translateService.instant('user-panel.itemsperpage');
                }
            });
        }

    }

    handleMenuClick(event) {
        console.log(event);
        this.menu?.forEach(item => {
            if(item.id == event.id) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        })
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}