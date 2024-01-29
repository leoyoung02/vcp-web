import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  inject,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { LogoComponent } from "../logo/logo.component";
import { TranslateModule } from "@ngx-translate/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { initFlowbite } from "flowbite";
import { AuthService, MenuService } from "@lib/services";
import { DateAgoPipe } from "@lib/pipes";
import { CreditsDisplayComponent } from "../credits-display/credits-display.component";

@Component({
  selector: "app-user-menu",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FontAwesomeModule,
    DateAgoPipe,
    LogoComponent,
    CreditsDisplayComponent,
  ],
  templateUrl: "./user-menu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  menus$ = inject(MenuService).menus$;
  
  @Input() menus: any;
  @Input() company: any;
  @Input() otherSettings: any;
  @Input() username: any;
  @Input() isAdmin: any;
  @Input() languages: any;
  @Input() language: any;
  @Input() imageSrc: any;
  @Input() userid: any;
  @Input() notifications: any;
  @Input() popupNotifications: any;
  @Input() canManageEvents: any;
  @Input() customMemberTypeName: any;
  @Input() currentUser: any;
  @Input() myActivitiesTitle: any;
  @Input() myClubsTitle: any;
  @Input() buttonColor: any;
  @Input() isTutorMenuVisible: any;
  @Input() manageMembers: any;
  @Input() userTypeName: any;
  @Input() superTutor: any;
  @Input() cityAdmin: any;
  @Input() hasCreditSetting: any;
  @Input() hasCreditPackageSetting: any;
  @Input() isTutorUser: any;
  @Input() showProfileButton: any;
  @Input() tutorManageStudentAccess: any;
  @Input() perHourCommission: any;
  @Input() separateCourseCredits: any;
  @Input() courseSubscriptions: any;
  @Input() userCourseCredits: any;
  @Input() courses: any;
  @Input() creditPackages: any;
  @Input() hasCredits: any;
  @Input() campus: any;
  @Input() isNetculturaUser: any;
  @Input() potSuperTutor:any
  @Output() changeLanguage = new EventEmitter();

  companyName: any;
  primaryColor: any;
  menuColor: any;

  navigationSubscription;
  hasActivityFeed: boolean = false;
  myActivities: any = [];
  isMyClubsActive: boolean = false;
  isMyActivitiesActive: boolean = false;
  myClubs: any;

  constructor(private _router: Router, private _authService: AuthService) {
      
  }

  async ngOnInit() {
    
  }

  hasAccess(path) {
    let access = true;
    if (this.menus && this.menus.length) {
      let feature =
        this.menus &&
        this.menus.filter((m) => {
          return m.path == path;
        });
      if (feature && feature.length > 0) {
      } else {
        access = false;
      }
    }

    return access;
  }

  logout(): void {
    this._authService.logout();
    this._router.navigate(["/auth/login"]);
  }

  toggleHover(event) {
    if(event) {
      setTimeout(() => {
        initFlowbite();
      }, 100)
    }
  }

  ngOnDestroy() {
      this.navigationSubscription?.unsubscribe();
  }
}