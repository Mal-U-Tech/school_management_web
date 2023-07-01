import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AddDepartmentsService } from '../shared/add-departments/add-departments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { postDepartmentsArrayRequest } from '../store/departments/departments.actions';

@Component({
  selector: 'app-add-departments',
  templateUrl: './add-departments.component.html',
  styleUrls: ['./add-departments.component.sass'],
})
export class AddDepartmentsComponent {
  @ViewChild('departmentsDialogContent') deptDialog = {} as TemplateRef<string>;
  @Input() closeDialog: any;
  @ViewChildren('inputField') inputs!: QueryList<any>;
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  listLength = 0;

  constructor(
    private _snackBar: MatSnackBar,
    public apiService: AddDepartmentsService,
    public router: Router,
    private store: Store
  ) {}

  public departmentsArray = [
    { id: this.listLength, name: '' },
    { id: this.listLength, name: '' },
  ];
  public title = 'Add Departments';
  public res = 0;

  closeDepartmentDialog() {
    this.onClose.emit();
  }

  submitDeptRequest() {
    this.onSubmit.emit();
  }

  appendInput() {
    this.listLength += 1;
    this.departmentsArray.push({ id: this.listLength, name: '' });
  }

  submitDepartments() {
    // make api call
    this.store.dispatch(
      postDepartmentsArrayRequest({
        departments: { names: this.departmentsArray },
      })
    );
    this.closeDepartmentDialog();
    // this.apiService
    //   .postDepartmentsArray({ names: this.departmentsArray })
    //   .subscribe({
    //     next: (data: any) => {
    //       this.openSnackBar('Successfully added departments.', 'Close');
    //       // this.router.navigate([`/add-subjects`], {
    //       //   queryParams: { departments: JSON.stringify(data.data) },
    //       //   queryParamsHandling: 'merge',
    //       // });
    //       this.closeDepartmentDialog();
    //       this.res = 1;
    //     },
    //     error: (error) => {
    //       this.openSnackBar(error, 'Close');
    //       this.closeDepartmentDialog();
    //       this.res = 0;
    //     },
    //   });
  }

  trackByFn(index: any, el: any) {
    return index;
  }
}
