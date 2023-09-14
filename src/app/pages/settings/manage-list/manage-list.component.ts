import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ManageUsersComponent } from "../users/users.component";
import { ManageMemberTypesComponent } from "../member-types/member-types.component";

@Component({
  selector: "app-manage-list",
  standalone: true,
  imports: [CommonModule, ManageUsersComponent, ManageMemberTypesComponent],
  templateUrl: "./manage-list.component.html",
})
export class ManageListComponent {
  @Input() list: any;
}
