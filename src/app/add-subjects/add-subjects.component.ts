import {
  Component,
  EventEmitter,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddSubjectsService } from '../shared/add-subjects/add-subjects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddDepartmentsService } from '../shared/add-departments/add-departments.service';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.sass'],
})
export class AddSubjectsComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    private apiService: AddSubjectsService,
    private departmentsService: AddDepartmentsService,
    private _snackBar: MatSnackBar,
    public router: Router
  ) {}
  public sub: any;
  public depts: any[] = [
    {
      dept_id: '',
      dept_name: '',
      subjects: [{ name: '', level: '' }],
    },
  ];
  public elements: any[] = [];

  @ViewChildren('inputFieldLevel') levels!: QueryList<any>;
  @ViewChildren('inputFieldSubject') subjects!: QueryList<any>;

  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  public dialogTitle = 'Add Subjects';

  public deptSubs: any[] = [];
  ngOnInit(): void {
    // this.sub = this._Activatedroute.queryParams.subscribe((params) => {
    //   this.depts = JSON.parse(params['departments']);
    //   this.depts.forEach((el) => {
    //     console.log(el);
    //     this.elements.push({
    //       dept_id: el._id,
    //       dept_name: el.name,
    //       subjects: [{ name: '', level: '' }],
    //     });
    //   });
    // });

    this.retrieveDepartmentsService();
  }

  closeSubjectDialog() {
    this.onClose.emit();
  }

  submitSubjectsRequest() {
    this.onSubmit.emit();
  }

  retrieveDepartmentsService() {
    this.departmentsService.viewAllDepartments(0, 0).subscribe({
      next: (data: any) => {
        console.log(data);
        data.forEach((el: any) => {
          console.log(el);
          this.elements.push({
            dept_id: el._id,
            dept_name: el.name,
            subjects: [{ name: '', level: '' }],
          });
        });
      },
      error: (err) => {
        console.log(err.toString());
      },
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
        this.closeSubjectDialog();
        this.openSnackBar('Successfully added subjects', 'Close');
        // this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.closeSubjectDialog();
        this.openSnackBar(error, 'Close');
      },
    });

    console.log({ subjects: data });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
