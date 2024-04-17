import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input
} from "@angular/core";

@Component({
  selector: "app-comments",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./comments.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsComponent {
    
}
