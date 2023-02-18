import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSubjectsService } from '../shared/add-subjects/add-subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.sass'],
})
export class AddSubjectsComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    private apiService: AddSubjectsService,
    private _snackBar: MatSnackBar,
    public router: Router
  ) {}
  public sub: any;
  public depts: any[] = [];
  public elements: any[] = [];

  public deptSubs: any[] = [];
  ngOnInit(): void {
    this.sub = this._Activatedroute.queryParams.subscribe((params) => {
      this.depts = JSON.parse(params['departments']);
      this.depts.forEach((el) => {
        console.log(el);
        this.elements.push({
          dept_id: el._id,
          dept_name: el.name,
          subjects: [{ name: '', level: '' }],
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  addIn(num: any) {
    this.elements[num].subjects.push({ name: '', level: '' });
  }

  addSubjects() {
    var data: any[] = [];

    for (let i = 0; i < this.elements.length; i = i + 1) {
      const dept = this.elements[i];

      for (let j = 0; j < dept.subjects.length; j = j + 1) {
        const sub = dept.subjects[j];
        data.push({
          department_id: dept.dept_id,
          name: sub.name,
          level: sub.level,
        });
      }
    }

    this.apiService.postSubjects({ subjects: data }).subscribe({
      next: (data: any) => {
        console.log(data);
        // this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.openSnackBar(error, 'Close');
      },
    });

    console.log({ subjects: data });
  }

  removeSubject(i: number, j: number) {
    console.log(this.elements[i].subjects[j]);
    delete this.elements[i].subjects[j];
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
