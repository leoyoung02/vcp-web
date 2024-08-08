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
}
