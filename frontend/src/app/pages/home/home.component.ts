import { Component, OnInit } from '@angular/core';
import { WorkspaceComponent } from "../../components/workspace/workspace.component";
import { WorkspacesComponent } from "../workspaces/workspaces.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [WorkspaceComponent, WorkspacesComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
