import { Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeacherService } from '../shared/teacher/teacher.service';
import { matchValidator } from '../shared/user/form.validators';
import { UserApiService } from '../shared/user/user-api.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
})
export class TeacherComponent {
  constructor(
    private apiService: TeacherService,
    public userService: UserApiService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        console.log(data);
        this.users = data;
      },
      error: (error) => {
        console.log();
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
  public name: string = '';
  public surname: string = '';
  public contact: string = '';
  public genderSelection = 'Select gender';
  public maritalStatusSelection = 'Select marital status';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  public passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(25),
      matchValidator('confirmPassword', true),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      matchValidator('password'),
    ]),
  });
  public visible = false;
  public confirmVisible = false;

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

    if (this.showPasswordContainer) {
      if (
        this.passwordForm.get('password')!.value !=
        this.passwordForm.get('confirmPassword')!.value
      ) {
        this.apiService.errorToast('Passwords do not match');
      } else if (this.passwordForm.get('password')!.value == '') {
        this.apiService.errorToast('Passwords are empty');
      } else {
        teacher = {
          user_id: {
            name: this.name,
            surname: this.surname,
            contact: this.contact,
            user_role: '',
          },
          gender: this.genderSelection,
          marital_status: this.maritalStatusSelection,
        };

        this.apiService.postTeacher(teacher).subscribe({
          next: (data: any) => {
            console.log(data);
            this.closeTeacherDialog();
            this.apiService.successToast('Successfully saved teacher');
            this.res = 1;
          },
          error: (err) => {
            this.closeTeacherDialog();
            this.apiService.errorToast(err);
            this.res = 0;
          },
        });
      }
    } else {
      teacher = {
        user_id: this.userSelection._id,
        gender: this.genderSelection,
        marital_status: this.maritalStatusSelection,
      };

      this.apiService.postTeacher(teacher).subscribe({
        next: (data: any) => {
          console.log(data);
          this.closeTeacherDialog();
          this.apiService.successToast('Successfully saved teacher');
          this.res = 1;
        },
        error: (err) => {
          this.closeTeacherDialog();
          this.apiService.errorToast(err);
          this.res = 0;
        },
      });
    }
  }
}
