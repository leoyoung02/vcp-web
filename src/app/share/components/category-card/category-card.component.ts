import { Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface ICategoryCardData {
  title: string;
  image: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: "app-category-card",
  templateUrl: "./category-card.component.html",
})
export class CategoryCardComponent {
  @Input() cardData!: ICategoryCardData;
}
