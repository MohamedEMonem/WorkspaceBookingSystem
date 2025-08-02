import { Component, Input, input } from '@angular/core';
import { Workspace } from '../../models/workspaceModel';

@Component({
  selector: 'app-workspace-card',
  imports: [],
  templateUrl: './workspace-card.html',
  styleUrl: './workspace-card.css'
})
export class WorkspaceCard {

@Input() workspace! : Workspace

}
