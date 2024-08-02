import { Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { StarRatingComponent } from "@lib/components";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IdealButtonComponent } from "../ideal-button/ideal-button.component";
import {
  faComment,
  faPhoneFlip,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

interface ITarotCardData {
  image: string;
  title: string;
  description: string;
  specialties: string[];
  rating: number;
  salary: string;
  rate: number;
  rate_currency: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    FontAwesomeModule,
    StarRatingComponent,
    IdealButtonComponent,
  ],
  selector: "app-tarot-card-portrait",
  templateUrl: "./tarot-card-portrait.component.html",
})
export class TarotCardPortraitComponent {
  @Input() cardData!: ITarotCardData;
  @Input() direction: "flex-row" | "flex-col" = "flex-col";

  mockData: ITarotCardData = {
    image: "",
    title: "Nombre Tarotista",
    description: "Lorem ipsum dolor sit amet consectetur. Tortor purus scelerisque faucibus gravida mus ultricies dignissim. Non platea vestibulum laoreet adipiscing lobortis",
    specialties: [""],
    rating: 4,
    salary: "EUR 20,00",
    rate: 4,
    rate_currency: "$"
  }
  commentIcon = faComment;
  phoneIcon = faPhoneFlip;
  videoIcon = faVideo;
}
