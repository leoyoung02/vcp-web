import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { CompanyService, LocalService } from "@share/services";
import { environment } from "@env/environment";
import { FormsModule } from "@angular/forms";
import { QuillModule } from 'ngx-quill';
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
    QuillModule,
    SafeContentHtmlPipe,
    PageTitleComponent,
  ],
  templateUrl: "./cookie-policy.component.html",
})
export class CookiePolicyComponent implements OnInit, OnDestroy {
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
  cookiePolicy: any;
  policy: any = '';
  @ViewChild('iframeCookiePolicy', { static: false }) iframeCookiePolicy: ElementRef | undefined;
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
      this.cookiePolicy = company[0].cookie_policy;
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
    this.policy = this._sanitizer.bypassSecurityTrustHtml(this.cookiePolicy);
    if(this.policy) {
      this.policy = this.policy?.changingThisBreaksApplicationSecurity;
    }
  }

  ngOnDestroy(): void {
    this.languageChangeSubscription?.unsubscribe();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}