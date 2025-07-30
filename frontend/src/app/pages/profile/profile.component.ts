import { Component, OnInit } from '@angular/core';
import { User } from '../../models/userModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit  {

  constructor() { }

  ngOnInit() {

  }
user:User ={
  _id: 'aaa',
  name: 'marwan',
  email: 'marwan@gmail.com',
  phone: '0123456789',
  gender: 'male',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
}

}
