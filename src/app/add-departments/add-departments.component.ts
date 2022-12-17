import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddDepartmentsService } from '../shared/add-departments/add-departments.service';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-departments.component.html',
  styleUrls: ['./add-departments.component.sass'],
})
export class AddDepartmentsComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public apiService: AddDepartmentsService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  appendInput() {
    let container = this.document.getElementById('input-container');
    // console.log(container.a);
    let input = this.document.createElement('input');
    input.type = 'text';
    input.name = 'classname';
    input.style.cssText =
      'outline:none;margin:5px 0 5px 0;height:25px;font-size:15pt';
    container?.appendChild(input);
    container?.appendChild(this.document.createElement('br'));
  }

  submitDepartments() {
    var input = this.document.getElementsByName('department');
    var departmentsArray = [];

    for (var i = 0; i < input.length; i++) {
      var a = input[i] as HTMLInputElement;
      departmentsArray.push({ name: a.value });
    }

    // make api call
    this.apiService
      .postDepartmentsArray({ names: departmentsArray })
      .subscribe((data: any) => {
        console.log(data);
        // this.router.navigate(['/']);
      });
  }
}
