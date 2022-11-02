import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public username = new FormControl('')
  public userSurname = new FormControl('')
  public userContact = new FormControl('')
  public userEmail = new FormControl('')
  public schoolName = new FormControl('')
  public schoolRegion = new FormControl('')
  public userRole = new FormControl('System Administrator')

}
