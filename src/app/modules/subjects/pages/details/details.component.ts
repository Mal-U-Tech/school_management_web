import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSchoolSubjects } from 'src/app/modules/schools/store/schools.selectors';
import { selectCountOfSubjectClasses, selectCountOfSubjectStudents, selectCountOfSubjectTeachers, selectDateOfLastUpdate } from '../../store/subjects.selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  subjects$ = this.store.select(selectCurrentSchoolSubjects);
  
  columns = [
    'name',
    'classes',
    'students',
    'teachers',
    'last_updated'
  ];
  
  constructor(private store : Store){}

  getClassCount(subject : string){
    return this.store.select(selectCountOfSubjectClasses(subject));
  }
  getStudentCount(subject : string){
    return this.store.select(selectCountOfSubjectStudents(subject));
  }
  getTeacherCount(subject : string){
    return this.store.select(selectCountOfSubjectTeachers(subject));
  }
  getDateOfLastUpdate(subject : string){
    return this.store.select(selectDateOfLastUpdate(subject));
  }
}
