import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IconFilterComponent } from "../icon-filter/icon-filter.component";
import { TypeFilterComponent } from "../type-filter/type-filter.component";

@Component({
  selector: "app-filter",
  standalone: true,
  imports: [CommonModule, FormsModule, IconFilterComponent, TypeFilterComponent],
  templateUrl: "./filter.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
    @Input() mode;
    @Input() buttonColor;
    @Input() list: any;
    @Input() icon: any;
    @Input() buttonList: any;
    @Output() filterList = new EventEmitter();
    @Output() onButtonClick = new EventEmitter();

    isActiveFilter: boolean = false;

    async ngOnInit() {
      let selected = this.mode == 'clubs' ? 
        localStorage.getItem('club-filter-city') : 
        (this.mode == 'plans' ? 
          localStorage.getItem('plan-filter-city') : 
            (this.mode == 'tutors' ? 
              localStorage.getItem('tutor-filter-city') : 
              (this.mode == 'members' ? 
                localStorage.getItem('member-filter-city') : 
                ''
              )
            )
        );
      this.isActiveFilter = selected ? true : false;

      if(selected && this.mode == 'plans') {
        if(this.list?.length > 0) {
          this.list.forEach(item => {
            if(item.city == selected) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          })
        }
      }
    }

    showFilter() {
      this.isActiveFilter = !this.isActiveFilter;
    }

    filteredCity(event) {
      this.filterList.emit(event);
    }

    filteredType(event) {
      this.onButtonClick.emit(event);
    }
}