import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'plans-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './list.component.html',
})
export class ListComponent {}