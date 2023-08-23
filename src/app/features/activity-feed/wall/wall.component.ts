import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'activity-feed-wall',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './wall.component.html',
})
export class WallComponent {
    @Input() id!: number;
}