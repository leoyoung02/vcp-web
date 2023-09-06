import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CompanyService, LocalService } from '@share/services';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '@env/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService, TutorsService } from '@features/services';
import moment from "moment";
import get from 'lodash/get';

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgOptimizedImage],
  templateUrl: './list.component.html'
})
export class TutorsListComponent {
  
}
