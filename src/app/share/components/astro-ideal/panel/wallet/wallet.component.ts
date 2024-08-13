import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
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
import { initFlowbite } from "flowbite";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

@Component({
    selector: "app-astro-ideal-wallet",
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
    ],
    templateUrl: "./wallet.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletComponent {
    private destroy$ = new Subject<void>();

    @Input() id: any;
    @Input() companyId: any;
    @Input() buttonColor: any;
    @Input() userCurrency: any;
    @Input() walletAmount: any;
    @Input() walletData: any;
    @Input() withdrawAmount: any;

    languageChangeSubscription;
    language: any;

    @ViewChild("modalbutton2", { static: false }) modalbutton2:
    | ElementRef
    | undefined;
    @ViewChild("closemodalbutton2", { static: false }) closemodalbutton2:
    | ElementRef
    | undefined;

    constructor(
        private _translateService: TranslateService,
        private _localService: LocalService,
        private _professionalsService: ProfessionalsService,
        private _snackBar: MatSnackBar,
    ) { }

    async ngOnInit() {
        initFlowbite();
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
        
    }

    withdraw() {
        this.withdrawAmount = this.walletAmount;
        this.modalbutton2?.nativeElement?.click();
    }

    proceedToWithdraw() {
        let params = {
            id: this.id,
            company_id: this.companyId,
            withdraw_amount: this.withdrawAmount,
        }

        this._professionalsService
            .withdraw(params)
            .subscribe(
                (response) => {
                    this.open(this._translateService.instant('dialog.savedsuccessfully'), '');
                },
                (error) => {
                    this.open(this._translateService.instant("dialog.error"), "");
                }
            );

        this.closemodalbutton2?.nativeElement?.click();
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