import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-astro-ideal-radial-progress",
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: "./radial-progress.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadialProgressComponent {
  private destroy$ = new Subject<void>();

  @Input() percentComplete: any;

  constructor() { }
  
  async ngOnInit() {
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}