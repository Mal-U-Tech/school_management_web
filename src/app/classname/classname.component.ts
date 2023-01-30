import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassnameApiService } from '../shared/classname/classname-api.service';

@Component({
  selector: 'app-classname',
  templateUrl: './classname.component.html',
  styleUrls: ['./classname.component.sass'],
})
export class ClassnameComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public apiService: ClassnameApiService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  Geeks() {
    var input = this.document.getElementsByName('classname');
    var classnamesArray = [];
    for (var i = 0; i < input.length; i++) {
      var a = input[i] as HTMLInputElement;
      // console.log(`This is the value ${a.value}`);
      // var k = k + 'array[' + i + '].value= ' + a + '';
      classnamesArray.push({ name: a.value });
    }

    // make api call via service
    this.apiService
      .postClassnamesArray({ names: classnamesArray })
      .subscribe((data) => {
        console.log(data);
        this.router.navigate(['/add-departments']);
      });
  }

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
    // this.document.body.appendChild(input);
  }
}
