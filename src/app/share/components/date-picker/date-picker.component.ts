import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChange
} from "@angular/core";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
  } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { LocalService } from "@share/services";
import { environment } from "@env/environment";
import { Subject } from "rxjs";
import moment from "moment";

@Component({
    selector: "app-date-picker",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        NgOptimizedImage,
        FormsModule,
    ],
    templateUrl: "./date-picker.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
    private destroy$ = new Subject<void>();

    @Input() birthday: any;
    @Output() onSelectedDate = new EventEmitter();
    
    MONTH_NAMES = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    MONTH_NAMES_ES = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];
    DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    DAYS_ES = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    showDatepicker = false;
    datepickerValue!: string;
    month!: number; // !: mean promise it will not be null, and it will definitely be assigned
    year!: number;
    no_of_days = [] as number[];
    blankdays = [] as number[];

    languageChangeSubscription;
    language: any;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
    ) { }

    ngOnChanges(changes: SimpleChange) {
        let birthdayChange = changes['birthday'];
        if (birthdayChange?.currentValue && birthdayChange?.previousValue != birthdayChange?.currentValue) {
            this.birthday = birthdayChange.currentValue;
            this.initialize();
        }
    }

    async ngOnInit() {
        this.language = this._localService.getLocalStorage(environment.lslang);
        this._translateService.use(this.language || "es");

        this.languageChangeSubscription =
        this._translateService.onLangChange.subscribe(
            (event: LangChangeEvent) => {
                this.language = event.lang;
                this.initialize();
            }
        );

        this.initialize();
    }

    initialize() {
        this.month = moment().month();
        this.year = moment().year();
        
        if(this.birthday) {
            this.datepickerValue = moment(this.birthday).format('DD/MM/YYYY');
            this.month = moment(this.birthday).month();
            this.year = moment(this.birthday).year();
        }

        this.getNoOfDays()
    }

    isToday(date: any) {
        const today = new Date();
        const d = new Date(this.year, this.month, date);
        return today.toDateString() === d.toDateString() ? true : false;
    }

    getDateValue(date: any) {
        let selectedDate = new Date(this.year, this.month, date);
        this.datepickerValue = moment(selectedDate)?.format('DD/MM/YYYY');
        this.showDatepicker = false;
        this.onSelectedDate.emit(moment(selectedDate)?.format('YYYY-MM-DD'));
    }

    getNoOfDays(mode: string = '') {
        if(mode) {
            switch(mode) {
                case 'next':
                    this.year = this.month < 11 ? this.year : (this.year + 1);
                    this.month = this.month >= 0 && this.month < 11 ? (this.month + 1) : (this.month == 11 ? this.month = 0 : this.month);
                    break;
                case 'prev':
                    this.year = this.month == 0 ? (this.year - 1) : this.year;
                    this.month = this.month == 0 ? (this.month = 11) : (this.month - 1);
                    break;
            }
        }

        const daysInMonth = moment().daysInMonth();

        // find where to start calendar day of week
        let dayOfWeek = new Date(this.year, this.month).getDay();
        let blankdaysArray: any[] = [];
        for (var i = 1; i <= dayOfWeek; i++) {
            blankdaysArray.push(i);
        }

        let daysArray: any[] = [];
        for (var i = 1; i <= daysInMonth; i++) {
            daysArray.push(i);
        }

        this.blankdays = blankdaysArray;
        this.no_of_days = daysArray;
    }

    trackByIdentity = (index: number, item: any) => item;

    ngOnDestroy() {
        this.languageChangeSubscription?.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
