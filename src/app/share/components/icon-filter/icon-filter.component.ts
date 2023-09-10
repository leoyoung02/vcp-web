import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { initFlowbite } from "flowbite";

@Component({
  selector: "app-icon-filter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./icon-filter.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconFilterComponent {
    @Input() list: any;
    @Input() icon: any;
    @Output() filterList = new EventEmitter();

    ngOnChanges(changes: SimpleChange) {
      initFlowbite();
    }

    handleFilter(event) {
        this.filterList.emit(event);
    }

    async ngOnInit() {
      initFlowbite();
    }
}