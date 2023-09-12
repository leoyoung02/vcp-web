import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-no-access",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./no-access.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoAccessComponent {}