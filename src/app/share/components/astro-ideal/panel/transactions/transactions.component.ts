import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import DateRangePicker from 'flowbite-datepicker/DateRangePicker';
import moment from "moment";
import { ProfessionalsService } from "@features/services";

@Component({
    selector: "app-astro-ideal-transactions",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    templateUrl: "./transactions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
    private destroy$ = new Subject<void>();

    @Input() id: any;
    @Input() buttonColor: any;
    @Input() selectedStartDate: any;
    @Input() selectedEndDate: any;
    @Input() selectedMonth: any;
    @Input() invoiceTotal: any;
    @Input() selectedInvoiceTotal: any;
    @Input() userCurrency: any;
    @Input() companyName: any;
    @Output() onDateChanged = new EventEmitter();

    languageChangeSubscription;
    language: any;
    menu: any = [];

    element: HTMLElement | undefined;

    transactions: any = [];
    dataSource: any;
    displayedColumns: any;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | undefined
    @ViewChild(MatSort, { static: false }) sort: MatSort | undefined

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _professionalsService: ProfessionalsService,
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
        new DateRangePicker(dateRangePickerEl, {
            format: 'dd/mm/yyyy',
            orientation: 'bottom',
            language: this.language,
            weekStart: 1,
            locale: this.language,
        });
    }

    onDatePicked($event: any, mode) {
        console.log($event.detail.date)
        console.log('mode: ' + mode)

        switch(mode) {
            case 'start':
                this.selectedStartDate = moment($event.detail.date).format('DD/MM/YYYY');
                break;
            case 'end':
                this.selectedEndDate = moment($event.detail.date).format('DD/MM/YYYY');
                break;
        }

        if(this.selectedStartDate && this.selectedEndDate) {
            console.log('start: ' + this.selectedStartDate + ' end: ' + this.selectedEndDate)
            this.getTransactions();
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
        this.initializeTable();
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

    initializeTable() {
        this.displayedColumns = [
            'service_type', 
            'date_time', 
            'invoice_minutes', 
            'price_per_minute', 
            'platform_percentage', 
            'total', 
            'customer'
        ]
        this.getTransactions();
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
        this.menu?.forEach(item => {
            if(item.id == event.id) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        })

        if(event.action == 'services') {
            this.displayedColumns = [
                'service_type', 
                'date_time', 
                'total_invoiced',
                'platform_percentage',
                'customer'
            ]
        } else if(event.action == 'payments') {
            this.displayedColumns = [
                'service_type', 
                'date_time', 
                'total_invoiced',
                'paid',
                'pending'
            ]
        }

        if(this.selectedStartDate && this.selectedEndDate) {
            this.getTransactions();
        }
    }

    getTransactions() {
        let menu_selected = this.menu.find((c) => c.selected);
        this._professionalsService
            .getTransactions(
                this.id, 
                (menu_selected?.action || 'contacts'),
                moment(this.selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                moment(this.selectedEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD'))
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.transactions = this.formatTransactions(data.transactions);

                    this.invoiceTotal = 0;
                    this.transactions?.forEach(txn => {
                        this.invoiceTotal += parseFloat(txn.total) || 0;
                    })

                    this.selectedInvoiceTotal = this.invoiceTotal || 0;

                    this.refreshTable();

                    this.onDateChanged.emit({
                        start_date: moment(this.selectedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        end_date: moment(this.selectedEndDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        invoice_total: this.invoiceTotal,
                        selected_invoice_total: this.selectedInvoiceTotal,
                        transactions: this.transactions,
                        service_type: menu_selected?.action,
                    })
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    formatTransactions(list) {
        return list?.map((row) => {
            let key = row.service_type == 'chat' ? `professionals.${row.service_type}` : `user-panel.${row.service_type}`
            return {
              ...row,
              date_time: moment(row.date_time).locale(this.language).format('DD MMMM YYYY H:mm A'),
              service_type: this._translateService.instant(key),
            }
        })
    }

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}