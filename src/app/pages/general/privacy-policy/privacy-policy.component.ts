import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService, UserService } from "@share/services";
import { environment } from "@env/environment";
import { FormsModule } from "@angular/forms";
import { EditorModule } from "@tinymce/tinymce-angular";
import { SafeContentHtmlPipe } from "@lib/pipes";
import { PageTitleComponent } from "@share/components";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule, 
    FormsModule, 
    EditorModule,
    SafeContentHtmlPipe,
    PageTitleComponent,
  ],
  templateUrl: "./privacy-policy.component.html",
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  languageChangeSubscription;
  userId: any;
  language: any;
  features: any;
  companies: any;
  companyId: any;
  domain: any;
  buttonColor: any;
  primaryColor: any;
  isloading: boolean = true;
  companyName: any;
  company: any;
  userDomain: any;
  privacyPolicy: any;
  policy: any = '';
  @ViewChild('iframePrivacyPolicy', { static: false }) iframePrivacyPolicy: ElementRef | undefined;
  @ViewChild('editor', { static: false }) editor: ElementRef | undefined;

  constructor(
    private _translateService: TranslateService,
    private _localService: LocalService,
    private _companyService: CompanyService,
    private _sanitizer: DomSanitizer,
    private _router: Router,
  ) {}

  async ngOnInit() {
    this.language = this._localService.getLocalStorage(environment.lslang) || "es";
    this.userId = this._localService.getLocalStorage(environment.lsuserId);
    this._translateService.use(this.language || "es");

    this.companies = this._localService.getLocalStorage(environment.lscompanies)
      ? JSON.parse(this._localService.getLocalStorage(environment.lscompanies))
      : "";
    let company = this._companyService.getCompany(this.companies);
    if (company && company[0]) {
      this.company = company[0];
      this.companyId = company[0].id;
      this.companyName = company[0].entity_name;
      this.domain = company[0].domain;
      this.primaryColor = company[0].primary_color;
      this.buttonColor = company[0].button_color
        ? company[0].button_color
        : company[0].primary_color;
        this.privacyPolicy = company[0].policy;
    }

    this.languageChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          this.language = event.lang;
          this.initializePage();
        }
      );
  }

  initializePage() {

  }

  handleEditorInit(e) {
    this.policy = this._sanitizer.bypassSecurityTrustHtml(this.privacyPolicy);
    setTimeout(() => {
        if (this.editor && this.iframePrivacyPolicy && this.policy?.changingThisBreaksApplicationSecurity) {
            this.editor.nativeElement.style.display = 'block'

            e.editor.setContent(this.policy?.changingThisBreaksApplicationSecurity)
            this.iframePrivacyPolicy.nativeElement.style.height = `${e.editor.container.clientHeight + 200}px`

            this.editor.nativeElement.style.display = 'none'

            this.iframePrivacyPolicy.nativeElement.src =
                'data:text/html;charset=utf-8,' +
                '<html>' +
                '<head>' + e.editor.getDoc().head.innerHTML + '<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Poppins" /><style>* {font-family: "Poppins", sans-serif;}</style></head>' +
                '<body>' + e.editor.getDoc().body.innerHTML + '</body>' +
                '</html>';
            this.iframePrivacyPolicy.nativeElement.style.display = 'block'
        }
    }, 500)
  }

  ngOnDestroy(): void {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}