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
  chat: boolean;
  voice_call: boolean;
  video_call: boolean;
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
  selector: "app-tarot-card",
  templateUrl: "./tarot-card.component.html",
})
export class TarotCardComponent {
  @Input() cardData!: ITarotCardData;
  @Input() direction: "flex-row" | "flex-col" = "flex-col";
  commentIcon = faComment;
  phoneIcon = faPhoneFlip;
  videoIcon = faVideo;
}
