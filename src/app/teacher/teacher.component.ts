import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TeacherService } from '../shared/teacher/teacher.service';
import { selectSchoolInfoObject } from '../store/school-info/school-info.selector';
import { postTeacherRequest } from '../store/teacher/teacher.actions';
import { UserService } from '../modules/authenticate/services/user/user.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
})
export class TeacherComponent implements OnInit {
  constructor(
    private apiService: TeacherService,
    public userService: UserService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
      },
      error: (error) => {
        this.userService.errorToast(error);
      },
    });
  }

  // dialog title
  public title = 'Add Teacher';
  public res = 0;

  userSelection = {
    _id: '',
    name: 'Select Existing User',
    surname: '',
    contact: '',
    email: '',
  };
  isUserSelected = false;
  users: any[] = [];
  showPasswordContainer = false;

  // teacher schema properties
  public name = '';
  public surname = '';
  public contact = '';
  public genderSelection = 'Select gender';
  public maritalStatusSelection = 'Select marital status';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  public email = new FormControl('', [Validators.required, Validators.email]);
  public passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(25),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
    ]),
  });
  public visible = false;
  public confirmVisible = false;
  schoolInfo$ = this.store.select(selectSchoolInfoObject);

  showPassword() {
    console.log('Making password visible');
    this.visible = !this.visible;
  }

  showConfirmPassword() {
    this.confirmVisible = !this.confirmVisible;
  }

  selectUser(selection: any) {
    this.userSelection = selection;
    this.isUserSelected = true;
    this.showPasswordContainer = false;

    this.assignDetailFromUser(this.userSelection);
  }

  createNewTeacher() {
    this.isUserSelected = true;
    this.showPasswordContainer = true;

    this.assignDetailFromUser({
      name: '',
      surname: '',
      contact: '',
    });

    this.genderSelection = 'Select gender';
    this.maritalStatusSelection = 'Select marital status';
  }

  assignDetailFromUser(user: any) {
    this.name = user.name;
    this.surname = user.surname;
    this.contact = user.contact;
  }

  // gender selection method
  selectGender(selection: string) {
    this.genderSelection = selection;
  }

  // marital status selection method
  selectMaritalStatus(selection: string) {
    this.maritalStatusSelection = selection;
  }

  // close teacher dialog event
  closeTeacherDialog() {
    this.onClose.emit();
  }

  // submit teacher to database event
  submitTeacherRequest() {
    this.onSubmit.emit();
  }

  // method to submit teacher to database via api
  saveTeacher() {
    let teacher: any;

    // get school info data from session storage
    // const schoolInfo = JSON.parse(sessionStorage.getItem('school-info') || '');
    let schoolInfo: any;

    this.schoolInfo$.subscribe({
      next: (data) => {
        if (data != null) {
          schoolInfo = data;
        }
      },
    });
    console.log(schoolInfo);

    if (this.showPasswordContainer) {
      if (
        this.passwordForm.get('password')?.value !=
        this.passwordForm.get('confirmPassword')?.value
      ) {
        this.apiService.errorToast('Passwords do not match');
      } else if (this.passwordForm.get('password')?.value == '') {
        this.apiService.errorToast('Passwords are empty');
      } else {
        teacher = {
          user_id: {
            name: this.name,
            surname: this.surname,
            contact: this.contact,
            email: this.email.value,
            user_role: '',
            password: this.passwordForm.get('password')?.value,
          },
          gender: this.genderSelection,
          marital_status: this.maritalStatusSelection,
        };

        this.store.dispatch(
          postTeacherRequest({ teacher: teacher, schoolInfoId: schoolInfo._id })
        );
        this.closeTeacherDialog();

        // this.apiService.postTeacher(teacher, schoolInfo._id).subscribe({
        //   next: (data: any) => {
        //     console.log(data);
        //     this.closeTeacherDialog();
        //     this.apiService.successToast('Successfully saved teacher');
        //     this.res = 1;
        //   },
        //   error: (err) => {
        //     this.closeTeacherDialog();
        //     this.apiService.errorToast(err);
        //     this.res = 0;
        //   },
        // });
      }
    } else {
      teacher = {
        user_id: this.userSelection._id,
        gender: this.genderSelection,
        marital_status: this.maritalStatusSelection,
      };

      this.store.dispatch(
        postTeacherRequest({ teacher: teacher, schoolInfoId: schoolInfo._id })
      );
      this.closeTeacherDialog;
      // this.apiService.postTeacher(teacher, schoolInfo._id).subscribe({
      //   next: (data: any) => {
      //     this.closeTeacherDialog();
      //     this.apiService.successToast('Successfully saved teacher');
      //     this.res = 1;
      //   },
      //   error: (err) => {
      //     this.closeTeacherDialog();
      //     this.apiService.errorToast(err);
      //     this.res = 0;
      //   },
      // });
    }
  }
}
