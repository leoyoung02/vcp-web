import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StarRatingComponent } from "@lib/components";
import { IdealButtonComponent } from "@share/components/ideal-button/ideal-button.component";
import { TarotCardComponent } from "@share/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CategoryCardComponent } from "@share/components/category-card/category-card.component";
import { TarotCardPortraitComponent } from "@share/components/tarot-card-portrait/tarot-card-portrait.component";
import { BlogCardComponent } from "@share/components/blog-card/blog-card.component";

@Component({
  selector: "app-astroideal-home",
  standalone: true,
  templateUrl: "./astroideal-home.component.html",
  imports: [StarRatingComponent, TarotCardComponent, IdealButtonComponent, FontAwesomeModule, CategoryCardComponent, TarotCardPortraitComponent, BlogCardComponent ],
})
export class AstroIdealHomeComponent {
  // Add component logic hereCompo
  professionalData = {
    image: "string.png",
    title: "string",
    description: "string",
    specialties: ["string"],
    rating: 4,
    salary: "EUR 3.5",
    rate: 3.5,
    rate_cureency: "EUR",
  };

  arrowRightIcon = faArrowRight;
}
