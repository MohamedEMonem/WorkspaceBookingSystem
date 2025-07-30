import { Component, OnInit } from '@angular/core';
import { WorkspaceComponent } from "../../components/workspace/workspace.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [WorkspaceComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
