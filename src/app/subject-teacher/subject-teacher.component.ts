import { Component, EventEmitter } from '@angular/core';
import { SubjectTeacherService } from '../shared/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-subject-teacher',
  templateUrl: './subject-teacher.component.html',
  styleUrls: ['./subject-teacher.component.scss'],
})
export class SubjectTeacherComponent {
  constructor(private apiService: SubjectTeacherService) {}

  // variables for subject, teacher and streams array
  public streams: any;
  public teachers: any;
  public subjects: any;

  ngOnInit(): void {
    this.streams = JSON.parse(sessionStorage.getItem('streams')!);

    this.teachers = JSON.parse(sessionStorage.getItem('teachers')!);

    this.subjects = JSON.parse(sessionStorage.getItem('subjects')!);
  }

  ngAfterViewInit(): void {}

  // dialog title
  public title = 'Add Subject Teacher';
  public res = 0;

  // subject teacher schema properties
  public streamSelection = { _id: '', name: 'Select Grade & and Stream' };
  public subjectSelection = { _id: '', name: 'Select Subject', level: '' };
  public teacherSelection = {
    _id: '',
    name: 'Select Teacher',
    surname: '',
    title: '',
  };
  public year: string = '';

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // stream selection method
  selectStream(selection: any) {
    this.streamSelection = selection;
  }

  // subject selection method
  selectSubject(selection: any) {
    this.subjectSelection = selection;
  }

  // teacher selection method
  selectTeacher(selection: any) {
    this.teacherSelection = selection;
  }

  // close subject teacher dialog
  closeSubjectTeacherDialog() {
    this.onClose.emit();
  }

  // submit subject teacher to database
  submitSubjectTeacher() {
    this.onSubmit.emit();
  }

  // submit subject teacher to database via api
  saveSubjectTeacher() {
    let teacher = {
      subject_id: this.subjectSelection._id,
      class_id: this.streamSelection._id,
      teacher_id: this.teacherSelection._id,
      year: this.year,
    };

    console.log(
      `This is the subject teacher from api method: ${JSON.stringify(teacher)}`
    );

    this.apiService.postSubjectTeacher(teacher).subscribe({
      next: (data: any) => {
        console.log(data);
        this.closeSubjectTeacherDialog();
        this.apiService.successToast(
          `Successfully add subject teacher in ${this.streamSelection.name}`
        );
        this.res = 1;
      },
      error: (error) => {
        this.closeSubjectTeacherDialog();
        this.apiService.errorToast(error.toString());
        this.res = 0;
      },
    });
  }
}
