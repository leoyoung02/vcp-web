import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
    @Input() id!: number;
}