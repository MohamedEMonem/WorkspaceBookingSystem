import { Component, OnInit } from '@angular/core';
import { UserApiService } from '../../network/services/user-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: []
})
export class HomeComponent implements OnInit {

  constructor(private userApiService: UserApiService) { }

  ngOnInit() {
  }

  isLoggedIn(): boolean {
    return this.userApiService.isLoggedIn();
  }

}
