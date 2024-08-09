import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { BlogCardComponent } from "../blog-card/blog-card.component";

@Component({
  selector: "app-free-services",
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TranslateModule,
    BlogCardComponent,
  ],
  templateUrl: "./free-services.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeServicesComponent {
    @Input() services: any;
    @Input() language: any;
    @Input() page: any;

    titleTranslator(item: any): string {
      switch (this.language) {
        case "en":
          return item.en_title;
        case "es":
          return item.es_title;
        case "fr":
          return item.fr_title;
        case "eu":
          return item.eu_title;
        case "ca":
          return item.ca_title;
        case "de":
          return item.de_title;
        case "it":
          return item.it_title;
        default:
          return "dummy";
      }
    }
  
    descriptionTranslator(item: any): string {
      switch (this.language) {
        case "en":
          return item.en_description;
        case "es":
          return item.es_description;
        case "fr":
          return item.fr_description;
        case "eu":
          return item.eu_description;
        case "ca":
          return item.ca_description;
        case "de":
          return item.de_description;
        case "it":
          return item.it_description;
        default:
          return "dummy";
      }
    }
}