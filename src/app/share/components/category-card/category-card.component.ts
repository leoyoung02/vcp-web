import { Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";

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
