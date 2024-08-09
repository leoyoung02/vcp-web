import { Component, Input } from "@angular/core";
import { StarRatingComponent } from "@lib/components";
import {
  StarRatingModule,
} from 'angular-star-rating';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

interface ICategoryCardData {
  title: string;
  description: string;
  image: string;
  amount: string;
  currency: string;
  subcategories: any[];
}

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslateModule, StarRatingComponent, StarRatingModule],
  selector: "app-rituale-card",
  templateUrl: "./rituale-card.component.html",
})
export class RitualeCardComponent {
  @Input() cardData!: ICategoryCardData;
  @Input() language!: string;

  titleTranslator(item: any): string {
    let title = "";
    switch (this.language) {
      case "en":
        title = item.en_title;
        break;
      case "es":
        title = item.es_title;
        break;
      case "fr":
        title = item.fr_title;
        break;
      case "eu":
        title = item.eu_title;
        break;
      case "ca":
        title = item.ca_title;
        break;
      case "de":
        title = item.de_title;
        break;
      case "it":
        title = item.it_title;
        break;
      default:
        title = "dummy";
        break;
    }
    return title || item.es_title || "Empty";
  }
}
