import { Component, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { IDepartments } from '../shared/add-departments/add-departments.interface';
import { IHodPost } from '../shared/hod/hod.interface';
import { HodService } from '../shared/hod/hod.service';
import { ITeacher } from '../shared/teacher/teacher.interface';
import { selectDepartmentsArray } from '../store/departments/departments.selector';
import { hodIsLoading, postHodRequest } from '../store/hod/hod.actions';
import { selectTeacherArray } from '../store/teacher/teacher.selector';

@Component({
  selector: 'app-head-of-depts',
  templateUrl: './head-of-depts.component.html',
  styleUrls: ['./head-of-depts.component.scss'],
})
export class HeadOfDeptsComponent {
  constructor(private api: HodService, private store: Store) {}

  // store variables
  teachers$ = this.store.select(selectTeacherArray);
  departments$ = this.store.select(selectDepartmentsArray);

  // dialog title
  public title = 'Add Head Of Department';

  public departmentSelection?: IDepartments = undefined;
  public teacherSelection?: ITeacher = undefined;
  public year = new Date().getFullYear().toString();

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // teacher selection method
  selectTeacher(selection: ITeacher) {
    this.teacherSelection = selection;
  }

  // department selection methods
  selectDepartment(selection: IDepartments) {
    this.departmentSelection = selection;
  }

  // close head of department dialog
  closeHODDialog() {
    this.onClose.emit();
  }

  // submit head of department to database
  submitHOD() {
    this.onSubmit.emit();
  }

  // function to dispatch hodIsLoading
  dispatchHodIsLoading(state: boolean) {
    this.store.dispatch(hodIsLoading({ hodIsLoading: state }));
  }

  // api method to save head of department to database
  saveHOD() {
    let teacher: IHodPost;
    if (
      this.teacherSelection !== undefined &&
      this.departmentSelection !== undefined
    ) {
      teacher = {
        teacher_id: this.teacherSelection?._id || '',
        department_id: this.departmentSelection?._id || '',
        year: this.year,
      };

      this.dispatchHodIsLoading(true);
      this.store.dispatch(postHodRequest({ hod: teacher }));
    } else {
      this.api.errorToast('Please select teacher and department!');
    }
  }
}
