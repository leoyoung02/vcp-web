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
  selector: "app-type-filter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./type-filter.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeFilterComponent {
    @Input() list: any;
    @Input() icon: any;
    @Input() mode: any;
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

    getSelectedItem() {
      let text = ''
      if(this.list?.length > 0) {
        let selected = this.list?.find((f) => f.selected);
        text = selected?.text;
      }

      return text;
    }
}