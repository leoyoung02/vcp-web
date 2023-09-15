import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { initFlowbite } from "flowbite";

@Component({
  selector: "app-button-group",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./button-group.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  @Input() buttonColor: any;
  @Input() buttonList: any;
  @Input() subcategoryList: any;
  @Input() subsubcategoryList: any;
  @Input() hiddenMainList: any;
  @Output() onButtonClick = new EventEmitter();
  @Output() onSubButtonClick = new EventEmitter();
  @Output() onSubSubButtonClick = new EventEmitter();

  async ngOnInit() {
    initFlowbite();
  }

  handleActionClick(event) {
      this.onButtonClick.emit(event);
  }

  handleSubActionClick(event) {
    this.onSubButtonClick.emit(event);
  }

  handleSubSubActionClick(event) {
    this.onSubSubButtonClick.emit(event);
  }
}