import { Component, Input } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IIdealButtonData {
  title: string;
  icon: IconDefinition;
  titleStyle?: string;
  backgroundColor?: string;
  textColor?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NgOptimizedImage],
  selector: "app-ideal-button",
  templateUrl: "./ideal-button.component.html",
})
export class IdealButtonComponent {
  @Input() buttonData!: IIdealButtonData;
  @Input() width!: string;
  @Input() height!: string;
}
