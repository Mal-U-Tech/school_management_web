import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.sass'],
})
export class AddSubjectsComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _Activatedroute: ActivatedRoute
  ) {}
  public sub: any;
  public depts: any[] = [];
  public elements: any[] = [];

  ngOnInit(): void {
    this.sub = this._Activatedroute.queryParams.subscribe((params) => {
      this.depts = JSON.parse(params['departments']);
      this.depts.forEach((el) => {
        // console.log(el);
        this.elements.push(el);
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  buildDepartment() {
    let container = this.document.getElementById('builder');

    // for each department build a title and add inputs for the
  }

  addIn(num: any) {
    console.log(`This is the current index ${num}`);

    var container = this.document.getElementById(`${num}`);
    var input = this.document.createElement('input');
    input.type = 'text';
    input.name = `subject_${num}`;
    input.value = '';
    input.placeholder = 'Subject';
    input.style.cssText =
      'outline:none;margin:5px auto 5px auto;height:25px;font-size:15pt;display:flex;width:50%;';
    container?.appendChild(input);
    // container?.appendChild(this.document.createElement('br'));

    var input = this.document.createElement('input');
    input.type = 'text';
    input.name = `subject_${num}`;
    input.value = '';
    input.placeholder = 'Level: Secondary/High School';
    input.style.cssText =
      'outline:none;margin:5px auto 5px auto;height:25px;font-size:15pt;display:flex;width:50%;';
    container?.appendChild(input);
    container?.appendChild(this.document.createElement('br'));
  }

  addSubjects() {
    var data: any[] = [];
    for (var i = 0; i < this.depts.length; i++) {
      var div = this.document.getElementById(`${i}`);

      let subjects = this.document.getElementsByName(
        `subject_${i}`
      ) as NodeListOf<HTMLInputElement>;

      // let level = this.document.getElementsByName(
      //   `level_${i}`
      // ) as NodeListOf<HTMLInputElement>;

      // console.log(`Department: ${this.depts[i].name}`);
      // // console.log(`Subject: ${subjects[1].value}`);
      // subjects.forEach((element) => {
      //   console.log(`${element.value}`);
      // });
      for (let j = 0; j < subjects.length; j = j + 2) {
        console.log(
          `Department ${this.depts[i].name} \nSubject ${
            subjects[j].value
          } \nLevel ${subjects[j + 1].value}`
        );

        data.push({
          department_id: this.depts[i]._id,
          name: subjects[j].value,
          level: subjects[j + 1].value,
        });
      }
      // level.forEach((element) => {
      //   console.log(`Level: ${element.value}`);
      // });
    }

    console.log(data);
  }
}
