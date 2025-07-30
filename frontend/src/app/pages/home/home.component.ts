import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [HeaderComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
