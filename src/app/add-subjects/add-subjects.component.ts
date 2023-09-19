import {
  Component,
  EventEmitter,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddSubjectsService } from '../shared/add-subjects/add-subjects.service';
import { Store } from '@ngrx/store';
import { selectDepartmentsArray } from '../store/departments/departments.selector';
import { IDepartments } from '../shared/add-departments/add-departments.interface';
import { postSubjectArrayRequest } from '../store/subjects/subjects.actions';
import { ISubjects } from '../shared/add-subjects/add-subjects.interface';

@Component({
  selector: 'app-add-subjects',
  templateUrl: './add-subjects.component.html',
  styleUrls: ['./add-subjects.component.sass'],
})
export class AddSubjectsComponent implements OnInit {
  constructor(
    private apiService: AddSubjectsService,
    public router: Router,
    private store: Store
  ) {}

  public elements: any[] = [];

  @ViewChildren('inputFieldLevel') levels!: QueryList<any>;
  @ViewChildren('inputFieldSubject') subjects!: QueryList<any>;
  @ViewChildren('inputFieldPassMark') passMarks!: QueryList<any>;

  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  public dialogTitle = 'Add Subjects';
  departments$ = this.store.select(selectDepartmentsArray);

  public deptSubs: any[] = [];
  ngOnInit(): void {
    this.retrieveDepartmentsService();
  }

  closeSubjectDialog() {
    this.onClose.emit();
  }

  submitSubjectsRequest() {
    this.onSubmit.emit();
  }

  retrieveDepartmentsService() {
    this.departments$
      .subscribe((data: IDepartments[]) => {
        if (data.length) {
          data.forEach((el: IDepartments) => {
            this.elements.push({
              dept_id: el._id,
              dept_name: el.name,
              subjects: [{ name: '', secondary: false, high_school: false }],
              pass_mark: 0,
            });
          });
        }
      });
  }

  addIn(num: number) {
    this.elements[num].subjects.push({ name: '', level: '', pass_mark: 0 });
  }

  addSubjects() {
    const data: ISubjects[] = [];

    // remove any subjects currently stored
    this.apiService.secondarySubjects = [];
    this.apiService.highSchoolSubjects = [];

    for (let i = 0; i < this.elements.length; i = i + 1) {
      const dept = this.elements[i];

      for (let j = 0; j < dept.subjects.length; j = j + 1) {
        const sub = dept.subjects[j];

        // add subjects to service variables
        if (sub.secondary) {
          data.push({
            department_id: dept.dept_id,
            name: sub.name,
            level: 'Secondary',
            pass_mark: sub.pass_mark,
          });

          this.apiService.secondarySubjects.push({
            department_id: dept.dept_id,
            name: sub.name,
            level: 'Secondary',
            pass_mark: sub.pass_mark,
          });
        }

        if (sub.high_school) {
          data.push({
            department_id: dept.dept_id,
            name: sub.name,
            level: 'High School',
            pass_mark: sub.pass_mark,
          });
          this.apiService.highSchoolSubjects.push({
            department_id: dept.dept_id,
            name: sub.name,
            level: 'High School',
            pass_mark: sub.pass_mark,
          });
        }
      }
    }

    console.log(data);
    this.store.dispatch(
      postSubjectArrayRequest({ subjects: { subjects: data } })
    );
    this.closeSubjectDialog();
  }
}
