import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from "@angular/core";
import {
    LangChangeEvent,
    TranslateModule,
    TranslateService,
} from "@ngx-translate/core";
import { LocalService } from "@share/services";
import { Subject, takeUntil } from "rxjs";
import { environment } from "@env/environment";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProfessionalsService } from "@features/services";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
    selector: "app-astro-ideal-withdrawal-methods",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
    ],
    templateUrl: "./withdrawal-methods.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawalMethodsComponent {
    private destroy$ = new Subject<void>();

    @Input() id: any;
    @Input() companyId: any;
    @Input() buttonColor: any;
    @Input() title: any;
    @Input() withdrawalMethods: any;
    @Input() walletData: any;

    languageChangeSubscription;
    language: any;
    stripeActive: boolean = false;
    paypalActive: boolean = false;
    selectedMethod: any;
    email: any;
    phone: any;
    accountId: any;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _professionalsService: ProfessionalsService,
        private _snackBar: MatSnackBar,
    ) { }

    ngOnChanges(changes: SimpleChange) {
        let withdrawalMethodsChange = changes['withdrawalMethods'];
        if (withdrawalMethodsChange?.currentValue?.id > 0) {
          this.withdrawalMethods = withdrawalMethodsChange.currentValue;
          this.initializePage();
        }
    }

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

    initializePage() {
        this.initializePaymentMethods();
        this.initializeWallet();
    }

    initializePaymentMethods() {
        if(this.withdrawalMethods) {
            this.stripeActive = this.withdrawalMethods?.stripe == 1 ? true : false;
            this.paypalActive = this.withdrawalMethods?.paypal == 1 ? true : false;
        }
    }

    initializeWallet() {
        if(this.walletData) {
            this.selectedMethod = this.walletData?.preferred_withdrawal_account;
            if(this.stripeActive) {
                this.accountId = this.walletData?.stripe_connect_account_id;
            }
            if(this.paypalActive) {
                this.email = this.walletData?.email;
                this.phone = this.walletData?.phone;
            }
        }
    }

    handleChangePaymentMethod(event) {
        this.selectedMethod = event?.target?.value;
    }

    saveWithdrawalInformation() {
        if(this.canSave()) {
            let params = {
                company_id: this.companyId,
                professional_id: this.id,
                preferred_withdrawal_account: this.selectedMethod,
                email: this.email || '',
                phone: this.phone || '',
                stripe_connect_account_id: this.accountId || '',
            }
    
            this._professionalsService
            .editWalletSettings(params)
            .subscribe(
                (response) => {
                    this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
                },
                (error) => {
                    this.open(this._translateService.instant("dialog.error"), "");
                }
            );
        }
    }

    canSave() {
        let result = false;

        if(this.selectedMethod == 'PayPal') {
            if(this.email && this.phone && this.validatePhoneForE164()) {
                result = true;
            }
        } else if(this.selectedMethod == 'Stripe') {
            if(this.accountId) {
                result = true;
            }
        }

        return result;
    }

    validatePhoneForE164() {
        const phoneNumber = this.phone;
        const regEx = /^\+[1-9]\d{10,14}$/;
        return regEx.test(phoneNumber);
    };

    accessStripe() {

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