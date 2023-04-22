import { Component, EventEmitter, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassStudentsService } from '../shared/class-students/class-students.service';

export interface StreamDialogData {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-class-students',
  templateUrl: './class-students.component.html',
  styleUrls: ['./class-students.component.scss'],
})
export class ClassStudentsComponent {
  constructor(
    private apiService: ClassStudentsService,
    @Inject(MAT_DIALOG_DATA) public data: StreamDialogData[]
  ) {}

  ngAfterViewInit(): void {}

  // dialog title
  public title = 'Add Student';
  public res = 0;

  // class student schema properties
  public name: string = '';
  public surname: string = '';
  public student_contact: string = '';
  public year: string = '';
  public genderSelection = 'Select Gender';
  public classSelection = { name: 'Select Grade & Stream', _id: '' };

  // variables for adding file from local system
  file?: File;
  arrayBuffer: any;
  filelist: any;
  routerLink = 'add-by-excel';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  onConfirmAddByExcel = new EventEmitter();

  // gender selection method
  selectGender(selection: string) {
    this.genderSelection = selection;
  }

  // classname selection method
  selectClassname(selection: any) {
    console.log(`This is the selected classname ${selection.name}`);
    this.classSelection = selection;
  }

  // close class student dialog
  closeClassStudentDialog() {
    this.onClose.emit();
  }

  // submit class student to database
  submitClassStudent() {
    this.onSubmit.emit();
  }

  addStudentsByExcel() {
    this.onConfirmAddByExcel.emit();
  }

  // method to submit class studnet to database via api
  saveClassStudent() {
    let student = {
      name: this.name,
      surname: this.surname,
      student_contact: this.student_contact,
      year: this.year,
      gender: this.genderSelection,
      class_id: this.classSelection._id,
    };

    this.apiService.postStudent(student).subscribe({
      next: (data: any) => {
        console.log(data);
        this.closeClassStudentDialog();
        this.apiService.successToast('Successfully added student');
        this.res = 1;
      },
      error: (error) => {
        this.closeClassStudentDialog();
        this.apiService.errorToast(error);
        this.res = 0;
      },
    });
  }

  // function to add file from local system
  // addFile(event: any) {
  //   this.file = event.target.files[0];
  //   let fileReader = new FileReader();
  //   fileReader.readAsArrayBuffer(this.file!);
  //   fileReader.onload = (e) => {
  //     this.arrayBuffer = fileReader.result;
  //     var data = new Uint8Array(this.arrayBuffer);
  //     var arr = new Array();
  //
  //     for (var i = 0; i != data.length; ++i) {
  //       arr[i] = String.fromCharCode(data[i]);
  //     }
  //
  //     var bstr = arr.join('');
  //     var workbook = XLSX.read(bstr, { type: 'binary' });
  //     var first_sheet_name = workbook.SheetNames[1];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
  //     var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //     this.filelist = [];
  //     console.log(this.filelist);
  //   };
  // }
}
