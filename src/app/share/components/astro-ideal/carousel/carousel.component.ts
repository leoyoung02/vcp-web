import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RitualeCardComponent } from "../rituale-card/rituale-card.component";
import { CarouselModule, OwlOptions } from "ngx-owl-carousel-o";
import { HostListener } from "@angular/core";
import { StarRatingModule } from "angular-star-rating";
import { StarRatingComponent } from "@lib/components";
@Component({
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    CarouselModule,
    RitualeCardComponent,
    StarRatingComponent,
    StarRatingModule,
  ],
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent {
  @Input() items: any[] = [];
  @Input() language: any = "";

  startX: number = 0;
  currentX: number = 0;
  isDragging: boolean = false;
  totalWidth = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes) {
    const itemData = changes.items.currentValue;
    this.totalWidth = 368 * itemData.length + 50 * (itemData.length - 1) - 800;
  }

  @HostListener("mouseup", ["$event"])
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener("mouseleave", ["$event"])
  onMouseLeave() {
    this.isDragging = false;
  }

  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.isDragging = true;

    const moveHandler = (moveEvent: MouseEvent) => {
      if (!this.isDragging) return;

      const deltaX = moveEvent.clientX - this.startX;
      if (this.currentX + deltaX >= 0) this.currentX = 0;
      else if (this.currentX + deltaX <= -(this.totalWidth / 3))
        this.currentX = -this.totalWidth / 3;
      else this.currentX += deltaX;
      this.startX = moveEvent.clientX;
      this.cdr.detectChanges();
    };

    const upHandler = () => {
      this.isDragging = false;
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
  }

  get transform() {
    return `translateX(${this.currentX * 3}px)`;
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    // margin: 135,
    navSpeed: 700,
    navText: ["", ""],
    // items: 3,
    responsive: {
      0: {
        items: 1,
      },
      1000: {
        items: 2,
      },
      1532: {
        items: 3,
      },
      1600: {
        items: 4,
      },
    },
    nav: false,
    // autoWidth: true,
  };

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
