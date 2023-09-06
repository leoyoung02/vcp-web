import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
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
    @Output() filterList = new EventEmitter();

    handleFilter(event) {
        this.filterList.emit(event);
    }

    async ngOnInit() {
        initFlowbite();
    }
}