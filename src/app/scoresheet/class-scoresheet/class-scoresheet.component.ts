import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { PassControlsComponent } from 'src/app/pass-controls/pass-controls.component';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { PassControlsService } from 'src/app/shared/pass-controls/pass-controls.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { IScoresheetDatasource } from '../models/scoresheet-datasource.model';
import { IScoresheetSubject } from '../models/scoresheet-subject.model';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';

@Component({
  selector: 'app-class-scoresheet',
  templateUrl: './class-scoresheet.component.html',
  styleUrls: ['./class-scoresheet.component.scss'],
})
export class ClassScoresheetComponent implements OnInit {
  // variable definitions
  classname = '';
  schoolName = '';
  scoresheetName = '';
  scoresheetYear = '';
  englishPassMark = 0;
  otherSubjectPassMark = 0;
  dataSource: MatTableDataSource<IScoresheetDatasource> =
    new MatTableDataSource();
  displayedColumns: string[] = ['index', 'studentName'];
  subjects: IScoresheetSubject[] = [];
  passControls: IPassControls[] = [];
  studentsScoresheet: any[][] = [];
  chemistryIndex = -1;

  constructor(
    private marksService: MarksService,
    private passControlService: PassControlsService,
    private scoresheetService: ScoresheetService,
    private dialog: MatDialog,
    private classStudentService: ClassStudentsService
  ) {}

  ngOnInit(): void {
    // load data here
    this.loadData();
  }

  // function to load data from sessionStorage
  loadData() {
    const studentData = JSON.parse(
      sessionStorage.getItem('scoresheet-students') || ''
    );
    const subjectData = JSON.parse(
      sessionStorage.getItem('scoresheet-subjects') || ''
    );

    console.log(studentData);
    console.log(subjectData);

    // assign values to scoresheet interface
    const arr: IScoresheetDatasource[] = [];

    // assign students to arr
    for (let i = 0; i < studentData.length; i++) {
      const stud = studentData[i];

      arr.push({
        index: i + 1,
        _id: stud._id,
        name: stud.name,
        surname: stud.surname,
        marks: [],
        aggregate: 0,
        position: 0,
        pass_fail: 'Pass',
      });
    }

    // assign subject data
    for (let j = 0; j < subjectData.length; j++) {
      const tempSubject = subjectData[j];

      // get subject name
      const name = Object.keys(tempSubject)[0].toString();

      // find if the subject has been added to the displayed columns array
      const subjectFound = this.displayedColumns.find(
        (el) => el == Object.keys(tempSubject)[0].toString()
      );

      if (
        !subjectFound &&
        tempSubject[Object.keys(tempSubject)[0]].length > 0
      ) {
        const tempStud = tempSubject[name][0];
        // console.log(tempStud);
        this.displayedColumns.push(Object.keys(tempSubject)[0]);
        console.log(Object.keys(tempSubject)[0]);

        // assing subjects and subject teacher to subjects array
        this.subjects.push({
          subjectName: Object.keys(tempSubject)[0],
          teacherTitle: this.computeTeacherTitle(
            tempStud.subject_teacher_id.teacher_id.gender,
            tempStud.subject_teacher_id.teacher_id.marital_status
          ),
          teacherName: tempStud.subject_teacher_id.teacher_id.user_id.name,
          teacherSurname:
            tempStud.subject_teacher_id.teacher_id.user_id.surname,
        });
      }
    }

    // assign to dataSource
    this.dataSource.data = arr;

    this.getStudentSubjectMark(subjectData);

    // get physics and chemistry subjectIds
    this.findPhysicalScienceIds();

    this.rankStudent(this.calculateAggregateforEachStudent());

    // // add pass pass-controls
    this.passControls = this.passControlService.passControls;
    //
    // load school info
    const schoolInfo: ISchoolInfo = JSON.parse(
      sessionStorage.getItem('school-info') || ''
    );
    console.log(schoolInfo);
    this.classname = this.scoresheetService.className;
    this.schoolName = schoolInfo.name;
    this.scoresheetName = this.scoresheetService.name;
    this.scoresheetYear = this.scoresheetService.selectedYear;

    // compute pass or fail
    this.computePassFail();
  }

  // function to get a students mark for a subject
  getStudentSubjectMark(subjectData: []) {
    for (let i = 0; i < subjectData.length; i++) {
      const sub: any = subjectData[i];
      const name = Object.keys(sub)[0];
      console.log(name + sub[name].length);

      if (sub[name].length > 0) {
        // subject marks are available
        // add them to students list in dataSource
        if (sub[name].length <= this.dataSource.data.length) {
          for (let j = 0; j < this.dataSource.data.length; j++) {
            // console.log(sub[name][j].mark);
            if (sub[name][j].mark != null || undefined) {
              const percentage = this.calculateMarkPectage(
                sub[name][j].mark,
                sub[name][j].max_score
              );
              this.dataSource.data[j].marks.push(percentage);
            }
          }
        } else {
          console.log(`This is ${name}`);
          this.assignMarksWithWhile(sub[name]);
        }
      }
    }
  }

  // function to add marks to students using while loop
  assignMarksWithWhile(marks: []) {
    let index = 0;
    const subIndex = this.dataSource.data[0].marks.length;

    while (index < marks.length) {
      // find the student in student list
      this.dataSource.data.forEach((student: any) => {
        if (student['_id'] == marks[index]['class_student_id']['_id']) {
          if (student.marks[subIndex] == undefined) {
            student.marks.push(
              this.calculateMarkPectage(
                marks[index]['mark'],
                marks[index]['max_score']
              )
            );
          }

          // console.log(student.marks);
          if (student.marks[subIndex] == '') {
            student.marks[subIndex] = this.calculateMarkPectage(
              marks[index]['mark'],
              marks[index]['max_score']
            );
          }
        }
      });

      index++;
    }

    console.log(this.dataSource.data);
  }

  // function to calculate the percentage for each student
  calculateMarkPectage(mark: string, maxScore: string): string {
    return mark === ''
      ? ''
      : Math.round(
          (Number.parseInt(mark) / Number.parseInt(maxScore)) * 100
        ).toString();
  }

  computeTeacherTitle(gender: string, maritalStatus: string): string {
    if (gender === 'Male') {
      return 'Mr.';
    } else if (gender === 'Female' && maritalStatus === 'Single') {
      return 'Ms.';
    } else {
      return 'Mrs.';
    }
  }

  // function to calculate the aggregate for each student
  calculateAggregateforEachStudent() {
    this.displayedColumns.push('aggregate');
    const aggregates: number[] = [];

    this.dataSource.data.forEach((student) => {
      // totalMarks
      let numMarks = 0;
      let totalMarks = 0;
      student.marks.forEach((mark) => {
        if (mark.toString() != '') {
          totalMarks += Number.parseInt(mark.toString());
          numMarks++;
        }
      });

      const aggregate = Math.round((totalMarks / numMarks) * 10) / 10;
      student.aggregate = aggregate;
      aggregates.push(aggregate);
    });
    return aggregates;
  }

  // function to rank students based on aggregate
  rankStudent(array: any[]) {
    const rankingArray = [];

    for (let i = 0; i < array.length; i++) {
      let rank = 1;

      for (let j = 0; j < array.length; j++) {
        if (array[j] > array[i]) rank++;
      }
      rankingArray.push(rank);
    }

    this.displayedColumns.push('position');

    for (let k = 0; k < rankingArray.length; k++) {
      const student = this.dataSource.data[k];
      student.position = rankingArray[k];
    }
  }

  // function to open pass controls dialog
  openPassControls(controls?: IPassControls) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;

    if (controls !== undefined) {
      dialogConfig.data = controls;
    }

    const dialog = this.dialog.open(PassControlsComponent, dialogConfig);
    const instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe((value: IPassControls) => {
      dialog.close();
      for (let i = 0; i < this.passControls.length; i++) {
        if (this.passControls[i]._id === value._id) {
          this.passControls[i] = value;
        }
      }
    });

    instance.onConfirmControls.subscribe(() => {
      instance.submitPassControls();
    });
  }

  // function to compute if a student has passed of failed
  computePassFail() {
    const regex = new RegExp(/\w+.[1-3]\w$/);
    let level = '';

    if (regex.test(this.scoresheetService.className)) {
      level = 'Secondary';
    } else {
      level = 'High School';
    }

    const controls = this.retrievePassingSubjectMark(level);
    for (let i = 0; i < this.dataSource.data.length; i++) {
      const student = this.dataSource.data[i];
      let passSub = false;
      let agg = false;
      let passedSubjects = 0;

      // checking if english is passed
      if (
        Number.parseInt(student.marks[controls.subjectIndex]) >=
        controls.passingMark
      ) {
        passSub = true;
      } else {
        passSub = false;
      }

      // checking aggregate
      if (student.aggregate >= controls.aggregate) {
        agg = true;
      } else {
        agg = false;
      }

      // checking number of passed subject
      for (let j = 0; j < student.marks.length; j++) {
        const mark = student.marks[j];

        if (mark != '' && j != this.chemistryIndex) {
          if (Number.parseInt(mark) >= controls.otherSubjectsPassMark) {
            passedSubjects++;
          }
        }
      }

      // computing result
      const result =
        passSub && agg && passedSubjects >= controls.numPassedSubjects
          ? 'Pass'
          : 'Fail';
      student.pass_fail = result;
    }

    this.displayedColumns.push('pass_fail');
  }

  // function to retrieve passing subject and mark
  retrievePassingSubjectMark(level: string) {
    let passingSubject = '';
    let passingMark = 0;
    let subjectIndex = 0;
    let aggregate = 0;
    let numPassed = 0;
    let othersPassMark = 0;

    this.passControls.forEach((control) => {
      if (control.level === level) {
        passingSubject = control.name;
        passingMark = control.mark;
        aggregate = control.aggregate;
        numPassed = control.num_passed_subject;
        othersPassMark = control.other_subjects_mark;
      }
    });

    // find the index of the passing subject
    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i].subjectName === passingSubject) {
        subjectIndex = i;
      }
    }

    return {
      passingSubject: passingSubject,
      passingMark: passingMark,
      aggregate: aggregate,
      numPassedSubjects: numPassed,
      otherSubjectsPassMark: othersPassMark,
      subjectIndex: subjectIndex,
    };
  }

  // function that uses jspdf to create scoresheet pdf
  openPdf() {
    this.sortStudents();
    this.createTableHeaders();
    this.createStudentInfo();

    // define widths for all columns
    const widths: string[] = [];

    // base 64 image
    const image =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN4AAAC6CAYAAAG2BcNtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAIdUAACHVAQSctJ0AAN74SURBVHhe7F0FeFRH144naLFicRcoFEpLkbgTghPc3d0JkECA4NBSSikFCsQNq7t8bT+pC0Uju1nfuCf7/u/cJGiqX+XvV+Z5zrO7d++dOzNnzjnvGTtGf4n0WGg8PMP3ouHn75tc/behJm8GSlQTEDl2Bjwfi/99XuzutxNJrzyNIsUcGCVUwSi9AFnfHYe+yAf2AQfgGBLT5IvHTI3+8QK5Bm5BkTocuV+txWuvbUSlcjQqFONRrRiCjqe/k150LxWq56NMMQlFmmEoVizHxZfWoDR3Hkrls7BmR0KvhqybTvZB23BZtxVWyTdgmaaAWYoKzc/UNPmiO8k8tRJGGUVolijjdzmM0ipQJxv2083tGrgJZaqxUiYl5YChzgA9qcvKdPSZfgjFAOwmHIb3zG0wGxYPZS1gG7wcLaM2wSpyJzTVBnRILIRpmhKlynE//sJNsU/Bsf8m3jiBJSyAzYYP0GfARLRdnQar8J3oE7YSvb3HonfQVHTyXoyB/abAI/5f6Bi+GX39pqMHqY//YvgOGQXTpEqU5s/C+g2xWB97qOkXe/rsYe3G1RNfejeJ66PrSXwnlUr33Ut3PCPlNQY9Amfe/cJn0nbzholwDtjecFMDKcfD1Xc/e+YmuEVMRR/v8ahUD4aT93zI8iewKTejSDUFC5cuw+nEDegTHgHHwHX35DEOM5dMlwrg5NfQk139t0p/Si+8VTLWgN89g+dCf2MPeoePR0//key1UegbMQvF+q3oErgXVepgDB0+FEuWzcLc1TNg47eXTTnjvheWZk+6XUuP4Djpz+4D98LdfwMCh49CcPo/7uuJjWRM/hpfUDf5XyNVUJwcQlfCzTcek5cuwLgZS+54YRCblC8MGj4Z3QMXwSFoJyryIpvMyP7stzA1MhMPw5xkdrHk/vvS9OQvn2ey8z2EIuVIlFMzefgvbWzSeNwi332wf3IxCxAlPSgysEqToQ0z560SmYkXGlve+i2RlRFan9FJ9xu/rMaZsyvF9bvydvHfJV1rMpXrlsMko0LKwCJJA+uzGtw4PhBGJkYwNhYvueeFKUoYp5RK9+uVc+Hg+9wPZ95UcgrZxk4zqL6JBGUZ0N7hCXSy7gILoxaspRHakfp3dURXZ6db95lc/BzVciqOX5PUbHezjDIYZ8gw8oV0GL2ph6e1LZzsnNDawxbO9g5wcXCEZar21gu18gno2G/3r3thB7b7lwm9IEvyhUV6PT/rSQ/zpKI7ftfTsFczUaCa9ete1pg6BcWhOns4mifUwizre0SlFyKnDmh35hpQacBT5bX1L0zRoUQ5DG7+m/67F4qUcm4VoKDmZ8Zdnr8O40wNLUM+jLZ/RCXN7+cMqFIMhUv/rf/9yxrTCwlbWIMoWCSWoM1zX6H7MzdgtCwNzU7fRKk6El391/12L2tMTsH7Ua4ci/Zp30q1rVMNouqaTPl66rd/WWPq4rsD38tOUDGMJb+e//1edG/a+3zmtYav/4PJLmAnvMLjfv/mfCJszofu3ktQoliASsVoOFMxNPz169La7U+1b/h6V+oRfBCugatRoBuP8uvz6wU9S4sK+WRcu74aLgFbcf7dm0cbbv9lqVxGKy2bjwuX1vJzGcp0Q2jlR9GeTYJJ+v3qzOR8HTSaKShWj4BBMQv/+WADLn+2EDWyiXAI3PnTLVCuGAOjzBpiyzxqExlrUgXLpLtf0hSZpxTBLJ0m6lwOTFMKMOD8aTgFbfzpFwpMY5FciGGrz+BKUSUthR4VVUBZSQ2sX1ABNTUoqimDUyCRNSrQPHQnuvvORnWtgdBDhcqaet1aKJsMpx8zuEzGW7Yfhky9D6aZ12A0aDO8fOYgIGwpHh2+Fuu3noLrC/+ET8BoPBo0Bz19ZxKOTIfT4AV43Hcsug2eh95918D8LGucVUjoPxG2QXuwPubppl+aozH0qc0f0oC07sCWt7CmQGF3YtKG79Jn432N95IaUJtL4Nq7X9gpYA1vmAydcj5uvbCB1Op5kCm2oxtlrlIxCgmnttIqjINt4G64DliB3n4jWYtYPDFwMnoGrsGVnONECRPvysPFfwsdnFkoVMy4/eIyWRh0qrn3vVCh2AyZMg421J/a/LE4m7AYWvUEeAUfwOCJ69HbZzLs6W3tfXYnHvXfjsvXnsOwMSNu58GaSi9UTqXo3KEo3GhkC5RzYBe8lT0rGpUyWu17euGdZJ5Uxc5U3OR/gswyruHK9R2U3Y1s0mi+cApbYlv9CweN27ShMj9K8nRsKDdu3jNQLSNKbiIjARtNiNr4GLEpydgKVkl3Qo96uqLbx5rthEvYIfZgATnHwcFvR/0L3bwP3MakpO4BS9FtwFycowkSD5ulauBwnPZPQMFGMjO9+zep5atE4hn1LyzJHwNXb/L5jnwFrdic7MV7708dB21ClXxkfYnTCmGenoNmpkYwkQBwMxg3IO9bZNKa9ylv1bBYFySu/7JUriNUP1cPhAWNS0uFvZ0LTM5cZw3Fy43QKv063GxuY1JByBsEa/KtIZufn5yCYui70zFlJuozffhZAbejWgmLOjo1h7NdPS5teybn1svM025Aplr/y1/WmD7/Jgbq5F74LnXUrUwFWaTnwSL1du0bqUo+Ce6+R379C3uFLoPqvDPME+pFwD3xC8jLC9DpZDHanf0GV1BNNZYPk5RqVLGnuwyK/fUva0xdA/ajkHJkerbeMzI5nQ2XA9locfIqa6mQrunpSxTr9v/3L2tMNv030fgOR5ekT2G+8z/osvUL9DhKBZ+hQxHtoCyv6UGh/yq5+MSjlsqhVjdUqlXL48p6gfb9DdF2U6l7qBjpGAulchmcQn4Dnv2cdPjUO54NX/9/J7fgTXAP3vLHtMofmWwDDhPC7kSJNoJAYQJcfY7Axe/wX7eio+Y+M8TGbx8h2C4ocsXY1nAUacfBPFmLFpmUXOU06CjVFSrCMP/dcPGNR8SM38Bv/jXJll3KNiQaTgHbSTvhSBMicL2LP7FIwC44Bq+HC9Fu95BNcBw0GcX5i1Aum4u63CgU5CyB0elraJH6vaQp7iTzZKGc61CjmooyzQhU5E9gxSfCbtBEav9YOIbuZt7RcCQEEYPsjkFb698dyHcHrYG9fywciIsOHn/rv2sYB2ZcqJyJmvzhKFVMYBcbjwLNWBTQTtbKolAhG48SqrecsoXokvmv+yryS6l94qeQ6Q9ArxqBIhqECuVQarVRKGLXriZMrc4fSkQ/ioBvElzZSxqK+euTQIxi3FZUwui8SiqE/6ZM1FWUwf3QNzDUVsHkkh6o0sFz4TGYZNENqalGdkklrM5UQVNbjZpy4Y2UYfXh8xgwZyvqyuugpxtSWAe0uKSCygB07bdQul5VAuTzfpcDX0jveuTA50BhKYxSaXb52zhNh5dlJ1GoGQ23gN9Ajbv77GZrzUAFwX2zlHrzG7z+DDzG7EdVdR0MNQZ0PHkZhqoKVNdVw3pxKiJXpqKo2oA2I/aiqo6lZ2Xs5mTStypB0IKdsPFZDru5yXwecA1di3xFMbqGroRn4FLYz0lAbSnwUORedEzJ5TM1KKwuh9fQ3TCm+2uUUirZKTGw2iX8ZziCTaWj5+XN3YKWoZ8P0VDYRPznH0tRnj+Vpr2KXqqM7u5NWKXQ40xVwpTep1kyPdA0rUSWGdlok6JEC16zTMsmhMshBrmJ5sQhlilamFDJmKflwzyDIIierik/zYjGmiWrYEZgZMzv5qk3pO9mmXLmSaB7XiEpKCP+Z/TGd6iUT0OJfiG6B09Ft9Ao9AjZAA//H8GkzvR8PH12wjpkG6zD1sEmdB1cA7bd50XdInpDpcqxlIvxlMmh0uh9IZVLhXIYSoltivUDqTQmo0oZSUw7lvewxemYqrVTUKmK4PNjUMx8iihHWqXwOUaiQDWdeU7mc1NRzt/imSLtUJQwvwJN1P1laCTCHSf6ntYhO+EQsJeKZxu6+a+hYtqK3Udeqncpxi97OqfHkL0oV4uHxtBFnC1NXfxgBUklrKT7wD103/dLvmqBMhojRk9GvyDKq3IJPb65cAvbTL91InQ3B8M5mJrQLxo96buK7q6VDUcf+rKOIUvg+eQJ3r8eZbLZ6BgWCzff7aiip9g9YJU033Kvb3sXsYLC9RRTIsL9FI3fzXcb7eyquznqErIFfYPqW0qMxVuHboNGP0bSXkUa2jHNKOk/gzwMlUqqdfkI1MlnoE42h17keNTwRRXUbpVs+arcSSiTD0aVehDqFHOk+wUn6nTjWeFRbLhJqJYPQ9n1ScCVaajOm4pa9VC6v6OlewVVK0ZKPQDMW1ClfDLqVL5SBYrVw1GumCyVrVg9kmZrA2YuniNVMPPiJla4iTGTjqGx0GjrnXI9vf5HvPdBJYvGk0ET6LKuYpfdA5We5kC5VlI0v4aMbXrDyLQtTHsPbvL/n6KOKSo27Bx4+Y3AyI2p6Bm6k2Ixhb1tEzLey0Ixy13B7n/fYLtrwG7095+ISkVUA42Q7J4jnRdXGtNHAufBNWwXVNpQcmkOhb6MDmpdk4UwyiyhoqCvb/e4NB9lbHS/S34nGRsb05M2gqlnCIwzC5vOs4EMOZOgywlit603D84BcXAgvi3UjYROPamh7KNx5Rq7aMCvGN3s5rMDeioKrXoG3cDbc8+maSUwadsZxibtySELyQtvJVx/cxMYWxgjwNMNN5OG4KnlA9DM5EcqLAZF+Iy5pRkcZ26+q3KyotUoyB4Nuyd+p6UCIs1aEf+pM7WrEOxq+Wiq8aaHgzLPL0bXY9dg0t8bRlbkUFOVkYj/WbVD5/VJ8Dr0Ic2H7L68TNIL8fgr2aiVj6J2XI7eoWvEs79f6hNOgxywhJhzJnI1lMfM+knCh1IuwyRND/nZvrSXxbCzs4eXdUc42lvXT7vxt0U3H7Tc8x9YPeEjXWskVxtHdHR1ua9ylinFmPXJS9TKkzAgeBRc/Tb8vpVrTEMmLFc7BW2X1Hd13jS0TrmB4lPdUJDYk/J3z+TzeRmNtQGWzn1uVcjRzgWtH3mSDUE5zhK9oL6R7qXaXLGKJQpeQdPg7rfnj6ncncnFbwtqsyngiU+i8mwfmJ+8PchvSfq+Fmj+yhVsvKrBp6gjTi3Gwy++Jimp2W/l4iiAM+UGIqE7Kna+BK2zFChSE8grpsLJeyNWbE/t2/DKPz65++1AH7awQDXl2skwutAgR2kFaJ1UiFZiRDX1MlqkV6JlcjlaZ9bC9GXCtpNimlMPq4sVfKZ+xtg8nWaA9q9YOR5nkrZQE/5JPmJTyS7gID78124WMAqGvPGsYCmMz5XDIlkHy0vlaJlSiHZHvoWpGGq8oIBJgpz4krg0owjGGQWokQWzkcZBTtfMcWDDUPH/x+QcuB3dI9YQaYyhfM7Ch7rnYZFWRU+gCB3EhMlL5FomAfTLZXhDfxF1VP2VshnYsHGytDCkIZv//+mJQQvg6B2LFesJxQjMq/KmEzyMo7O6AIXaYfTkh+HTD7ehZ7+n4ea34q9TsaZSeuYHW+2CNsMuJIaQLxa2gTGYt/bp2oa/H6S/RHIN/YOWgf7RySF4I46mxsOe4Dfh3DfdGi7/tdOYuXHvuxEzfvj+czQbQ6DUTIdbwGZ4BS74a3PR1fdpaeJXLVuIYs0w6HULUUtnVZY9GNaB2+AWMv2vVcEqw42eHr5xsBEDtEQzVdqZEqL5QPkUkUk1ep54C7U5k1FFzzt49Cw4Bu+GzR8FmO9Mu09/cqrh60+mITPi4By0F570+L2IOGrywlCqGYzcglmwyPwEZun1s3iWyYUwS6uDWj0dRbrBBM4L0cNnI1xD57KS2+Hht/BnVzS/qGpyw9dfnuwDdsF50DJyYQU95V3S8Hjj8Lyr/044Ba+HfchadPZfBVffYziQsg1F2iGokE9DsSwK32qOEUNeg/nZexZfn6uip6DBzDfOQKWeitL8+ShSzkC2eiMcBu6FTdhKOPvH0TZG813b64fmgzdLn06BcaSt8By7nNf+iwlB54A9WLZpGX27SNQqZqAoezm+fD9GWg505T/LUZK3CFVqf2kUTCwINrBCJerRSM1PpatTfneFfoiy8hH5xjmUasNRQJxZoJyOUuZRkTcBRbJJyPluo7S0/d/vrkKBYjHKcyagnM50cf4qOIX8Fyu5nMIOwS1wMkoV5IRqDMRIcTFlpUAzXhrzRO5ElGinooLwKuvyC00X/hfS8EvJ0Io8NfPYrcWa8JHSlIBYU1WTPwJl6lEwyEfiyyvHpBmnhqL+8uTiHQ33iHWolE9Eu9RatErPQfPUHFiKEWcxsnzxBpqdraTzqiEHbi80+G/IMlUshi6HSbqOHoYcZhly+oz5ME0thAU9CtNUOXSaGThwZBNc/P6LGfhuA9bANnQbKpTjmGm9QhCrYAyVgOuZf8JQW4Pew1bBPPEGDNWUo4sl6DV1K2pqS2D7/KcorK2DdYoCKK9AVTV9uYQ6GCoMqKyqQuCBf6OsrgTD404h+LAM1XRmwXxd4s6jprSGnn19ZQ3VtXj42Ie3Ki8W+OoLx6FPYARlb/uvr9zQSbFw8RGzReNhm/DvWy+orTLg3IffwTtiIXoHrMSknZkoozfeZv+HUNbVYnvSu3DY9y/UGCrQJe4D1NZV45+5VXAggDbU1cBqyBb6fvmoqCtDYUU1jF4tRLWhBg9FRlOzloKtRqVTiOZphYg9kkxFc3vI0TRFhUrqAGe/eeju919Mbz/Wd8QgJ//dqNSMwYZL6bdeUEaO1NaUUx63oFvwWhRUqFBOzsXHZWLw1J2widyD2lpyoqq2vnKVBrgMW4qew1ajDtWwnX8CnU5cQXFVKfMpRttULetThy6Lz6DjWQXzKofZye/RdvxR/s9seJ9xWjHMk0qkVfBioNnJbxc8Q1f/8spt3nYYa2OfxrqtmXD2fQpVRBdfaddJwwmCHnsiCt0GL4DN6pfg6BOHnmEzYPRKGRyGDUbrBcdx7MIr6MjnHu0dia5bPsHjQWPwpN8kPEQT0idwKHyenIquEbHoETgRXkuy8IjPXPg9GQVv74noGhiLXkFD8fhj0/DwmDC0O1OKHhHD4bHv32iWUIH2Z6+hVDWK4rIXtn6zsT7mEDZuffbnV9I+KBZu3tPQO3AsPMKoLXWjUXKTWDBTJpFYWS/25Bhlqij4Kpimq9ldNGieJIfxhRuwzFDAPC0XZllyWFHmmqdppSkwixQtjXk+LEhmmfkwOaegt66k166CFRWSaaaceeXcmv4SJKbZTPguEyHzvGfaazuovadS0Q2De8gs9pwZtH+/YDKzi+8WlOTPRRVVvDQDI4h27Iep8X/x2UD3bO1pJLGcUkxt3drqc9c99+Rx69o91FCmcjGNppiJbt4N6wPvTU7sKsL6S/N6DXN7jiGrWbnZqJLfzugu4gtKFZNRqBnBzGmT5JNQqJhP2zeewj4GVTI+p5jECoyQlr9XKofQPk4hxhTXaCtZoBLiTWnRAPOrUkRBr2YPyZ8jzQmW0paJ9YtF8qUo4r1NloFU3pCXdWjcrXk9Qc4E5c5BtIGnT19p7eonlh0JIy1acSJcCLF+tHKkroOXESmMQdjYyXAgNJPlH6OAR6GH9ww84rcchqszCdG2o1Y+DD38ozBl5hx8ce0oseMpODw+HXXaKPT2m4DvvoxBYf5g2IfvRpdBa1GV1w+PhGyBh/8BFGlioNVNavL9ghor5+m/lb2MjdDAWZuAgxg2tWFhmJiVLVfM4wNi3m7Mz6qcc8DTRAi7ETJhsFS5XtRe2dfWoLdvGB7tTxPiGwPnkOUEACOxZdsk2PWPQbHuAB4N2oGynBUokU2EvU/9UhIxF5eXcwCnTm5Afv4O5BcNxaP+U4g7Y39+5diTGivn0biqVCR3vwVw8d6DAqJ08dBdlRMP3JOpIOfQtVAV+WHQmEnsCjvwxtubMXP9SHSPXIWevitRnjeKpmIVu9l4tPHNRNxT87EzfgnsBz4Pv7GrpCnqx/xH4z/fxqIwLwrt+y6Gfd9d7MZD0T1gLhvmKPQ5uxA2iVyf3fv+MrBc5cp7KqcajsfDxxHE3zMsbx/IArHviwddg7agUE7ArBlKmaBcqOuv1yjDpVnRCsVwlN4czy40HnXyqex6Uwiiw0js1uweRTliNnYIKrOn355dVU1H4c1AQMyXi71kJCGblTdnsktRyeQMZ2OOku41aCfz/nGo008G2MAVghSjUU0YKCpVpBsklauAMq8lzvWkZ19DWa3InwiHkCZQi9eAQyiTTZcq0c2fCiZ4D12aDXAK2A274C0EsTORo52NVgn1hvyXknFqAczF5qssqvSM25uwfi6Z0L7mFaxmBSbBy1e4PlspGlvhNeAIHELFnP1kgo0o4s17Nh8MIJTpEryOFRguVc7NZzG6+2+kWxFKedoHW9/lVB7ToSzwZeHkTb78p6hlmgbtjYzQ1siCv+/fLfFTZJxRhsq8sdIqpW4h69nw0ZTP/Xi85yjYBK1CeX4UZTASdkEL0MnvjtXBdgGb8O3XqyTVLSpXoQ6FK1tm+/7lcAleDTe2zIzlq+hQEkWkJDX58vuIANvoHAvl/DjMjGxhZGkuXgjjBjIyMkGLfkNgcrGs6efvIZPEQoKJKMhl+wm99rES8VDI4+AasAUFYtsJyy0UYgm7p9gLWl8zJpuw6DvmzkmyqdRm0fDw3g4X2oyXrlyxdPTdxYcjICuYC6PU+9fCS5RBlyUxG55JeWguKtCsvkI/Sib1+z7bJrO7Su5OE/mSPE+/x541Br0iliNq1k6Wi2Xz3Yf0c2ukvTF3lt+Odjpq3gEYObAC966Vv4uYAQth5Bq0mpWrVyxGmXdPPloSYhmlG2DUvtv9hW8gczEvbmLS5H+NZGxsAdOu/WEqhiHu6Lqm6VqoCyahJo+a0XezuPfu/axNkJvvL/D1nH0P4uz5uUD2NHRMffvWiwVZv3gVluZm7G7mpM7kmjGMzFpLnxbG5jgT549vs0ain2vnuypzH7EBTE3awVKslsi6XTnjZC215XgoVQtow36nhdSPCveGrr9ac/d2DpNUFblJvyyT8tM1AD3tLGBtysKaCWJFzY1gZtyChbpnE8Q91GXpcViK2dfzoifUL8QTdODjMyhUT4J95BqEjt9YwXt/+yQWhSqFTSLuMxUewh0VbCTLMzqEnnkb7U5fhqlRsyYr0Ugm7KbmJi3RPuGK5MVLwxX35nmhgjZ1AIpl4XAN+ZUr/X5O8gpegR5+26hyh6M4d+Z9BTGhui96MRDmySp4dXXAo7bWaO3aC22CR1BpiK7aUlp8Y2RliYd3vQvLXn7wdLCFu411/SKee/ITGjcqI4sgYiz6BQ8iwL9n49VvncRCucJcsQp2irSs0Sijsl7tZxjgn5iO79Oi6LcVwtquJ7p1cbq1uqGrqxe6Jn0C21PZcLKzu3Xd3doRdvZOsEq8W1NapWWzm1dIFauk6+Ua8AdMLXv6k3sDCHfkdFWICMQpFqIws06nojyxI5onq2FBZ9U0uQpmfXxvVcLBzhUu9m3gZOMGN1sb6ZqTnT1a9wtCi5NELyl3L+ppmaLDm+Xv4vvC1ejrO4ba7w/aDmAfuAPKPGJPukgDEs6hy+lvkZfkg0/PzannYmMhL2ilRacdzlzDE507SBVyIdfsHezRMlFWz51L9UuU76WHkvOIKaejnLjW3fsHDsP4PdJL73w/yF7s7smOhOxsN1SdfASXU4bCmN3orsrdSefY7cQotNCqTSmOO8gquRoVmkgippF0PHehR8B/sdnq1yRbv1hi0KHQnO0lLb7JyqRzeEcBB70px5c1gKauDm8a6vAVxL7TInxcB2RU1MH4LLtuYjn2XrmjMdgwwmDn65fRuxiFjz99nhjyT1hVJJKnzwF8mh6E0pd98JWahcjKZSHrEf/El4liXvkPHJ7ntXPF1KRy2JzVQFdZhtTcOnZLIpo0YGzGHXsYsoD3sp+ljzZN6o7O/r/DNqtfkmxD16NQOQYGeTji3znGAjesr0xQoWVCNjUnK3e+Gh0yiqX9fMaZ19DqVCllLZdIX4MOp2930dlvJ6JORk2sHgVHv71YsPX0zYbX/Dlp8mwBYGNQmrsSOv1wDHnj5XrzwMKaJhfC5ZnrMHq5EB57b+Lhk3msfD5abXmHFRcopF5DmtLPW3jhWTrLE1mx4XCPWAvPoN/Zpv3c9GT4Crj6bZfsUW32Ijybk4AWyTdhkVyE5kT6Lc+RUxepOdPYZc8rYfR6GaxmvcpGKEDzlBtIVp1DtSKCyGcEHAdsQc/I/2fLpTz9l8Np4A7U5i+k5zAUMv1mmGVWokP8v2G++0OYb3gH9vu+hfOGj2G8JAutzyhhka6ApnCNtOehlG6Wl/9aOAz4f7TA7c7UfeBSePiuRYm+H+oUAVASXZikqWF8gWbgotCKSnZBdtnzBMXnc1FQMBwl6pEoLhgMu/AdcAr8lWe+/FHple9qP3UdcABHT8WTgxOl0akvCmLQ5Uz9Hh8jcvPLkg3Q0/EUY6Q5efsJrTajz+j/JzL2c5Jd6EE4BxxEoWowyuSTUZI3AfmalchX04blLUXBtRnoFL4B9oF/wCEev0d6LHAWvAY+hR6RW6lNh5BTY1GtmgD3fovpdMbC6cnfecH2H5GEqXAIWUejvA/OQRthF/DjJ2P8JZPTk/P+9yr1Z6Uu/f6ElUkP0n+XenhvgqvP09ICQVe/XXD1/R/QXf/LKfnCG9bW3kfhQKzj4L8dLz47DiXy4SjULoGn93a4BUbjkfAj2HI4sarhkQfpz05ewWvg4BcHd//1sCNdub4VtboJdOmJyglgJQSRNw9a7Ri4+EyFS7BYergNHoFb8fE3yp0N2TxIf0RKeunjvR5+26QjotwCYtB1wBpsjFkoTT0Xq8ZCrxsCw9UJkBVuhVFSGcZcOEVnOJx4dyyKycgK+o/Xrh5EN0qn7aBdsPUV543FIyBqo6HhFQ/Sb5UejVwK+4jdcPIX9msHHY9YePpvwT++TEalZixqNeOg0Yqp87FA9kTMev0EjC/ds4nznBYPpeQgr2gtDPLBKMkXy0knolIZhtL8tegeOgddQrbC3fsgPHzWwTo4hu9bgVPn/+nbUIz/rQTAxCH4aTgS8zsEbIJn+FyEj96C7Qfeudxwy89KsxY+dbl/6Bp0D9kPsULGMWgzXPz2wDNoA1wDN8B6QDS8gibjZu5TqNBMRpE2AgXq8aiVUZLy56JSNwVHvjsFMzHQn/Hjw79GmTpYpunhcfQs1NoV0Ghmk5kRKFdMgNifXa4dBY0iDr1DI+lSCzt5hB1lI5x9D8M2cK+0VsnVfzdc+y9Gv7BFVxuq8LPSZ19pvrDtOeayh89ydA/bQH+JflPwHvQPnvvngClHf9oPn8N4Jukk5iyfwIquhzhhxkk6/WVb/SFyDSSuSSTWXdAlFwu3xBK8xt/C+ZswdwoKbu5GsXYcdAqh5kaiUiYOexmByjwyKp8gRD0Cmusx6JiShxaZKhgl69Ei7SaMkyphkXataaY1kIVYOp9VRibKScUwP6uCZboe8Z+/i3LNYErhTJTnT+L7hqBCMQYlqsEo0k2CJm8MtJdXY+u+EXDzX8Cy1y/ddw3cLJ3yJ5bSC8ZKp90IIuPr682OHbQTjmJSn53RPWg5IufPx7++O4HuPuJEnK3w7DPpxw9g/72Ss992et2b8URoMAoICMQBL0U60ZPFHvRxqMofiyrlMFSpA2lroiQqV4xGFXt5lXwypWcivw9jw4WgXCUOzRglDSYJSdCzIQ03Q3FZuxWPJV6SBoCbi8M5z5HEQoQ0NMmgX0WZZTBJL0fztO+YvxKtkr/BkRtJKFEspnSOJ1OHo0o2hWWbgArZLFTkLeDnVNZNbAZhPYhqaxXht+pYmz8MddQMhtwp0nJPQWp9FArVVNV5s5D//QbYB2+BPRn7+ufqP4d5LoHxkgS5hiyQlnhVyGchR7kS6dc/kNScXLsaSs08aYuCmj1YTRWn1E5Djm4l8vLi8Y5yD1a9ewGPHvsC5lniJAWxOqQOD2f9p/5E1aYa+g+mh1IKYZFaB9MkdpZzOhglVqP1WQUGpl5A4s1duCzbi5vq9ZDpFkChm866jkNN7hjUyCahVD4DedpFeEN/CM/8Mx5qzXDUkaFvfniEnZ7t5vcnbjXsIXyqINqp0I3SPhJxNoZGTR1+gaqpcS5IkJiVSxa/xZh0NYzOVsCU9seEEmRxjkw6XwEzabqynN9LYJqlhfErZGSmlqSB2blq/s/vF/hsVikeOs37XlVRVfKZTNq65DJp64VRhhrmGXppDFzkKVZOG4tyZLA84kz09Cq0YDms0otgkUEVe55le0Ucu1uEZkmlsGB5jEW5Ugl4Gp/J0qBlUg3L2rDdIzMfRqkNi0zENCw7nXEar2eVwJiMtrzjdE5BYnW4OPtgxUdJRL2RZO5Q+IQHSQMIjlStDU35x6fHgpdLK8+6BYidF+MaaDxanfkelsl3TIazkkPXPC9t/6gt1cN60Ao4z4tDYUUdYKhBH//5ME7NR5+Y91FSqkFdZSXS3/ka7c7kwWbnJT5Xh/duaNC7/0rU1ZTgP5/XwuupMtTUlaPYYEDnuPd5TzVqa6thH7gK2goDqkqrYTsyFv0XxfK+EvQZOBd9+6+FJ8tsOTQOZYZylNUZEDb/DOrq6tgJF8Eu/kNYhy7i/TVwD1zIcq6DQ8Q6qrgNKBBFZVmtBrPB08Xh+Cp2qGKELTnFvGpRxbI8OWwj/7t72UbzZCU7Vi5yddtQohmBEqJipwHjKXm74NLvd1x481Np3zOZNNrr6SSzYGLOgDZO2K3+GW/DLPnuw02Hrj6J4sJq7Dn5EcqqRGVL0D1wHUFrJR4JWoVWlKKaMmD6koOInLETVRUFcBixmVJYiOfPfYrSKrFtBqirBb7LLoXppXzU8lkRv0TsTBHnRYutN9XipvJivP7el/Da8wmeXBALAypQUwVoKgth338i2p7Jlc6UrqoqQFVlLvMoQwcy1JjS3SVsAQxVBtRJVI5qvqDr0e9gqOCLyCSrwTsoscWwSi6B15lrqGIpPIm2y3XVqKkoQ/tVtM931Ns843u0PqOSVu6LrXpiS4Fb2EY4BcTDc+DvcGr+z03b418Y5PjkFjj7HUSefA0qVCMJNsbjlezDRHF326zQTadQUVOLRzZmsiGK8P4Hn+PR4bukzVuufeej1/RtZE4ZHqcadoqMJjOKoa+sge34Q2R0HaWhms8b2PuL8e9PbqBN6FFUFRahktzsvO0d3l8O1JahksxFqQ6VZcXoPmg5Atbu44USSmYN6srYO0qK4bnjFVSUVqCYnaj5iGcgowTWVFei9UiixmHrUFFXKfgklaGuUINHN72CMrGFyVAqbVmqrFHi8TGbkV9kYIesguvgjejmtxwoyMNrb38EywQ5TFOo5tN0/KyAVYJCAjvSDgjFZHT124muIXHwDF38xzAvV1XhYhsaTci7js7s06SnCI83wc1vF+HzNlzO2YJi+RIU672Rr15NhlVQ/yskMqdKtKD6aJ10A2asmElqNh4Sh42kaNAmKR/NMvNgRYDSIuU6zBNuwPy8Hs1SrhD1XUP7pGx0OlNICVSiw5mbaJmcS3tJO5iogZXYDZQuI5jIh/nFAjz8ovidJ5FReg4sM0qotsSiLuadLA7bk6N5CtV5Kp/nu1sn3oRFgozXS+hu5KOduJf/PyRckPNiMUoO2ibloAXLZp5Gm9pwzeic+CRlXkcHPmOeoWNehWjGe6zS8mCWdoNl0BDosCzn5QhJO4NKudjFO512b5E00efmK86xEz7yHtJu+svxbM8tlOJ7jnv7LdKNfIO9XRB7i88eqsf6Y9Pv2vV0J4le9otJjJLUbzK4/9qdJLaJ3EtN3XebilWTG0h8r6e772kqnx8rw510Z3l/hJpoJ6FCxXYdMQ8vDsXv7hN3f8Cmn0jGjwaNcJXI5weI/63ZkTTSlo7o78Y8aWOVWDTQxLU76c7/f+y+O6iC99ST+F5Pd93TVD5NXWuKGu/7KWqine5lntha1zNoJts4gm1OaooX4j9SX/JE4p7bgBmw94uBi99u2AYdhIMYAWmk4I0S2ftvgJPfs9K+C7HvSWLej2zsuo9YgVLawzLlJGSmbIROIfZOjUVa+lK8ljUShXkrsGbPClQqY1BNRzc/fyWWrxyLMy8uRlXxCBTKZyIxZRkyzo1AhXYIrn85FylZq+g3DScYGIsK9RRo5bNx8lgsVkePg/LGZhgUo6BXLoaa+W1cNxcrV0RBqZyCOtUspCXMwbkU1iNvInRXluHFjCVszHHQ547Gt//chFXrZ+LGlYMEGWNZtkD6q0uRmDoDK1dPh1a9DJXqhSiWjUFC+gpU01HXq+sPq/wlJDaeCYQumOcUtAbWwdthM2gjbMM3wiZsPWzE7wZyHLQBLv77abY2owc1oMS4xuQVupWMWQnXfqtY4DFsaCJHqdeIBh8PnXKutGFNrIz+VcxrILEJ1CFgH7LVhN+KifAKWoCA8dOk40bF7j2lfAsGBMzGIyHTaT/HIjdnHgYMGoaK/Cno6bsC/fz7oeLmdJw7PRuuwStQpRxJ+D0aFTemwm7IcfQKG0dGszOUT0F5znQsWD4dTiFrUKmdgjJ1GDtoPN5+bxOR7kj0DhgJtX44Pv4+Gs4Dn0Glbho6++7Djr3zUXtjAsYvjoKDbzS02mVwDXkO2XTIy7LHwTNwOYJHzoVSGyMdZSp2Bv7ocaY/QHcyTxx3KjbYiSNPqxRTea0+/FwjBYYGo0voeohtmg0suzs5h4p5sRgEj/ZBEY1rTe6cWy8S4UGaZF7jC+4o1I+ROO/cMeAAbup3olDrDa+QCQgZM4fMowEPjEehYhN6BqzEE6GUgu9WY/WBWXALWQ+9dgx6ea/Co0H+7FizkZQ5Bu5BmyipUShi56rTTISmIJQSMAJK+lTd/FehT8AIhI4IhVv/WN5HV0YeislTZuCVlxajl99s9AyJRL5uJP71PUEYmVSkHIYuvjG48MpW1nEY1i1fQGd6E9SqjfAM3408GaU5fwy8QhfAa9AE6LI3wdlnN4pkqyjhM1BMBtbl1u/v+1FqaDOxK7Jp5tE+KwlwRKfMnUvNcRg23gfgNjAOq7eebjr6UNyxNzq160fx9VuMy9lPoySHUtfwwkbJswmJRWH+Yui0o/iC8dCrpteTZgqJvzW3GVmX3w9VqhDeRylQD5aoVDUYoQEDkHtzJ4rY88ICOmLS5CGUwngE8rqOHUYAik/enovHAoOx+7lpWLnSD8rL8xHhb4MRkR1QSka+e6EPwoPdUa6dKeVboRnKzzHwieyOJ8iUNy5EQUO1JnZI63Xr4BvUBwN8Hkepeg2d5UEIH9QKEeH+7ED++OjtOQgO6sVGnEHpnIFD8X0REDABp87MpjqOlBaii0HqsWMeh5/fFHzPshSL3dSKDfAPfBz+ob3hG9gTcyZ7ojx/MupkQdL4bqUqlMyp11wCbQoS21Yb20zLttJrJkGlnk/miamuOIl51cxDMK9QMxIatp2IeyNOaXh8yNIfBzMeA1ZXuoljYf32okI/+xYj9CqhpsR29B2Q65fhZvFcKAqmSAfsCyrl/+UsRKlu2K1ncD0M736/F+/cjMc7V49L9DbprRuH8db1o3j7SgI/n8Vb2Xvx1tVTvP4M3rmxH+9cP8LPg/jg6iF8/O0ZPvcs3r72HN4RdHMP3r32LN67+gLeuHkQb1w/cStvQeL+j648zecb6Sm8fu1F6Z3v3NzN3/vw3pUT0vvfyN6HN8R/117AW8xL3Nv4nFTGa3fnLZ6pL/uzLAvpuvh+7Ba9yf/evnoar984jvScDHb+4ZKECVtfrApCnmYOlAViWqu+zYrY4UuVs9i2c+HsvZtuwhbMXDRP2r5bohJzjsPwiN9CaZ+ns/fPWIdjH7ITzkN3YtP2+RTf28djF6rmoXvAVunQZS/6KO5UL53DlqATVZeYEnENjoVLKNWV30oWtn4EXRTqUv5h+nVldznsvztlqGGaoKavqEL7zC/RLENL/6uS/l0T9/4OZJWSz88SVOaJeL1kELXCkrX0iX1XovOAWGkVgK3PPnQLXo/H+h2CR98jNEcbYUfzMGHxNFTI6c5QBdfkTYOKQMkhdA+lLx5hE3cVN7Dp/uRGve9ALj/ut4DiL3oFfR8yTjqoPX8UPnhvO5HQNtqBeDJxFAopZb37H6RzuRm9I1bCJmgfRCyPmzd3oFgzGCXqIYTlIuxSfUTj35xEPKiMfLRIFAPRhbBecwBmxpZoec9mP7GL2NTUHEZtjNDBqCs6HP0UxkklMBe7GV/KhkUaHXVp4PyOvP8LEseJzPzwHIpou0qFX1k4DG5+cXD0fwqbT7/U2jaITnngPlTn0Xan7MVjI/dDnKbjEzgcRTqhWusFpkxMJ8lm47lT2+kNsJ39NuNYwhudBK/uSk5iltiXHA6Mpr4W8253U1m+OCB3LIoLlsLLbzVFeQ0hrNDFlDg+2z1wIYZNWceXbKRUbmCvm4bK7KVUsdPwnj6BvZENnFEIUylEQNOVvo8k5qjQPJGf59UwS1XDJFkFE0pSy4UnYdy8nRRVjMX/1SSdOt6sE2z2fwBTllEKfyAOieK7zFNv77/9JWSSUUTbGYlqeRTt1yDMWkk0S2lzJzLlO43EjmvXoB2wE5/UZnb9ltEVOSTtFi/PH39Pu4+WPnsEzCd/6BH4H5DyuJV6+BPREWXaB+7BowNXUJzn3U9B8+AevBAeIXNh338erH02w82bvoc0g7wNjwTVR3kVgels6Zecy9wnTREhhwaZhrl5ei4ZIM5c+gUNQuaZJ+ah69RNsDRpDmMTKxibWsKIUmQpGl/sH5aC+f46EoyTmGduKu1DNpfyaglj85bS/48+da7pcv0EvSU/CpUuhGhyFO3adDiwwe18bp9tI22XJ9mFLYXHwKcwYMxCIuoVcAudA8+IiCbb//GI8egadIBIfSkRboOfdzz1I/o+MXiE0uLlG/vLyS8anqQBIfXMO/fS11PcgphX0B4pMlCRfIQEh+uyh8L4fDVMEpo+11vsORHjiG2mrUJz0YimbEARPs/4Yakhfy4Zm5nAwthKet7Miow2bg5L4x/fyt80kan8NDUxg5mJESzIVCPzVui29hSap2lgIiKopN3dEcX2Zq8TH0vnK4t9aaXKIegxbAvEsOITgfNFflJqsh1/JongCR5+m9Ar4Hca1O4VsJB2cCcBzgFU5AyV5rBE8IXr2YthfuYH1GaWXjoaoGX6TVhRXTmvPQYjy84wsmBDCjJqgxZsTHNxAkYLI7x7ZjgKU4MgTx2LJz2awYq2TEiiuVkLqkE2vDh7oWFHP4v0i0iSRhESkZ3Ikp/Gre3Q7uQ1gqBiNE/QEfjcszrtVh0KiDAj6UYMo7ocjVnTF8B18Da4+/yBoYV/i+QeEQfbAfvgS2dWhK0qUk+SHNy076mzs2rQLPXnH2bYQRxSmC5D9ukIGLVtgzZGZmRWWwKRh8iophnwS8hUUpcPUcrIMNuH4fJ8OcySVFTbP63iRWggE9plo8w6KHKmSVGpROjCy9d3wKn/JqrL3zCE4R+ZHELX0Jaux9aD81AkHGb6NJXyFVj21ilW+ifQXRolMYUuRlY17E+8ioKEAKqlAthPp7vS2REutt3QcU48bA5/QAnrKJ10YiUO3xEHfghmCKbyuxTcnvbMyIL2jUxvJq5ZUSqFNHfqAutTClivjEdnJxGLwh5tevSDZbpYOkHp+hllNEqpJdAposTNIrqeQPdqJAr1YlxYrBr7i25ca0wuERsIcXch/ZX9ZNxEoqdZKFeNxuo3qUqaapAGMiYyNbpUg5y0/lCdcoHVGRF6VAv3rs6ws/PEI52c4W7tBA/+7uLUFT1b2MPaoQM6zT8F+6RvqXI90EpIlkkzMrY5rDqEoDNVtvXO59HDrQ9sbF3gZm2Ptk590K2LMxzsbeFpY8M8W5Ehdy9l+EFK1cHyVCmUuuFQa2bT8R4OVcEc1ncrnII3IeGlT640NMNfN7mGxBEU7ceLr8bAoIxEkQi8p4jAU1+dhpk42CjrjvUu5wGT8wWYefY0clOfwLXUQdLxjWZEnmZpZWj7wid42N4V/bs4wNbJWjpEovHkjPqDJQSRCXZt4GxnjQ6uDrC3p6TauPN3/WkajSRO1XBxcIS1TQe4OFrz9xPSEavNUu440qBJKqa0aaSgLCU0Ccj2Q13+I8hRTaYzvQqOQXsRsy/p+Ybq//WTq+9udPVbhTGTd9AH9KXzGoUCOvF5+gUwulgtuQVmGRr0SfgUFae7IT/JG9rT/ehzCfXVVAOSMirQ+qUydN54BC5dOqKdSzeJUY92dLuLSc52dlSz9ujetSMe6eiBLs42aOPsgR4HXoP5uVraqzJJJTf5jqaIqNj1wktQqCLpg02mnYuERr0D9t7R0iz5idSP9zZU+38n2YTuRM8Bq+A6cCgZGI5ijZiIHIay7Fk48fbzyDk9iUzzRcGZJ0h9EXTmLZimi6GmJhrwR6jl6WzYLDoEa3tnOFE92js4o/PMDWTQT0nUT1BWNkmDj+VPoapwIl2BCSjMGYWT6Svh6LdFilPaUNX/zeQZuoL+yha4Bewl85aiWjYMNzPCoE7si8KER6BPeJTUB7anvqgHDZnVEEEhm2zMpoi+lkUq/bDUEhJVMqXTKLMcxiJuVON6y19Bwga3Tv4StbmjpdkHMasgTqJ/1HswXP124uHwnxjx/19JCzc8P9rGbxtsfbfjq3/FovRkkHTsjiBlVjgbXcNGF0fs3N+ID59VY/ElObxOnUTz9C8w8e1cxH+mxOR3v6IPWQttLeH9RbE4lp/nyjH8w6tonqXGpLTv8VxBBfRQ4cB3hcg21PJ5GcJfrYHaYIDRhR9YPi+igWZq8LV6J4o0kdCrpqA4fxxu3hgLZ/+9sPGOQW92yIaq/X2Snc9CaUeQy4CtKNFPwnev9ES5Mhwa3WycuJrIxleTkeLwp9uSZ5mmwuj3VPjUAOkc+LYp/0ZxmQHvlgMPn7uOr+oMaJmkx+sAWiQV4YNKgxT0bMabucitqsVH+jra0W/wGv9vk6lGYVU1tHWAZVbDIRyNdL4S7ZK+RMyXySil0y0G58sU41CTMwwB40fC1XsvXBrGKv+26UpexT8fiXwaHgErMW3ZfLoSc1FZ0J8qaQpqVRMw9tV30fJMOYxeKkSrxCbUp4ihm6qm5FAlvkRpy9TDnGixTYK6fhm6cDl4zehCMVUnv6eI54TzfY8PJ+xhWhVaJdDGXijErJdfgFo3TtqlJKLDilntm1cOwD5gM2zpCnh4L/l7M+7O5BkyDy7BMXANPoI3P1lDV2KcNAteqBuEEvkYrPiI4OXCVdotEW6CtoxSKfYhdD17A7bPXUGvPV+h3/6v0TYhF22mvgLzhKvo9nwOHFZfwkPRr6P7c9/AZul5GEU9C+MZCWidIEZFxCFhZDqlzDJFhmbpamz7PF0aya9WjqIbMAYVRJN65TI4+K6Hk9jS5v8nLlH//576Dp0L97Cj8Ajcjk++eRoV7Pn5mrlk5mCqr9H4uigGpuer0fZ0IczExpUsLaxSZVSVSli9VooWqfWbWlqmEqCcK5K2hZklayidKpjyv5aJerQ/VS91AoQIapWkwJfq/ewsE1CbH4k87UK+bxRyc7fB+cmd9N2exRPD/p+eNvX/Mbn6iThEm+AUGIPJYmmAahzKtaOlKPqV+SKqzWgMv3iWUqNE5wVvocXKN2A17hgefv5bmKy+APPF59Ep+gM0n38OXXd/DY8jX6H58kswH5OG1vwtImZEXXqLqtmXiFeAkDkwqEZKUvfl52Ll8k7Y+W+GF4FVQ5EepF+aRkzcDveADUR229E9aDvUss2oypsFXcGghsWzU/g5FN6vvIQ2ySVokUh1SJXaaMukYbYsJW1fOVVkLnqlvotysc6mcbUzO0WFbDoKVGPRb9h0uAdtgIfvVjj2/YP2Efxdkhul0DlgC9wpEc6B0VDJF6KyweeqlFMaNRHQqabjG+2zePgEVeolNSzTixH3zRsQp7oXieAhShF/ajR/z0ChajhCIgLg4B0N5+DdzDMW516+nNrwugfp90gr1z/9aCe/1ZKbYe29Gl39Z+KTf7+ASs0UVOePglY9jRI1CqVkjkCKRSQxn1iSOwUq2SbY918MJ4IjZ/945rEbk5cf0Tdk/SD90amLz2K4DjgKN6JBsdCnZwgl6GK0tO7xm+9344mwybAL2Sit1Bb3WAfEIvbpD5Y1PP4g/X9Ja7alTBVqVWxeFJv2xac4vHX2isMPbNiD9CD97mnfyfeye4Y+OO3vL5e27TgR4Rm2E7Y+MegTPucBA/8qKfX8JymuAevgGrgariEL4TwwGv5j/+AoBQ/SL09LN8dr3UL3w8XnIB7xj0b/ISOk3Te2wXvRrX/9utIH6f9h8vReDC/fzegS/Bx6BE+AXrYcVfrp6DNiOly9F8HOdx88/KIfMPD/W+oWtAUOIXvRNSwaPQfMR4l6Oqr14ahWTkO1fAjGL6D69N8EJ9+dcPLZjunRp/o1PPog/Vlp8sr95+29t8CFEucWuB5+g4ZBROMpEEsM+Sm2Gpfws1o2AqczY+FB9OkcsAPu/tvQd9iDw8P/tOTQX2ywj4eH9wE4+h9C1sv7US6bJ80KCAaWKyJRlLcKKs1M0gxU549AbnYcHfY42ASKscw18PJbgfTX5B82ZPkg/d7Jq/8CuARshUPQBjj7bENH/7nQaRajMl8EbhbbqiahRDEEfZI+hFH6d1CrFwCykdDoB6NUMR1FmiEIHTwdLmGHYR20DV7+6+AxoD4e5IP0O6VePovg6v8MbENj4Oa/HY6Ba7HhQCzt2iAUKyahQiU2eJB0Q+D+3DtonXJVWgZhlaXEVfkqSqE4VnI49IoxqFTNwjXFevQJPAa7EKLRgWJL8WZK42LsOfbxYw2vfJD+mzR91e75TuEb4RgeJw04u/hvpYrchQGDR1CClpFxEVSVk4DrC6CjZMkKV6Hl2Uq0aFzrKa1LMcDoUjG2f/KCtEu1RDEVlbLxZGAYypQzsWf3KnQKF2OhO9DNd5M0LeQQFIcVOxL+d6Vx3My1uoavv2kaNmv1KU+/9bAR24B94uEpzumi0+3pdwg9Q+dCTwmqFDPeislSTPsCcbJu/mA8+2UWjM/XwvziZZiIGFMNk7HtU76EUUYNjFOLpGhiZQqx2UVMxkaR4f4o145DRd54rNu6AG6+R4lal/N90fUD26HxsPNZAafHJ/4uc3yRU7acavj6xyYvv2UQASicxTETwRvZuLMxMGj15bP/vtyh4ZafTG99mPuax+MzrnkOjGOPj4cLQYQjJcDVfwcd7ZXwiiTz2IjjFkyCKnsmpW20tM+9RDkZBZqxqMsZj+v6ubCjmhTHCzcy7IdInJ5rkVGM5O9eINOmQysiVIujOkSQdtl0ad/BpbefQY+g3XALfp5lWgR3XzLR7xm4iMPLA3bDw3cbvIdvQPT2hF90EPqU+Xsu9wlbRXdlLpz81sIpKAaegX/SEovufovg4HcA1qFLWLnFtEXr4BhEFRe4i712F0HFTukQbUFOVEUCZAhy89su/SfucQpeD/uQ9XD32wr7sNVwCN3G7/vhTLXlFRmA73MPwpA3iswah8q8+aji90KlOLd5JmoVERj88vswPa+GSeZ16fTAphh2N4ldueWURCUsU25CVrAT8vwp0vnYJbSHIqJpqbCfyuFQ8Nq0mZPgGrYODv32wSFiLboErYFD/2fY8OKM6GjYBderW9cAcdh5/UHhEvG6dEKGqHMgNUjgDj4j2mY77CIXwDlyFb+LtviTgFI3n9kEDtukg18ufbAUASNmUApFsApRgW20G7dPd3cS0snrgsRe7Mb/xenu4mR3u5Bo9IlYhrQLW6C+sQB69VAU6AehWjEb5fLJ9NMmUDLmoEoZhgp+xvzjLTRLVMHkfCHMxKb/c2r+/unjQoyTAeNMcdwiv5ORlokKdEj6BtdVS1BCdVyWP52ola6GNkhaKlGsHwetYhSKZfPx9dV1GDxlCtxYVtEhhSSKUzAcpNPd7zjZXZB0unv9ye4OQQJc1Z/u3j18KnbunYBHA/rSN91P+pPGXHsFz2Ihqd58Y+kUi1PNx6BME4kaNnZZ7gzob8xDad4GXPlnNF5/aS0uXFqL8xfX4Iv3l0P53TJocumTyel/qcOg14azx9MOKepPUC9jXrXyQaiRjaGUjZJi18s1GxD60nlYJFbD9KXbNu2/JbFD1+QcYHT+Mt7W7kOpjOWnNCq04mTDQZT6aSgk0BExxIvUI1GkH4Xa7KkESmLFGeuZuw5ffbIeF19ag/OXVkn02T+WQXlzMTveMtrX2ahUTKALI6KpTIKe9fPwXYhu3jvhEfAnrQFdvzuJzNsGj+C9KNYuQqF2LG3SMDrHVHH549j44kj60agiqhMwvvHY+irlUF4fS9guhq7GoJzMq1SReWwYcWZLOStXSttTQRACfo/9/mW0fvHfMEoRcRMoNRl1MMq6Z7Xzf0MZZVS7YlNKLSxSdDAm4OmXnoLLyh0olFFli1XT+VEoU7H8cnHAzWwCnHmokkIMDEFt3lgyOeJW/aSj+eWjYMidKB1p2Uha3VgCq2nQ68g8/xh4+OyAZ9CftFz+nU+ulthTHXT3jaHKmYkKdSgKRDwfxXiiwGlShcVRimIBUKF6vHRkfYFmAopUojHGoE42GgY61Pq8cfTPWEHNRF6fgJtFOzA8I6nphv4TyPb0azgnT4NCNhc67TDWZyYKWe5iMrNcy86mEsd1idXV7LysZ6G0tXmUNKJTKx/CzjiMkivsNu/Pm46i/FDp1EA3v23w+rOWzA+fFttT2K1uvtupPpZTcgazYFHY9Vkm/pP/HPLz9kOuXQqNZiq0WhFXYTLU2mm4WbAAuaotyM3ei9NXTsD7+GuUKiWhfP0BORYZeXgo7T9NNuSfQc2TCHISKe0X8ljOClgkFcPmzNdY+/ELeE+5HddIeaynXDeb9ZtE5o1BDTukkFKdaho+121GguIZyKk2ixQToSfzvIT9J1jxGLjgz2Fe0oWvegpE1T1gH1S566GiLaiShcAu5TwBwVU0Ty5Di7RsNEvJhiXtioDp4qxp83QRU5sNkSmHSTr/Syzh/WJnbDHM0hQwS9ETTMiabMg/gyxSy2GeLDamiCO4xGaVEpims5Ol5aNZsgzmSXkwPpcHyzQ575WzjnLWg0AqTQCkKnbGIqnORfm0pfIpVMND4Oy7jwBmE7r5LfxzmCeSM6Gw0N251+IlXV9Cgzzp9XfZO7WwTG44qySVdoQVsUyhnaJtsUgtIzMryCzar/Ma/pfD72RYZimskuirXdTzHhWsUjT1u4LEDh+x/yCzgMCikoyvYWPyGpltcq4IJllVaJHI3+lgI+lgkqGDaRbfm1lMGyY2V9YHtxBknk67eVZFBvD/C4DV2Trau2K0ZAcyzixnXsUwzeA773imOaXNRBwwwPc1T9PD5GIDY/ndmPUxSpdLu4uMzxWSmfxfdMwGxjceBWLJclTJxBL9SZLtdAqmT0tfdvbyY38e8xzpr3n6bMX7H+0m88S5kuNw6PI5NloJmUd/qqGS7U/KUFcJGOqAE299CeOsUnxxsxS1dbWoMAA2z1MyT+vw0Jg4GCqqkF1eiw7idKGMcnQ++jWuldYAdYXQMZO+03fBmMDCa1o05HzWbcFpNJv1LGqrDaipKkVldRnKKsvhdvhDdDhaIh39L6iuvA4V1RVI/06LtlNPwVBWCZeZp2CTfIP/GbDjcAYczmhRWlN/byNdKwf6nPoSer7r5Pl/UJPUd0qxjN48pQhvf6sGqmswctV+XhfMuhMJ814yvW3q9zDQxlcRxOlVM2Dtv1ca7nv27Cd/puTRh6OjfvzMHolx4lDQj7THWWj2eKLDxkqYUmVWGkpQSuZVVVbg0UNalFcVwcBrgnkPTT4Gs4RSfK2vgEpZhTqDDm0mnCDjlbhWWIvKujr6lMvx5rl/oRRAe//n8eS4WBjY0CIgRZvpe5mPAfaDFqF34AJpp2t+gQF2z11HjaEGteS9l5iJCF0I1+A4uI/eCkOlgVpjK4qYdxEZ3yZ8L9ok65hnHUpZJrtw3h+yDD0HxmLk7g9RbahF6ssfoM1ZMZJDCUulxCapUFVazs7BerFuPU8pYZV6x0iPkOL0cnShDdcW1vuqetk6iMljm5ANGBi5anBDU/7xSTij9uxFS9YvrvfPiCSzNTFUWRo2fL3kiR5qSkAiwrX0DBiPmooiuA7dBZTXoLrOgDI2VIfxL6J1khy1lTV4PGg2JUiL/iF0YKmWSqtroauthkwDeM7aCOdRh9Dm+E30G78VqDWQKZvQdvo+VMIAx/CZcBzzNKpryzFl3h70eDofIOMK+Y4uQ2NgMSQaVgIQTXuO0mJAn8AZZG4l+vgtgMNzN2nLqmCorZMYYR+5BS0iYmAT+zm6nlGiGrVIE8xLEOFlxNEjRWi7403UVpRjG6W2tqocLcYcYL3vcGMyheqtg13CKyih6yOmrVQyMfy3CbahG5Dx9vU/j3mu/nGwC9qLJ8MjyLx6fV5BmCyCKRnR0Dcyz4RIshoFcPSdRYZVY8/OZ/HpZQWolVDGRm899Tl0WZqAKkMZvPxjUVKlg7KkCtZntei44RKKqW+rqqqp0qjKiivRPjpRkrx7mQd9NcorSmEoqkZHn6VoflJLXc3bakQ4mlpcQRWsRj+Dh+Ydo6jw3SXVqGHnKCyuQkuWscVpEZimmtJHVlEyDaXVsCcqdHsu5w7mqWCZxHpdqsTy4x+gmubAcdQmVFWXY+CwZbcPLRA2UXTgrBqMeusC7Z3o3KMgz3sObiFxEvMamvHPSe5imCtwI3oHj6APM5mOuojbGgWj19j7pN5ZzzwLqhdUFqOH3zIUV1NNUVX1Cl1B9SRYWoL2k48j7Z2rqKpg49dVobqsArXlFeg06xQ6j96OuH1voOW4ZzFy0naq1FL0GrGWkreF7V8NT7oqD00/AJom9GL+HZZdpHTXkSkGOJ+iPaqrgZ6dxGvyGbRefhLtF2ah1YynUVdXhtwbZWQ2pZ+i1nrUXrRMrqRAlqKC0uow8QjaLE1E54XpcDpxGRV1JTh78T3Yn8hFs9MaWJ7Ro6asmFJqoO2uo62tQSHr1vJMLqzEUN0Fqs8sDYGWHM9984KklUQMhZy8F2jvdqD3gD/52A+vMHFE8WY8FkSwohAO+CSUyibBTBr8ZQUa1EfbBAUbqxDdAldg/IZnKUXFZPoeFJOhdZS2DhNPsAeXYurCvXAYtBVBI+dTAvRw8VmB74tFHKFySp2IolUhNbrzwI0YMHoNCgzl6O69Hm1m7qFNrUMJpQzlpSgiYLmmrINLxHEp8pahToAjWsvaYnx2Uw27OccoXaV8dgnsNibAUK2FWqlDJ9pYQ6me91N9UspFQKkq2rN+J69IapbWkPmVAQVF6LOR0lSkQV/fOXCM2AAdpVcEj7IZ/ywsWX9zdl7jLCURrgwfaw5LjCujI//uv07APSAaj/aL/+OYt2rtbkTHPE06jPUxR7Au7hiko5oCyTzajnLdROr1OSjJmYQ2Z8SpRfTdxKlCJKsXdXD3CYX94zFot/EUevrMQLtRp9E1IgqeT4ay8jvxWPBwPD5oByySc9F1/z/g23MKvELGEAFex0ORy5Fx8k0Ezl0Iu35b0H5uCiyGrYdvwCR0CdqN5hMPo3fIJPQJDUEfn1noFT4ZLmF70PnFKwQwI/CY/xh4BE7G477T0FeMbgyNR3+fUejsswZt6ID3CRyNgd7DYDL4WTgED+YzQ9HPexwG9p2PIJ9F6BP3Dnrxnl4Bo9CdNvnJodPh4LME3fsPw8MRR+mnVhEpr0OP8AVw8j2MZnR9WqSV0m3Il3y/K+qtECc+lSnGInrvaoKvNXi0/16s3vYsomP3YnPMIbbpYWzceuT3Yainfwwc/A/CkeTh/QyNbjwLsbOeAragXD8YZTTIuDEE7gmZdFqvSUGgLOiYmyQr0CZNhlZ0bM2SlWibRB+PqMycQEYcACCcd6uUG/TXrsKCDrBphoz33UDHJDr79JFa0M6Y0y/scOI6nWMFnV8NrM7RZ0wRxz4q2EglaJ0hnP76IFAmfL6ZOMvlPNU2kW6LVAV9LTYk77UUgaCIFlvzna1ThJNN3zBZjdbJ2fQBZVJwqdsBn3J4nWqQZZeu3RkI6pKMAOcGmp+RMV8xu6Gmn8o6C6R9SYnWBDZGF+rQ6VQhquWDUawZSjwQRXA0HrY+2yGO8xIn4IogUCIYlJhGcg/4naaIuvluZa86JC0T6BMUicd95sE9dBo8wifCLWQqqkXsBIKV8uwZGJ6eSH0Poi1WmmScdVMahTBLzaWDrISIKGlJxhmdV0knsJsKpqZqqWLIiDQtAY6WDjobOjkHZlk3YJmZR0dayR4tRmDy2FjZMKMtMc8SIxu0QUlqWGRclw6Ya06miE9xQqA5wYMZe79ZOhnHd1jw0zyTv3nNOEtOe8SGPi8jswWCFKNB7BRktllWvmSrBInOYJ52U7p2i3hder9w0KkaTUWHYtnNUlgOuhumlDajLDKYTro4vLwyO5jMG4KSvEg8GTkNLuK45/BR6BYyAd1Cx9KczKMW2w2XoLW/E/OIukSUSrH+v1Q5F3rND4RfEajqF5PYH95ITV27kyY3QU3dV0+3I3jdjuJVctc9TeXzQ2W7l+687yeoibYSAxulmhHI+24NHMLEGd+/UxjS35d54rlGaupaIwmjP/p+avLeeirl/7dJ/BahBu64pzEPQbeu/1DZmqI77/0RurONGui/Zp5n36AfD78miP/b9Fr2+zFPQmIN1NS1W/81Bqe6h5q6t4Fuh1+7HYKtMfSZRI15CPqxa02RyOfOe3+Mmmirpph3ixc/xBNevxV+bdDMOLj7xRNlRVPvxuCR/gdgHbKtnkI3wjpsnUQOoaukxUZugWvYe2dDr6aaaaJATZI07llfiVL1CJTmz5J8wiIVC68eKrkZAuxU5iyRFhaVaIazg/A/IrRS9RDaUj6XPx3VubN573RU0rZW5E+SnhcnJAlpEg5whYgOSXVWrJgKnXoqKnitWJogFgHzp5Am8L/pvH8030P0J5+NQn6Kd4jgVuJZnXoa38Xv+TNYXjZwPvPhp1RuMkycQSbKLGbXi/PWo0Qtjt8Xc3r31PlnUIWU12jkXV5BNLwVPbxjCV7oLkm0T1oqIqiH/1JpRZuIcuYUEAv3gXfYRhuiHU+fHbAN3A97//28qSF2XtCmW/Hz3HzE9R3wDFj9q5knYuq8d34CMs/PREXeaDJrHs5mbmblI7Ft33jsi5sLQ2EUChRDkZS2GBvWr4JONxMFSh9oNPNxNm05CoTNyp+J1NS50Hw3j/lOI1EiNbOhVUZj1ao1ePq5CQRQS1Alj4I+fzi++HIdojctxD8+jENVaRgqb8TixYTtqJYtQnXORJxNX4cbn09EuWoEtDkrEBO7FnE7ZrJz0PWRDSKjxkBTuAar1szDi2fZYbShMJDJ507NR3LWKCCPjG6q3j9BdzEvYDseoc9qFxYHm/DVsAndfCt2nk3QDjiHbIdb0Go4++7C4pjnn25gnZFRT9oz56ANhP1b2TvFmsZGcRdqqt44iwFau2Cx7GHeL2feHbRo2Sh4DHgBdfKRKNItQpdBcdI8V/egpfAKnIVKdRBcg6ahN12SR4ZNhO2T8bgh3wu9YhVs2ZlKxWy9LhTd/GPxry/3opKMLFaPhCJ7Cbr4rEf4iOHsmdvRLWgXVJremLB6PFX9Drj5DoMNO+jYqUTEOXGwDVkDrW4yVegQft+HjIQFZNZUQvb56Oy7EK79ZsPdfyX0ubP47l2wDlqPJ/yXoVvYVjjSB6zL7cv/F6O3z1xpBUBTdf0pamRe7vcryBwxWrWHHXWWpBlq5bdNhJId/bEnRsI+bCXsAmPutoszVj8zRfhvYkleTv4eNhBVivSgkJh6+q2Yt2A5HV3fGKiKg5BfxJ7EPCXmBS6Bp/9M5itWZ+1EtmYhim/Sufbxw4J5vaFTLYJr8ALoFDMlFeYSshH/+ULMZlBVUjK+v36IjXkQeYrD0CjDoKIaLi62RVd2yujda2C4Ho1BkcPwmO9TkOmmsGevhEK7FKqCYXAOX4gXz+zDypgZcPLfjoIbI1CknANXn0N49x/rEDhsDXoGTYbhxgJck+2BU1g8Cm4uIiNn/A7Mo1pn/cQ6GMEDoa1KaFvtqR3F7qbufsvuBzUi6oZY0uYbvojqYzrK2JvFQHOjcf6tmDd/+VjYDlxMnX4IthGr0Wvg3lvM6xY0GzLlFv4XixLVIPTrF0EJHI7BIYOg1s2iGl+H7uFb4B6+FjZU7599doj2cQx0BE/F+WToE/Poiz4Fp+EL0JvSodPOhFP4Anz0r23SWpIy9VLUZkdDeXMXugRug1fAetIOmoUYHE3bisjRo+E+YLvkUJdrwuDktxvxcasI1BYjhP5YhWwaNNphNC8HUV6wDb3on/3mzFNN4bVhqGV9Gpn3wcdHKFj16rOBXXenASOiyd1dUsCiKqUw3qPpE91+UZPMaxBrie6498do/sIVtJuHoJRNoVpbC8fQWDJvegPzZiL35np0CluIGt0wHNoxD+7912OA/ySi25VwClkNpXoZpWUQ3GmTP/vsKZZlIm3kaJZ5FJTyRSguisCuQ7vQyW8TlAQ6bsGrcfjEItRcXYHPP9iBuUtmQqVcw7ocgEw/HcoiP7iFLENCYgw2r19ASV2HmryRKJRNJvMO483XN+Fxdmif0Amoy5kFtSoO3YLjodUsg0fYLPQIHAlDLsFW7gJU0/aJU5eaqvctuqPNmmYeAVMD84RjX10YigFha2EfEgP30B9x4l1C46VFo7tOLEaVbBJfICSv/qW/FfMWLVzE3r4ShuylUBSvYI96usHmLSTzpqOgOAA9++2A45Ch2LhlI7rw3oF+E6BRrabNi2HjzUaBbiTc2ck++/wAyzKZcDsco+fQdgU8gx0H5sF7xAQ8HnoAxdpRrLA3mb4Ie44SgIXPg1dQCCpyllNyD0sx/gp1wVTdG3AsfROKimbCpfdzGDFzKfyGjYSt/1ooZOOhLzgK635nsGDNDLj6LsCAgUuZ9xBqgOFw9V+DIaPHI2L0NOY3kh3rdszBJumONvsp5pUpxkBG1GsdGgPXwBV4PGTdpw2suj91C6Jr8PhmNuIeFOb78WExR1f/Ug+fWBY0Bo/5iZgIY6U1l7dCjgqi6hJhR28VklSXS7FnTyylChKhQctUEdi6yQFBvqFstEjIry9DSEhfaHOnItTPBkEBAUSH46HNm4nAkUPQNzQQV5WLMHZIK6ryHYgIfYzvWkpVMgrBAU/ii3+uQ3XxcOY9FBV0LzJfWYonQiPgNygU6rwlkiuhzB2B51+YiQF+Y7FvN8GXgiqYjeIfGAqtigBIOwmBPrZErztQpJhCdb0KA58cCp9gfxSoFjJfllsZge+/Ww2fATMwblIvFKnr3Y4wvw7wD+oDn6BeCO4/AEXypdL4ZQVBV03eVD53GzNUy6bT7RDLIG63mUY7UVpZd/naOnYgETN3L99J5qmG0R0S+yemYubKJbR1GySXoYFNTacJ8+M/7TH4afbqp6GRbWdji5GHBuYRZLgT4T3uOxt10qLa4WwcMQ3UQBr6O+rbkiqojvcYZMLPolsgNnMIukaoT3hefW0SDIpZvGcWO0IUamlP6si44uwIGLQjWfAZ9NNGojSHEs7/KnMmoTB3JEryhtAHC0f59bEwyOejRixRb8i7gv6anoa+Jnsaaun8Vioi6RvSBbhBxzw7CjUsYw17dKViHN8xE3U3JjHfsajMnos6abHwMJTmDYYhbwJq9eNZdl5ryLtOPhFF2YNRfX04qhTDUKUawmcmA5RMQZVU/ZVy2jH6jgZZFKo1A8i021JWrI2gT3h3mxVqCYy0kbh6fQGcQ+mWNTCvTDCP7xSbRT18xGGtO2gmfsYh5PYBwkGPwdjJIv6bACsNzPOLJvO24nGfBagonEPfh35QY+xTUqlyHhHa3ZJXpB2NV26exPtXnrsj7irp5lNSPNa3rpJuHmyIHXtMui7Fbb3+DN6/vgsff/cCPvzuNN65dhRvXzvG6yKu60G8x3zeyNmLN248izev8f+GvD/+NpHPHMc/ru25Ffv19WsJeIPvfFvEhBUxY689w3tPSXFq37jBfK/y3Tee4e99t555Q5RPxLK9KuLVNpT76oss3yEpxqyIFStixr59XdzXEC82ew/evHqS5eR9LP9LV2kOyDQJLbKzFxVMgFxPd+SONitWziWDJuP6lXWw84u5xbwSui+l8qFUmXG0dTthTQT86kc5ZxtY9ENps4l9QAx9r5W4/NVmiu9tRrgxc+vQbeg8mA6kEPHgTXTs44nEBNA5JI3OOPpTDQn/TT2IUjCYEjIMRlli+V3Dmo7fm/geUykubBEskktgnMF3X7wJYxEy7aLm/vt/L8oogt2ZK5S0MZRGMaozHE4Ba+EkbarZSPOzjf7kOrbpTrj77IfHwGelcD3uvgfr/TyqauEqFCjod9K3c5Fi5s3+ccnz9F0s7T5186Ox14xDef7t+KX2/aKlIbNOESvh3m8r4fIqdAxYSH9pI9z6H6d474d90FZcy15Pvc+ew15XJwtHqzNKGKc3rOv4vUlaLsh3ZajRLK0QVgnfwTxNBouUYhgn3J7Z/73JOKsI0Z+nU6pGEZREoVAzk8BL+NG74ey/S1p94BR4AL181uPRx4/RJD0NV799cPej5Clpd2nDa6nyS6g2B1Bdivtd/X5i5t0lcBdE1El/+kaFYuOhil5+A/OeHLOVkrcZnQatweEX4lFIe3ZDvQru7DWOhM6eZJ5taDQRGeFtjlAXs4Brs9Dl5EuwSvqDGo7MM05TwSj+I5iYtkI7EcXLuD3aG5ugmTi2v6lnfgeySsnFR5o4+pVijHYsdPlb0T74IGyfFNve6OQHxiJs6iSU095X6k6hb9/nyZw9cBywFQViP4Rw0mmbi9RjIc89Arug3dRusdgcn3ixgVV3p9FzxUQrmee/E7mKTXzxUKrN2wCkSBPIzOnYhqynbt4NhX4hUSEhPR1HIdbBwxbDk7DZdeBKaXeQCJBUQpj7srx+/WVTlfzVJFZmSauR1TAVsWgvVODhxC9gZB8KWxFHtkVb0UvrycQY5iKEqJUljE2N0bnXbJhmaWAhwp+ey2c+SlikKmGW+htGlD5fJaFxsSm0On8KtuxeDCdKj3vIEnjQtHj47sTw2UPZxhPRLXA7vHwOUZ2KMd7Vt9pbkLRlWxcAR7/NZOA6PBr8A4uW3EN2oNPAGPQIoNTlD6ExFVGDbwOQcrkYXVhKP4c6208MVG9Hjvop9qJddGYPIeXtr1t2E4fZ+O+ARiOmSqiz6T4UKJf99jaPzBNBMCzO3ECLNSdhZGlFBjWHqVFrKay2UfNWt5gnfkuhtkkmDWRkYoVmVq3R4al3YCxm9NNL0OF0/Wq3/5ZMMovQOeUtVN4kMlbQNckfCY+gpXQFttC5nyHFffUkch8xeyb6RYzh9aWUqp1IT4snkr6t6QRV0KUppvaLGBIC54gtksRKzLozJWe8O8UuOIa9YxN27VxLpt0O9XybCPEJ3d96ayLswnfCy3svXIPiJBLRmkU+nQIPUXWuw9dXY1CcH4oKbRjh9Gi0TJbDKLMSpqLRm6hw0yT2B4hT2nXSEgkRalvsZTDLKicY+B5Gdv1hJSJUmpjdYtSvITNjMvKJEeiYqIJVhh7mqRraLNrMJGE7G/Zb/ELa89HryNPPoOTV+7/uoethG3AAB49neTVGarb3Edu9hWMeh8d8xJjuSFSJ0y2aaPu8m3PRlW6aK+99JPyeU+e7ifkiEWo74Hk6kpPpB0U1QSNRIx9Pf2c0+g6cAocQOpYBWyVqZF5PqgZH+iT9QkdQdVKCtUOpPoZj8Rsn0CJdXh89pInKNkXSZhChGlMKYXlOD9MzcjSbuZeqrw0sBdNakcyb3RfQ/heTJUmEIqV6NTJrBedD71OdFsE0WZS14r5y/Ry6UjqHmmcS/cKJ+O76frbRQTh414cgbWSeIGnPesAyMmgQ3awZVJPCOb+/7QsuT0T3/vF0G9bBwe8e6XuYXPUi7HenMX0kMvau+NyN1D1gMVzDp6Kb/3q49BsCh0GHJaY1ksjn2HPv1rgFrYJbwGaUq0OhVs+BXjsKxTlr0S7lmrSCq6nKNk2i5+vQlcbfqKVjPZMsW8LCyKq+sc2pDhtjwt7LkF9CpibMSzBOqFYhxS15rTUsXd1gKkLWNFm2H6ey3LFkyGTJqX+s3yhYB9LUDKg/cfBO5onFXB4Ri+DeZybcIkbTFu5qsu2dBqym1O1FD+9NsKFb1ttvQoTIyyh0ZBz9M6pAf/psv5R8990iKTMmEQDQ1W8XbmYvot6un5UoVY2HedJNmAq/q4nKChVplSL2thGApJXD+LQGbWfvRGsjCxhbWdxu6J8gMzJW2DYR11xiivGvV6kmgpEmfL9FC7htu8Qy1sE0UQ2LRAKbpmz4xRxYnizFjJczUSMikekjiRuGwy4gnpK3HSFjVq1hvkZNtuMvIDefXehOP1vkZdTNdw3cAzbeCqL+i6ghwL0gKTMmV8JaJ78d6DPQDyVUs2J5gkY9CTNeSoZx4569eylTSzWpQpfnPqc67CjFJjeyIhl3rmdCE43bJAnpMTWHJcGLkZmQSDM0o5tgYWJ6/70/QiZG9e80k74LiTRGcyHxTr3p+lyFmdj3lymW+N2xqSS1FlYX8qGkpimTLUCRYhLUqheoGsXGktvrMZtsx19CftR8zC8l5WuLhix/u7R5+4uwo5pwprNflzMCen0YivRB0CmWwyiRwOVOpjWQ2HlqlaxB8zmHYWLZDFZmLdHCiA1uZlEvAYT4VvxszoY0NmoBI4tmaMX/jWn7jK1MeW8rbJjYD5efD8CXZ8Lw/ukgDH/CEW0tqA75zC8moZKFXRUB8o3pYvCdpuZUpa3aw/KsWOh7fx2MLpSi5WkZSvNXoVg9HkV5Yk2mmJLahkd8/0Jx9jxCqNPpMmQrd6AmdxZdjMmolY2B0dmrTVecvpaovFjJbJyshM1z35Apj9U3npBC4w6UKCMyjBLBz13rvFGY1A95Z0PxWmwf2LRsxgZ+mIxuVi+pAoTwWZPm/GyKOT9FLY1pW/lpYQoTqmDHpc/BPK2GqJnIV6jNJupgkZqDdwszUa0YR1Q+BuUFo/D4iGdgHx6NYdPin2W+f43kPmCnNFLzaOg+9sIo1OVGSaMF6tLnmqy4tB89RYw9CoBQyd+FsMhiD0+pg/PG4/Uq0LgVslMHYfu4zpRCI5i3Mb8DKfJ/U0oqvxtTIs2NHiIThKr8lWCGkm3Utgc60Y80p9/WXIQwfTUbpmJrtrRh8p7yCxcotQxl2kii7GDaulk4cXoPPAI2ECGuEnn+ddJzKR9udAs8gK7eq1mR+UReg/k5BWrFMrRN+5agRESa/PlDZpZnr+HsazvwsJ0zHXAjtKGatDJqS6aSgcI2NsWAn0tEluZCRZq5ohN/t19/AB2TxIEHxVTlP442jclU09QStEv+BpPfzIRYrligHkctMxzOfhthTb/ZK+AvxjyRxCorcSTw+JVTUZ03GmL7l1hvufPj1+hDVcE4qa7JBrmP2KutaEtyMkPQMokSuuYt2Bw8Q+nqAhMLS5ha/QJAc4uMJSBiZGxBW9YMpjZ98NDZPLgtOAoTOuimaUpYiM0lGUKVN1GmRhKdUKDjrAJolIug1k5EqWIKcrXi/LEtsCPq5vv+emnAyOUFXj774Tl4BzSqiajThtEJDYRWHgXzrFKiSzF60kSDCJJGYqrRPpE+XloF/nl+GYLSU9E6RQkHOxfYOHRBix798ciLX8Mkcj0eMqZvRhvXUiBCSmJ7wRhhL/kpMYnXjGkvm4sxzhb8bkp1amEEj7g30TXjGto8+hi6OjjDycYaHc6IKSyBIoulDS9Nlk8Qy2icKSRTixFpz6EsfxYlbwS02qHwCl1KVBhLSP8nner3WyQPv52wJgNPnY6WFu8UKsehSjYSqz9IwEPC+W6qURpI9HzTtGL0P/4a9IlP0qYY0IG+oqNNR3Rx6QB3l854xMYObdwc0HbNGdi88CFMmpkTedLeCVVKpGpkTLVqYSL5fgLoSCCkcw9YperRYdNxOHRyhINtW7hb28PF1okdwxnWR+iuNFGepsiMmsCYTFZqpqFYMxg1sknQ5a+Xlq27+8Vh8+bkdg1N8ddLLgMWwU1E7g9cDWkthzoCFfkToaYdNE/7cZvXPvUrTMs4DmXa41h24QJMM/PQOToN9g6d0NW5E7y6OsHN2hndu7DBKTUDOzihXec+lFY1rMbPRgurrvXMamWEh40c4LwzC81Pfo1mzr1hbecBdxsbdLX3Qu8OLnC1dYS9YxfY2Xmix17hkDddpvsoQ45Zr56TllCUKEehQj0HA0LHwsknFp7+twcu/rLJzX837ILi8fZbO1GmEPsTJqImPwJb3zkIY9qMZql3D5kZp4iDCKg2s8pxOXkaDMcfxSMn3oYpr3WYuZQN7IzH27uieydXSWJsnbrC2Z7MIbnYOcLO1h4tyBTbVXvQIfUmWr1YALvNJ9DVxf7WfXeSR1cHuNo4koEOlOj2cN1w6q7yNEkZtSyPDA8lyihpY1kvsTB2AjT5E1jX7XDy34Xo3SmXGprgr5t6By6T1oK6BkZDI/Yn5ItRFzHIPRpmBAdGWeIUodsN04xIz/ScGiWn/FB9yhN9z7wGo3PAQ0mE7cl6tAyPgktXe9hRddo62MPRwfYWI1zs+GlnR0ZYw822A6wd7SlRnahqu/F3l7uY1kg2rlSXtu1hY9sZrYctQtufc+hqFpl3vhYHrr6JcmUUbhYshT5vJJ70n4wufgfg4fcXRJg/lJxpA8T0x5Ejy6g+hRMr1MxkXNS/Sf/ujiEmkliukJsWiezkIBS+GASjS7mwSpKzt5fAOJUAIY3+YEYFHPZegKM9pc7G8xYj3Mg0e3t3MpCS5NAS1lSvnl1deM0FPbp0uItpjWTt6YVH4pNhcq4GbRKL0Obs3eVpiszo63Wiyqy78QQqlf5AbihNwRx4honjjeMwZlb8/oaq//WT//Bo2IVugXOfjdAql6JaNhYlhNQq1Sq0PPMv+lTVVJ83YXTRgG/SxyE/yQeahL44lrGTjGraNhoLZhLQmJ66BlO3R+Fua4d2brbo1tkVPTq53GKOC68LaXS3cUDPztZwtXZHB7cuMHosFM2PX4cRJUj4dGbJP4Is7yHTNAA3FtLGTUepfDaKacefCJtH+76N/t3/gK27N3n6PgO78FnwHzUS5WJtv3oIquTDoC5cDeMLtfSVKnAucz00Kd7QJ/RAYUpfdD31FZn3A2tPLlBCLqhgLDb5p1dKZ4K1W5eKgV3bop119zuky0ZSp7YObrB1cUFXEX70AtBCHHEshuVeF1JNxtElafI99xJdhIX/TkJe4QSUSAtyx+C7G8fg4r8d1oHLcSVHt7Whyv87ac/xS3LX0H2wpfrUyeNQWjgGxeoRqFJOxQtv7IT6dD9Un/RA6ZmeyE8MhDpxiCRdRplNNOCPkFm6DjYnr6JFrxBKmy2suzqjjbsnbE5/3+T9P5cskyqo0kvQ6firkCvnokICX3QRcsZR2jbA0WczvIL/h+P02Q9cCrEXopv/MpTS7yu9PBr56f1wLdkPl1MiIE8aAJyyheG0C3qm/Rsmwr41nGH2c8hEnPtyrpiAgqpWeraSNrOCKrEGJiLQfRPP/FwyviCD0cvVVPtr6O5EoUoxibZ7CCYtngKHoLXSHGZDNf93k1jiZh8cjw27ZkkHiyvfIzA5FQT12XDkJz+BKynh+Pe5GXQZFGidTDso1rI00ZhNE21gmgoWKXqYpmppE3X1zEyvJjD6L1ewna3GW/JnUKwNkXZPiT2M+pzVsPGOg6v/AcxY8ez/PvN8Ri6Hk1887AK34Hr+KuS8GABd4pO3qOhEOIxPNr3WRRwRLNTo13XAF6jFppvFOPlpGb6pq0GX8wp8Z6jDlVoD5n2khGUy3ZDMfLxTV4yZ72fj4ePv4DODgdcUaHtSgckfXsFDp9T41FAJszO0qxnVTb5TSL55khrL05+iMz4CBWqCLfk86HJC0DNoKWwpcR7+P2Mfwf9KcpX2uG+Ge+/1+CbR+Rbj9En9cPz8TjyU0DRIMaFPaJmgRXUt0CyZ/mCKHNmGArgl69CBNq1l8nUc+UJL5Crj/2KpezFcX9dAjUJ8QMa1O/IZol5R4CVlIWb/IwdD372J7ke/RPQn12Cc3jSqbZ6oQZeED6BRi70Yk+kaDEWBIhJPhoUQoKyS1lQ2VOvvk1zENuqQFegXNhaFSZMgS+6FkrQnUHFzAh5K/QRGyeIIfo20ruVWY4rjhykhBYYqWCd+D6vMEgz55mtEXpLhP5UVBCVfY89n2WiZQFt3kQy+UIJPlcBjZ3X4vlZLx/oapn30H7RO+RbrX8uDXcLHKKs2EHXm0TnPvuM94gSjUlhmfIe2Z3MgDj+vy5sInUag5Cj8+5sTcAzaAlv/Z7Fi05F3Gqr090lLN+97zcV7H9wCY5F0aQ2KPx2JMroQJfKhqFWNpsOcCzOqPSMxEdrYqGniTOkS5NbVQm0owfHCWrxWAOl8TI+0HFgkF2DTZR2+pPpslyxHp1N5KK9WisP+4J7yFa5RSo3PXSPzNBj/yfd4wwCUVVRhl0pPZt8+lLx1ojjmqgrNCHr0qhGoFkfqa8OBvCio1dvgEbCKtJVlX/33k7rG1PnJcfD02Q1r3x3IVexEQU69865Qj4NKsxgtE8UmkTskL1MDsyQyk0xqnSyD2QUiSnGqbqqQki9gdVYN80QtrNJK0foMJeqMmFrKgVmqHi0yc9HxnJpqUA1TcfZYsni2EOZpagnVirAAt96TpUbbhKtQqeagWDabEjcO1bKJUKrnw91/qbTgqp3v31Bd3pu60zdyoO/nEbAJRZqpKM2fSB9qLMq1E5FTMg/NU8ukQ906nCZYuXDbbTAhQ0yED3heB5PzZNJLdNr5KVZlt6SatEii6jynRMskjXTSfDPeb0zJrT9GuGmbapZ+lcyvRMvXi/Cdag2kM0SVE1Ejm4Bq/VD08p8Ae/8tsOl/z3Eaf+fk6b8HXcMXwt07Bmo67+X0n2plo1GomIH8os1kiEKSnmZ3rj47VySte3loego6PH+dv9UwvkS1eEmD9tH/RPOlr5DZxbBK0qMTpdd6w4fo8mIu2iUqCGyUECfw3sk4QeLUPvOzX0BXEE31PQq1dGWKVWNQo5uCiIht6By6gf5cPIZO3WrbUPQHSSSxJNwlZDt6B8bRER4OnXYEiulLFVONarXj8NDFfMnZNk6l33dOAdN0HUzJrNaTnofHzs9gM+8CLCceQzP6eK6HPod51HG0nXEe3U/LYD7lBNpuewdux7+E29Hv0C7un7BoPMhbCpR4k1JJl4G2TkMpq1BMoyM+hO8ex440FZOmToDt4LXw8DuEqUv2vNhQ5AepMe3end7RIWAz7EJXo7/fBqosEVtIHCcyimrLG2WaleiYdAPNxQaQNDFto4FFeiklSYNmdM7N0wrQlirWhDbMmG6EyexLsDzJ+87x/ldpzzJpO18vg9WlInQQ+xAaDvKWDk89VwL7s58R6Q6DQjkJet0Qvn80SlRTMGVuFFXlc/CKOIyJKw8+UJc/ltx9Rby5WDzivRD6/FmUvjGQgkephqFaFQqXFzOlaSPjDNq5DNqzdD3Mz4mpIiWanxLL88hIae0J7VoGbWN6oYQajdN57ZV6aROoVHwK1SnWoYQmZqBaHQ6xH7wmPxKlismUvihMWTIFDr5r4By0HANDptY1FPFB+rHU6fHVcAleDo/+KygFM1Gs9UWBWux1ozpTjsamr14l4qyEVWIpJaoA3TZ9DJuTKphEPIPmK19D+2M3YbbkZbRb+S7aRT4Ni6Vv4uGYj9DhafqGC86RkTUEMDdgnqRE3DfnIU4VrMmbzE8xUTwU1QWTEDEqEg5BYr99HAZG/o1dgl+aFq07/rCD30F0CV4JL7+NUOrXANkiRt9o6EnV8nHILtgOi/Nfw5ySZrf0dXjvoZM9IwEm05PQ9eBXZNJ5dI35B1ouyITR3DSYL7uIrmflsIh5k76eDs0TCnBFu4OgREwMj0OVyh9VOVNRUjgf3YOGS2dpu9LGDZux9wHjfmk6eup9Ozf/WLj4043w34tXv52KulzaInHOiSIIZQQ0Jbow9D37Df06LTodr6KjXYoWdBPM6MsZvVyINmdVeCiplKqzCMYpWjyUUoUWWUo8lvA1pXks1LLxlORRqNR4o0DExdOtxKOU+J6BO2Eduh2rd515wLj/Jtn0jYFr0Hp4Bh7BlHmLUFMgEOgsiDNOxK5REW77s2ICiTPioG9xunsBmSlmIxrsWpaYIiIzM1RollGGN9WbUSEfS7smDrcZTz9OnNc5AN/8cy88vLfBbeCzsBuwC+mvfvV6QxEepP8mPTZUHGW/i+DhIH3BNUSgGymBYpv1eFQqRDzZhUSk4Xj6SjpaiEBMaQ2bQcTi3YxaGJ8HfLMSUZAXjtwi4XSLGXDBPLHCeTYGDh4K29Ajkp11CBABCcMsG179IP0WadyM2Gqn0D1wHkhHOWAT9jyzkBI0gZI3FuXqIfw+GeKcyqK8WRj69muUMiF5CjifeBPX9Fto1yixSnE4qjhKaxwKro7DjZw4eAXMhb3PPuk030cDHgCT3y0dfuGdxx2DRAgcEVBiF7r7r4NSEYtqnThfegJwc7QUVFenmAM91alSvQry4uHQKFbS2Y5ESV4UpY5Mp8T1ilgsHU5j57cVtr7rMXnFi+83vOZB+j2Ts/dsiMNdxYFqTqHR6BM6EYpsoTrHQ68mCCEjS1XiQO8oaDVig8tIVIvQ2LRz6zavho3Y/BmwR9pD6Om/9YG0/dHps+8UDmIPoH348/Cg9NgPjIGtz3AU0xZW6KfQXxNnmoxFrWwZne8gHHlqD0GPYFg87Wc0PEIPYGnM8QeM+zPTyFErle7+R+DqvRMugdFw678X3QePwfVrZJpuLqYsXAQXv/noGvQMJTWWyHUfnP6XV3n9FdNj/ovh5L8ftuGryaStcKCvJlZ0uQeukQ60cw7cTGlr4gShB+n/T+rpv4qM2kKGbYNDUCycydBu/quR/tIXNg23PEj/31Pf4Nlw6TflgaQ9SP//0vwNTxUbiQ2/D9KD9CD9/mni4gPBNn0Xwi7wIDo+vhqPBc96YBkepAfp90oHT16M8giJkU4zdfA5DnESuHPDhnEX300YOOyB5/ogPUi/Wdr1bPpVz+ANsO0XD6/AXXANWgdXMUzk85Q0tSLiIjj2j4a1Tyxsg7eiR/jfaMfLg/Qg/dYpfPp6uIVuhmcoLZvfdogDaO2CN8G673IcObIE8q8Go6xkC/qPipJGkZwCYuAeEAfngdGwH7gWdgMWIWLOSeuG7B6kB+lB+qG0NPrMgO4DRGjBrXAK2Sydw2MXtorfN6LfoOV4MXkX1LK5KNeNQa1OxEieDK1sNvIVaxEeFQqXwJPoGhoH9+Dl8AqOhaP3RjxC6zggbOUDK/ggPUh3ppRXP3s0IHIuHvHbCbcwEdg8GnYhInrCLvpy2/BkwHL8+z/7UawajgpxXnz+FGn/lAhyWiG+q4eiQDsB5bJZKMubjE3rJsNpYCxcAg7SUoqN44SiwZv5Ow5uPnEYO/Optxpe/SA9SH+vtGPH+22fCFsLl6DltGZr4eAfB0//aDgHbUKHx2Lh5r0Uk1ZMgIKWrUI5AbV5c1CVO1s6ZbZCPRr52tmo0kSgUD0WVerJMGSLXTEiGuMoae+1UjsFn199Co+FhNEHjIdDcJwU+83FfyWFkFDU5zg8fJ+F/4SdDxalPkj/22ntzmMZj4aupVDtQIeQaLhF7IGb/xZaohgpdI990G48OWgYvv12A6rV41AjbXqZglJNICkC5fLptHaTgWuRkJXEYNBrL2H5S8lQ6lahUuOLYvkCWsKRKM6fIe1l1H3ni9KcEMhvTMbhF9bCM2QZbHz2Sut3HENXEsYegLPPDngGzoS9/xq49VtW01DUB+lB+uumvWffneMZOBeOPsvpe8VTuPax04uYT9FwFwLgtxtuA6MxMGwUvrqSiBLVXJTmj0YFfbZS+RwUiBgiqqlQKxahirBSJx+H90qfgWPaK2iTWYkWmaUwOp8Pq4ulGJhxDldL9kOnWowS5RhavgjCz+FSTKlS2QKU5A9DtXYMStRzcOCZ6fAO30M/kOUJWy+NjHp472X51sA1Yg0cWD67fvEYNWMnjiV81KmhOg/Sg/T/L/3zit536ZoPCh7xpRUL3l4fwtd/ozQSaR8cC0+/DehGS+dKAXQYtBWDx0Xh6vUD0OUuRZmMlkw9SoqEXqwZAq02igIzFdXysTDox+Mmhe/kd6lwOfYPGIkgAQ17nm5tn+GnVWIOrM7p0fnM20jKS6HVm0z/bxhkuiX8HgXIQlEu+YWErgohgMORl78QWe/sRN8hAegRthWufidhF7ST0HcFhXEzaQucAzcRAh9CL79D6Be4AhOW7BnSUOUH6UH6Y9P+ExfjohYfxSPBq+FGgXIJ2AZn/3g4BcbAPXALoeROuPg+Bbtw+lJBq6WVvm5Dh+L5l7aiWLYWyB4ihW2uEPum1bRq2iHQK+cB8tHQ6sZBrQ+BSj0R3+Q8gydT09ExpRhGlyhg54ooYLV3C14jXahEs2QtWiWLUxPUsErNwfDUU8hV7CVcnYqifLE5YwQt4hRUyKdJgzNiX1thvtiFswKF2vEokK/Bti0z0NN7BX3A59A5fCUcwtbAKXgt6yFOfz3CeoqgwNvgSl/UPXglPxdi8MzYi8fO/celoXkepP+vKeP1T9r3DlwJt4A9cA1dBc/ghYicEY1xc9e8cV2ut2u47U9Nm3c880bw8Gh1937r0H3AUTj22Q0PUd4QWrDQjXD3X0ffiBbBN4aWIYZQcgMcA7fChp3UIXQznhi0FB/+azth32hU5Q6WrJfYgl2kmgG9aiQFbzgFYBY/R6JSyf/pyxlUo3BDF4vAc8kwS1ChZUIJjFJUMM24DoukOphkKggtrzUpeCbiYL0LVRQ6DTqezUfzFC3MkvJgkpgN44s6TH/9OAVrKQV8GorVQyWhq5TNQE3OdBhyptF/HAuVKgIKCmCRmv/lh0HNMu16hvWj4hArZLwGPANbWm97EZE7cA+cvbfD3TcW7n5bpZN9nVl/20D+H74d3fxX4cnItegdMO2Nl9/55xsNzfqnpgtvvPOG96BJb/gOo7/rs5ooZDN60Jr37H873uP/fOoRtAIOgfvhQY3pRsa5DDwMV+/DcKGz79X/KLr7HIBd341wFHsdA3fBOXgjukfGokvfBfAKphYeuBCPBS/B42HL2HiLah8ftKymZ8DCkh5+s0jTJeo2YEpJD//pJQOGLEefiPV4bLA4bWoZrdEKuAetR/fQ3bAfGAsHvtMl+BDs/Q/AOigWnQgRu/pvpg+2C14Dn4Yr4aNr4GoqibnsXOv4zLNwHRiP7gH74e69Ej2DgpH1jx3I+XYJqjSL6J+FQ31zAArVUVDrJkFH61Ulo2CJyNnKYdDrBtPnmo1Cwkq9KhKfl6ZhwLPJaJsqp6AZIMI0SMfKpP78wGZNUkYxLNJvwPz8FRhdLIdxYhVaJxfB5/wryFPGwSCPYjlEoLHptIoTUSKfyzJPQJFmpOQnakSsZ+1Y+pyDCFNHoShvEvJkG7F6/Rw84j0Ljv7rYRvyFJyEtacVdBHbHIPWwYVt29M7Ft38oqXjA1xC6dMOIgoIOcT/n+Jz+9iOe+AVcYDPxsAzZD2c/USM6aXoRpjrEbgITw5eUv2I/5yybn5TSxrJfcCMEpe+00rc+88u7U3eixAdPYOj4eW3Fr0i4tiXtpBPW8g3Kkfvreg2mPmH74LT4J2wf/IY+9kLVBaHpFC8Hn5iumU7vKgsFq079vcRPC/v2XTi2UAhm8i8LbAllHHotweP+bxIJlIY/HbCPfQQXP3j4OW/llYl7i4Sc1KOQdS091KgOC8p/m4KqA/D5EYS+YlnBbn67b6DdknUzWcroaIIUbyHjKS/Rga1I6T0HLYUfsOG4J3Xt6FctgXlN2ahPGc46grDUKoNQoFmDNTqGdDp2EH1/qjQ+qEmn9ZMNgtK9SLkFI1Hsb4fynWR0Javx7IPEmCZ8B0hoRrNEm7SWlVT0ECLxU8RfOC8Fkav/lA45J9JF79jPrkwTRHHC9VIZx1apirRPukqrESwuCwDHjr7Mdb+IxUq3VqUqr1hoF9YkTcLhXr6nGr6hZpB9DupLLQURFrD0rxlUgyaytwxtNDzUZzD698vQYEiHruPjKcw+cEuYgmV1QuwG3AE7mHHJKF08ltClBB7R3sLEgNMVKrs/GITnqu/oG0UwG3381BQUMwdfBb3iBjXVJAN5NpAbv7bKVzkH4Wsm88heA7cCbtHjsDpiZ1ELfvg4HuUlnsL+9568jcaiVmfXm/olv/76fGIBRSIPWSKGHCgpvLbgu0H2KFpJYrzFxPuLEC+bBHycvfhk388i/0vrMXUpWMxZPoMdA+aBrfAVbRSm2EfEA2HkG2wCdkB27C9cAgWjBQBx2nFCIlETGtHfu8UuhddQnbTT9kBO5ID73ENnobHIidg9MKZWLx5JhIv7cP1y0+jWLWdvhhhYP40wsO5qBKRnYQ/RP+oSCU2t0dJR0iU5U9FiTiPXz2c10byvuEoVE6mFZvJZ/mMbCSt3TT8S7Edi95ORpcT76M5/TDjhKZPO/9zqZSQNhtOpz/F5veS8XVhNP2/qajNmYpKQmCdehjrPx1l0lEbgyikkSgVcYTU4jS90dL8Yp1sNGplYoJ/Iu+bRqs5kdZ0CtT5q6DIexaf/PsAnjmxEDOXj0PElFnk4ywK6BK4eNNSErI7kS/2YtFAMC1iQDyFSfByF/m4W/rswv5iG7SX/NsHW/89RCh70c13LR4JmI8nIsZj1NxJmL9lGpJf2ohvbh6ASrOJ/JqN0txx0MrIv7wF6BY0n/1uN7p5x8OGqMaD/cdnyKJeDd3yfz+Nnb9TGpCQLI+AB3TaJy6YCXXuBGlkr1iEMKNPVJo3j4ycA51+NLTakSjQRUGnEsfhjyJUm8gOMYG/BZybCg0hkxh+L1dMkUgsp6r/JPO1U6HVTYZWM57aeyx0tFCFWpEHfytnQKtYAJ1yBSrz5pMWoVLMiYkOpKr3h8pJFYpx9MfYseSjCclGoEg7k++eKR2eWscOqZTNwTdFR7DuH6fQO+kSWqQqYJJWH7/BOE0O85QK6VDWtqkfNNHx/2TKKIEZrWHzs2q0IbWlb2iRUi0dRuuW8i/s++IiFWEshWk+oWckhWwQalVsRyrKKkUYytQjCVEnsf0Jq/NHUzBHUTCpfMQxm+KERvVgFOiDoS0IQ0HBCPKAPFPNglY5EwVUZkUUUD0Vm44+sJbIQRytUkbLWs7nxXfxqSKfdFr+z/cIHhbq2RfIP8FLvTYKBewfRdoRtMhCYYqFB0P57ghSOPTsK5qbq+FB9CR2SHv67IQDUZZn0Aacyvr87yN4T599F04+2wgbCTMCY2DPhngsOARFuuVsuChUsMOXC61KbSuOuhRWppQdvJTMFgGQBSOK+b0+kAitkHISGUUhyxfHj1E47iNxMhWfpWUqVQ9FCYVbOo2R10tptUoVU+spfwY7z3gKJO+jn1MpmywJnlg9IsqhU86FUrsSb2lOIuaLS/DM+hgt06+hVboGrcRx1YlFMMksgYWI3yhF4K6CaWqpFE3AIrUQZuIweil6eBOd/08kcxHJTpzSnKVk+XIJSTW8Toiach0WCXoYnwVapJXA6Ewx66NHh7RsPHYqHXu+SsDn+uPI0WxGkWhP5QgqOXE0qWizKCm2l2hvwacyooQKKk1xwqaIlSWOeRNWs4DCW6geR4tKpUvEIIJ4C/7eS2KVThGFrFgItUAZtML1+bBfCN5KkfzGUvAp6KRyKspSvrdIE4WiwolQXKXfSYRlG7oJHj7baTl3wf3vdsCV64BpPZ1DDkiQz4GYvbsvsX3wTJTS0pTLp5BB4fw+gwIyFgUC0uWH8HooDHoBcwZTw9F/opCJBq6mhq0hzKvLH4I6+XAYCHkMsigS/RDZOGpn3iOn4JF5GmpLuX4KcgunQS0sJjWvShGFnJuRFHp2hJwZuKnYioy801jy2StwP5sIx33voKvwwTIN9JkMaJHyE8G2/26UWk6BFe1DpZJ6E+1SP4PXyW/wxPGXsfuLl/Fh/n4odfOISCKgkIWQpxPIzzn0lZejSr6CAjOFwlZvLcWIahGF0JA3gSQ+ycfcURIV0OIJGK8hfFSr55LmI1u7FvmqZYTFi1Atmw3kTqPypD+tGCIhHH3+XBhyhkl95oN/PUWXZrV0ZJLwI+36xcHTe9HfS/BiD13o6eQbKznJwvR39yeOD10Cbd5qwjwKm5ZOvmwqNedwXNPFEqb9G+YJFTBK+Q+a0WKIoEB2SddhffYybM58CZsX/wWHMx/D6cX34Xqa9OIHcDn1AZxP/gOOL3wIx5OfwvrM92h9VmhzHf0Zau+zBhgTThmdY+d5KQfGL19Gm6RswkEZrZPww8poBfj/xTx+L4dpAvh+kuhkTXXAvyudk5HE/KGigeRokaRA8yQtLJKEladfm5UD8/QcWKYoCLvFc+L8zBqSiIfHdiY/W56+AptTX8P+2L9gd+JD2NMndiUP3U+9C49T78Am6S10TX4bnZPeRee0j9Au6X10ePFjtD71FVokqmCaxPySa+Fx/G2oVDGooFWsUoVSSdM6aocgMXOvdFaZUxBdm8DNcBgYjx4BS/9egvddjqarpx+FLUDMC8VAfHcK24j863GS1pOOCRbH4FMbqjQLEZr6BhlUDSsRwzW1WBqha6oTGBPOGSWKo/hFuNB8WKTlsgPkwzKLHSNTA5MsNYwTNIRLZFKqEKAamGcU1Ye3Sa2kQCrRTHzP4PNpomOo0SxJHK4qYGMZzBNrYcJ3mycTVmaWM2/eI4Iq8n+rZB0VhI4+nR4WySq0SsqDJd9vmSpDS3ZEaaQyXYv2pwjtktSwSuS9AtJllqIVfT/LxAo0OyOH0csU9FQD2iR+B9OUcioHWtgUvo/5ipPpm6deYyflNTEK+jLLzI5tlqa6j4xYZ5PzapiyDiZSnWiR0srQ9qxSenezjC/R9gzL/ooa7ROVvJ9teLEQ7c/w+8VsQs4K3idOvtdQEdH/Yx5NvceE/0nRRM+xfOnZ0vuaiYn8TPLjvFhVI6fAkV9p9/PMlPwyFSGA2DYmAoqnsI0yc9Aqk+0jwiO8KspUig6nfiDYJa2sqRihFd8zyB9C+hnvpEjTI+WaSAm2FtDaCSFctmEFFX0c3MTmYX/6eH47MDBs+d9L8ETy8t4EJzaEOOfUfeBW2IVsxuXv9hGnC8EbSxLYfYIU1mDZ+xfYuNSgogNm6Ch4ZPS9TCC1TGQnXH4OD895Dg8tOIpmi0+g1YKTaLbyPDqIoCcplWiboID50uNoM+ckWs89g3bzTuKhReloGf05GS+Ontawo+gpkAV4aPc/0XxBElrOS0H72Yn8noZ2J/NhJZZqnRfhiNg52GnM0gvRMTEPbeJfQ4fp8XAYuRmOQ/bCedxzsN3xdn0MYQqoBQW2FQW5+fwU2M49jrbzT6DDvOdht+Nb6dhri20foP2cg/w/Ea0XPI22c06hzVzSvAS0nH0WHls/gPUJCsV5IVgl6HpSDcvVyWi1kPW8h1ouOM26v4DWC5+H1YITsHnhKqw2vYVOM3ei06xEtJ13DHYbv6diyKXQFKPlvn/AfupxtFjKZxclwnzz23iIHbvZsjT+PsLynGryPa0WHeVnAjo8fQPNjlxH84UvwnLVCfLgebSZ/yJMEsSkv4pK8Y7RXPGdZJZZhocS8mG+8iTakF/t5h1He5bLYuurbH8im4Qi8pT3XvqBqRUqE1MRSVaK/1yEFsk38eyVZGl0tUA3UvI1i+iW6OXj4BsRCYfgvRQ6MYq+A47+2xF/+M2/n+A90m85fbxdNP0biLW3oEtwHNIvbJEcaTGgIZxvIXzC+on1h1apcpglU9NfULDD3xMAWwgCyTQxB/32nUVlTSFKDWXQoBaltQXIU1HowlayoxbCehn/r6tCISCRtqwMagNgE74CbaedgjEtY/OEasKXy9h/5k3mU4cC3leAKmh5X/eo/Wi37S0pSJs5IWjntJvoPmc7CrV61NXWoaS0BOWGaj5XA1URnyotQ20F8Nj4regpLGdWFbzGLkVteQEKqytRWaFBm1EH4L7yDXSauA8oKYbcUI5CPl9UBZTWsZwkbQ3LwM/qEgP6jl2Djs98D9vz1Ri0gCgBlfdRDevIl8BQW4Uvs9WwCdkK11GHUVVbiarKalTwHR5Bceiy/Q2YD16N2hoDDDVFkMsK4OG3HK3C96H1iznoRjimr9Dyv7r73lGICtRVlaOyrA7Wg3Yi7PD3KK5jPqXVKCmSI/3VD9Ei7Ag6ipijEmqo51djuC3LcyVotTEVsqoqCG6pUMI861BcVYNWkTFUkrz/XBX5LQZ77uB3IwkrKkHXEil2W5uEL/Af9REgfxSU2jGokY9BoWYMtKr5eDx0FLr6HZAG9ETkenu6Ot0GLh7c0B3/Pqm7zxyI1QNuAVto9vfBw38jdh3aRIETI2CNJARwAr7UHyEc+o6dVksmkIH3xNluZKRpaj6GrTnFLlGO2qpauPT2QU0FO2FlKQYtOgSnpe9gecKrQE05Fq2OQ1l5EQzsKOUUrD4BS9BuwnFCLBEpUQ/rSc+ghB29uKIUfb1HsgOzQxkKoGd/dgnZjfZiCdeFAnSafRzF7LQ11QoYqguRkvYeHAdSmcw/B/vF6WjjH43HfGPg/PhymI6LxcNn38aT/KyjIIN5FvPdXoQ/XeI+QNvpFLyaGpbfgNq6ajzmsxadJtPKLsjEsqfOAfoi1NVoUV4N2IesRLenb8J7Zhx4O1VMDXS1kBRZ24gjaDPiGCzHHkDXwfvRavCzaD38GJ4YtJsdnLWtMlAhGeDSfxkCpu6gYBsokHXYtuMUXII2ot0oWrJUEYSCiip8Ocsk6l6DWubvMXA5bAcfRsdRx9B68DN4aNgetB98CiaTX8TAPZ+BcohqloYNhrSXP4BV5E4KBC1+RjH5RLhPSyamL0xSCvFwggzPvPQF260SN7VFyL2mRDXrXcOyhU+MQavllwiJywlDbwvtXZRZSHQiYHQVYa+cPuA/oFStprUbJY2MV8pnSKOdhYoYuPhOpaXbAGf/XbAJ3QAvKvvlsWf+foK3dONz0koS18ANsPWnj+cfA+/BodIypnLVJJKYRxtDipKidrm+SFhAwTNLofUSI2l3MKBR8EzoMw1dfZqML5UEpWfYfOjZSQ115dBRKz/mOw0VdTUwlPE//6WooBXhn+yMQM/AtWg/6RT9Ki3snvsc/7mqBvjc1/JK9A7fgGtakVEJ863DobS34TybMDGxFO0zZDjwxucoUxSyA+nZgeWUJ76/upyCrUdlaQX+8x2t2uLjMDtNfyuzRhK8WorXTwleaXUZ68JuXKGjItFDz54/ZflBOPpuhkXYflgf16D/4lj2dEpeHWtRW4JKSmV5FZ8proKhqA4hFFDnvR+jLevVdvxzbBmaX1aljHl+ez0fJTW055QWNgkmLn8a1muz2JZyQrhCPHSqEs6By5h9LZ8iVepRTiEsodqokEpWhbyKOvRYm8Z2y6dy1KGUbXqX4A3eQcETkLxQ8qVNha9KmNw5SQ6buc8QGVBlVNai79A1cAydx3bjowZawLJaOEaug9Nz2bC4KGIZ3iFwDbsyjOjLm2Xk0CoCLWn5+p2/hEpFFCqVI0hiTayYbhgHjeIwukeIBe1b4BQQD1sK3iP+m/H25+q/n+D19ZkwRCz/Ems17QK3SsvEegdGoiBvAkrE2kE2WrFmOKGnWFM4DJMuvEasryPzhH93h79Aui14CoStf4GQT0s4WU3BW4JewzahmvCqtrqCEJRMrinG/PUH4eqzCpVksIBipYZi9AxejjZTaCmS1PBflkChKaeQViIp+V088+J7OJX2BhV/GeW0GBpCI6+IZWh39Cs0u1iA9knFsD1KH2f0U4ii33Pw5Hu4oqHQEWOW8n2VtWpaqlr0Hrcb3k99jz7jo1nGctQx/zJ2YveAzRQ8+lQzdlN4qnnNgGoKYOfQuXAYvBVegavx5j+vIp/PVDPPm5TWfptTYUWrETxvN/Opkywe+yp6+c1Bt8Dl8O07Az2CFsHLZxvaDz2Frgk5eGjuQbYBezYFurKciqUUOHz0FKExES7LWE2hWbD8MH3Jf8L0vBiZ1NOazadyKIaBAi3jo+4BM+kfLYJb8GJ4+i/HI4HRaBfEznzqBmzOXIWSedWwXqJd0156H80id6C5mJC/QMEjUmlJH9soUQOnZ76Ejpqvkm2pUZXiuRffx6GUt6BWiHD3RANUep9dVqPDsH30qRXS4Is0qJVF3tMPN0supvUkz9Py6R/r0Ixtsey9EyihsharZkrE3KtKzBmOxuVv98OVrowLFb1tcAyh9BY403I3dMW/V5ozZ/sg18BN1PZ74BxCTeS/H70CRtNXWoryfDGpPUKa/BTbZ8Qgy8kv0qg1i2F5Z2j7ewSv5VkNwtYlgE4HKmgFuvuvRp8lqRQC8rGSvhd1cVFFLZyDt8MzdCdKqG0F4qOdgHvQOrSaeAK2m1JAFwgVVQqUsEdW0rcpMNAy8T4aMZSWsbdW6PGtsgqdB8Vi8953UKXVQFdd7wOOWHcAnabthsO0g5iw5hgKKw0oq9TSgtXBK3QFWobuQvAYwkMaPHpghFUUlgHb0Xnbv9Bm2tOSNaomxEV5LZ6InIxOUbvQbtxT2JnxD5RWFaO6VI5y5tl3+Ep0Hvoi+gmLRzNRxwwL+H630AXoPHgdIeJatBu8HK4UPpsx2+GVnI2Ws49SIQlDWw0dhayXN5XH4APoQzhZXVXHvk4gWlmD4JUH0Sn+U1qnMlgHrxONQXRq4Ecl+gROpW++AJ0GLcbDEavhNGwFOkfFo/3RqxS+y5JFrKoqQVl1MU5kvEK+LkbXQTGwiFhCS7MZJqF0LV7MxcjoE1Rscgp8OTREI4VsB8lainbmZ21ZIfOibzx4Fdrv+IhwshBW9O3F9IQYsZUGVEQMNpbRLEtOoS7BJdkpIiS6KBJSEiSW+43Hl98dh0PALngEbkOXsC1s7x3wDPmbTSU0prSXPh3kErgKTv23SCObzn5PoXfAJMjU21GpJdRUDEexcqbUcJX5M/GZbhssXiyHRYbwPZqeS3soQQPfLQkUqApUsaN3EwtnY9+Ew5w4lLBjlVKQ1sUcQ4fQA/CcdQI6diYD/Z0aws2etDpdhx3A0cT32DkNhHUGeA1YQo17FF5Hb8L++DV0nRaPIkqKgfkI33D50mNwnZmM5mP2o/xaGWq1OsKyKoEWeY8wXnXQ0lJcevcmbLrNRQvfOHgf/Abuk6P5n4EavxbF7HAeg+PROeYdtJq2V7KMtC/Mx0BLRh+T39mN2QmLQAQJmc4An3H70JU+sfvWj/HkjB2oEFaGdRDQVfhjwloU0zrnUrTL6qrwaa4KrULXo9eEp6AuoIBRs5Qyf4/ANege+x5hnwpPrqBQVpVKA04GwseweXvhduBzdAhaCg2Fo6yMEJ11FkqhjAqLoBMKYWUNYoDIgM7s0IPi/40aFTNgnepYnhoKeK1oY96jLtPSYqvxqP98dAtYQwHnbUUGvPr6f+hu0OXY9SWcjmfjCSKH1C/yiRLKoKGTrdJr0Wvk83A8eYNWjkKXSuuWrodZkhhQyYdpciUs0/PRNjEX32jpw4rlZpLQjZL6Tln+DBxL3omuQWKlyhrY8LNXfyrGgDn/W4I3ejRMu/vGwiFknbT63D1wBU38HohtIxIFr6AWXgU3+nSOwRtJm+o/QwTGX4qrV+NRzYYrVYaiXLZAOsJApY/A5yUn0fXsF2z4Gmk+zSiLVq6Rzgntx09qw5aEm+aLE2A27gCMxj2NdlvfhQkZ1TkhDyZDj8Ji2AswXvIymicXoutpDYxGnYLl0OdgPPRpWE7NQscXLsNo7HO0BM/BaNIJPPS8CpaZfN/5alikl8H+tApWEw7goWHxaDNoO58/iFYvXEWrlxVo8dynaDn1BXQN2Q1Hn52wC92NthG78fD0RNjs+QKtU5Qwe6UUNi9QeUTsR5dBe9Fx0D60iDyArts/QouEXNjs/AitQrbDbPh+dB6yT6JOkXslEorBePwLaLvibVhn0O+hT2uXUIB2Uc+gVdhudI2gpaLv15Z5t4jcg1akNoP2o/ngp2A07DDcD3+D1rv+AaPhu9GMZESF0XH7WzDK1MMqVQvrk/SXRh1GixEH0XnEszAidHZ66j/otPYlNB9yCHZikXIjBe+TyGL4LhiP2ss2exoez1+B9fPfN3mfQ9A+Kth9sOf3TrQ+/eZk0GIfhtmI4zCee0GaajE6V0ceiuVpOrTc8g7/O4zmo47AbMxxGK3III/lvKcQJsLdYJlNs3JgKaDmBSq2pDfxtV4swJgmrfcVS/zKFZHS+s8x8xfCpv9qWru1fP960mbYhy2u73Psp44h6+spWMRf3EIBpVIT24f8t8AjePZfQ0DzC6sf86RQ2YSI7T1PS/uz7AP2w2mwOOCHAhawHbaB1EDhq+vnVAI2UUBZYf8NcGOFv/r2aZTohkKXP4taazgbkHBBFQVl0XQMvHQW5mnV9MMoRMk195G0EoX/S6tL0mpgmlQHq7MUmjQhoPUOuUlqiTQxLRx8o/PUmunFsBBzfJmCCtH8LKFrOu+/KHwSWtK0ImlAx0LEBk4tlhhulGZgXkL4K9gRRF4kadJdTKZTIMR3sfIlVUx0i//5/SKvZVbAPLUCLZKq+VkplcMsoRzNzgoLXgHjRLGhlc+/xHeJ76lVt0lESyUZU4lYJRWgeQI7YJqeMFtA74Z6s/5SG0ifvDe5Cmb/195XgFd1Zd/HE5y2eNwJJEChLQVCXHEN7oHgUtwluEuBQh2JQtC6zkyFOtSREnsvL0/y8uJGWP+1b0IFMv+h02mnnV/O9+3v2X33nnvuXmevfWTvxEpYJrJ9kqQ9bin78pRR4bP8nXWwSOT1RJFTeH2ex4L1tmKbyO+SlbWmPXnMxWLW91aNJP8k5inVlFsEA6/D61knyX3VHvczseK1RX76X81/zKXtJW09n425MmiSx+OL+F6+ox/HNrJJquCrrDS6DduE27Dh/ZidKkcrdqZmF9NheQwIfPsS/boZBJ6E0BiorLstVcdAr54Nv4CJ8ApdwE6fYApcx05/FTyDNtDXW0NwLVcWT7cPWgWvwDVwDtoE+6C1BOFqZeDPhzpaq9p/9gLzTnToXcM2wDNwD3zCZ9LCLUNm9kFo1TT9kr1VNQMm3XAUq6eygWQt5njKZH6ejnxZEH2VzrF+qBJVq1QXjoz8ybh9IwI5mrn4yrQQquxZ+CZn8z3yrToe36ni8XXWNnyp3onPtFvwiX4Dvs3ehfT0XXzdiU+1WymbcS1rJ67k7MRX6u34mvKpdhu+4jne1+/E5Zx9uJq5B5/lbsc36m34OmeL8tu3qm24mrUDlzU7+X4nbvD9jcwt+C57I65m7MIXWQfwdtZBvJN9BJfSD+H9jCfxbvYhfMj3n6YfxMf8fCnzSfxDdViRd9QH8LpmN17R7cQHN4/yv0/js/Td+PLGNvwt8xD+rq6Rv6kO/ijvZh7Ga+rDeCv7MD658Qw+/uFZvKs6gHdqRd7/PfsAPsg4gA8za96/q9rHa9XI3/j5/cyD/J314zX+kcU6pR/FpZvP4lLG0/gwi9/zmE9vPoWPWaeP0o/g4/R9uJK9l/e8VZFval9FvsitFbaryOeUO7/VJd9RvhfJ3sq23MK2lOexHT+w/dLT9+AK63hFs43X2MFnI89rJ94z7sDnuRv5fTw+1cXjCt9nZG5Cxs0DyMieDXXWZpQUPkH9oVuinlJr8cahUBUFbc4YVKhmIi9bErEvQ2XWZFLQwchXz4FJMw2m3Cl8nQ5T9hJkfLuO7s50Wrs9NBCyQXoJ6fjyvwbwbubcdu7IHkOStorZ9gmQkAmzCazppI/TcStngLJNQ1aR1zjC9yG183l/PZEV+1L/+5G6/n9/Iqvw75XRFPntZ1LHf2vkP1uf/6rw3u9HSpXFGXw+4tboh6BQE4vs75bSHVoGl6j18A3YBGcys06hsX8N4K1dCwsfmmwncZj/asCTUbC75X6Pq1PujK7dj9T1//sUZb6qLpHf7pK6/n+/9flNbVGHKHWq45y/RerSnzrkXwHPL3CzAjy/kCm/D/AA2HlHLYVL6E74BG6Eu8TJCFsFJXFxsGyvXw83MblBG++VwE0U2Wr/k3gHSiQqCRdH4AUcVJboeERNIvCmsdedVgM83XhUyFadOhrkN4liYe56ELKfi7y/SAljMABl6nGoyiL/l/1j2mGoVI9gJzACeXlDFGpbYJDNr8OVjbB59DVll3mZLhJVqkl8UINQwAcle/zkd8mXr+zp0w1CESlyCSlNGalxSdYiFOSFQ0ImyH6zUvqqMqkrYJDtL2Wa4bx/2T82nJ95LtavUiX1oQKIfyK7uiVEn0Qj0w7i63AqCim4PhoVmkF8Lynea9ayykZfiRpWpBuKfP0oFGim8H74mfcmi4RlkEHZFMqOTrnvXNlQ3I+vvPecYbxmPxToZO5rBKqzxynrHAsM/ZQwFiU8pko9HLfoK8k1pN5lumjeD+vIa8sm4GINXQS+l72T0p6yYVh8c6WN1BPYRrIZWepKZc8Zp7S31EX21RmNUby//vyOFpogLNWH4tYPS/n/u57r7yClfF6yJlisezHdHgV43y+CW8hq0kv6eZGb0Kn3OthHbKavR58wdE3t6wq6Tkup18THXSIRFdyDdlL/a2LQSLBiGaRxJZ5cImmEQjZhUtyun4D8xKYj7TuGL4dbsAQ23UgncxfcQjfAKXIpHKMXwjV6BUG15V7pvYuy9xci/Ng5VGL2b4JLuETgqtli/0cDr1jm/yilpFglvJaMkBar2QEQCAVUkGLNMJRnT0A+/2MyxOCWZiLPMQKFWbHQ64dBbwqmEvWlQgxCcX4ASgxjUE6/81b2JCr0SBQbR8IkE/x6+hDqaTW+AxWtKG88vx/G61KhqLjKJs6c0QSw7B8cjYpsKiH93CIDAcjXCn5XYGCnwHrJht4iKqcAvyiX32X1QRk7hHxjBIx5fQi8ONZ/AEE8kIAgmKncBfxPec48VBC0tzT0i7NmwaCT/W3DUcL6FREsldo57HyGojwvlCAbjDzpcHT9UZHbH0blP9I5TWFHMUaJH3NLHasARCajZa1jPq9VxQ6iIC8SeYYope4l7MAqc/qyLjHKbxW8TomAWi8dxWT+h//TDlX23xVKRDNNHOvIOminwqRiR5Ujka4n8N5H8z9D2C5TlQ4o3xh973P9HaRu4C2EW5j4dRsIvM3oEhhP4NG4BElY/VXKQIsPDY5P0DbKlnvEOfQQXawdxBDxEyJBnQSoq5RQFl5Bu9AleN691nPns2+jdfBWonOtEqdEgsl4sRJLNu7D1k0zsH7b9Htl62zKvF/Ium1L0TVsBtz9dyjLczzClxJ4S/9w4MmSMwFefvYozFkYRsq7jxZ8OX7IPUCw9EaBngqvXYlOwU/Qyqegz0haOPVUaG5shm/IJLQJfgoPB41GunqhsrWkgsr9ySfsbELGUvbBoddWuARvgXfQEnTxn4iP392M7KtUtKzRuEkwSSwQj9C96B4agXzNElTRAhroyJ88PRS+EewZA7fiy8ubccvUV9nUWcpeXyyqKXswMq9OweUv5uOR8Cl82HwW4RvhGrUCbr0PoGP0YqzcOoOAmamENSih4huKtmHgmHFwDd4Al/7z0SGSihFO/yT4AKIHz4CucDUqS3m/6rXoFhzCTnErfML6Iyd7Japzo9j5xODqd2Q3wduVzjfpzIqaToHPqNi4HQMm9INr3w1wZo/tQMXzDN8Gv6BYLFg1CxXGpbyHSdClh0GTNROXPtmODsEL0D5sNRVxC5x4n76h2+Hbaxze/3wtO7P5KNPz2nmr4R+yEC69DsE3chhMtJzlvHeNsY7n+jvIPwUeLVr7kK1wjNqKzkHU3RFrsWfPPux7chP2HlyFfSJPrse+QyvukacOb8DW/UsQOmwOgbYPTrSWLrR6XjKt1nsuXrt8o1Ut3H5ZAgetVayUBJ5RogmTavoFRaPQGMfKSo/GSssEpSI1lb6j6HckL3cGOku2mrD1cKLCSMCh9uEz/hjg1SFiRWbPnQqHvgvQIWAzcnPWozxzOaozhHYtJZ3YoKyc6TuSx9NiqTSb0TFkLpWMyhUxHbrMTdBnjsXYcX3hHLgEbgFLsfvIaGhy+rEXX4bj+7bD4VFa9pD9mLF8EDQS5Eg/FV0D58CRVr9j4DRo9VNQkjkF+oIwHEuiUpIByDTKp1/uRDktWCkfeplmiEIPTVdpjYuPEhyr4dV9JVbvWAmNOg5ltLBZP2zBI71HYvhkX1z/agPyMp7AZ5/sY/1XwcH/MDpF9IE2bw07EAmO+wwei1iAVsESYiMO6fodyFJtROeAGcp0ziO9J7GeMudF66Oag68uH+Q1CRS6BqdS56DMMAE3ftjJ5z8fzsFr4NGbVrRgE8pN3fFD1i44+a9nj74eDwf2g14Tz/sYi/HjI+HYfRPcH4vHqq2Tkf7DIOhMA7Bq20q4Pb5JmcNdvYVgzRxMVrGO4IxjB78cXQOms75iuWUASCbA732O/2mpC3hZV2XOeR3bk1YtOF5xv2Ln0Xqzw6yQUXfSYzlOqPfdei9SVTAZOvUL6BSwHO34X3G5vMj+Og/YinUHzk+qhVndxSeYvVDIHmUoVayeI5UqZnw0adZEFLJXlpDgMq9W4xzfe0N52ul/LuCRas5cGMPOZA973s0I7TMH3QJGokfQBHQdNIpKtZ8NtBe9J9JHqQWeb+g8Nvp2dAybBoN+OXK0q6hgy9kpxaPv6AnA9ZkKVSvMl1B4k+ifLUN+0Wiovie9VPnDqJ0Nv97xaBMRj4d6zYJ3cB94Pz4IfsFDCH5apbB4XncWvri8mxRN/DGhxgSdlpT05hgYtPQZIqbBKZrH9tsIv/CVeLTXPIJ5OpJPbYeuYBot5FjSyMV4NLg/3MlUPANW4tzbO0jVwpDP+9ZkP0qALERm+Ty29wYq9QAUG4ajU8hQ0qd18HxsCwJCxqBb71AEhTyBoEGymGElvAPW45nzExT/bVTcGLSN2AbXXmtw4/p2aGmdC6h4BaSDh56Pg5f/drQJ34yDT0+DSrsUnaNXUncI6vA4qAviFCpapWVnUDQXvmGzYE/61TFwLjuzldAaRLkn/DWAp53I50R/mTS9UDOJwBv6C8AJs5JXrWop6elUOEeQDbGT8QhdR5ayGqu2JObXwuv/WywlaKxrpDiFu6k0a0nFVuPvVyTMeAwVbTry84OBdPE3xKH+5Q39KuD9rPI/yl3n+60iw+oz55OGRc8l396LUbFDMWPUXIyOnYmRk6hsAUfhTlo2IEaAN5nA26YAzzlkO53hWDbmGhjzl0HyIrSNXIExI+eh1NAX337FtiHNbNF/JdrRgfaIWoIeoaPpiw0lcOaia+/FVOTd8PBfgzGThmPKiDhMiB2FiH67aTUl8OpyAm8v6SItHOt4S0UqKBGzMsYTvHP5MOOgV6/BghkT0LMXARG4GQ58Dn6PbIF96Er0GRVH6zqR9QqAayApc/gqvPbBGvpT42g9g2DQTGW9+xLUY1FuGITKggj6jQvxcGQ47MP2wvPRDZgwdhymjVmGmBGxGD5pO+wDzxA4m/H86XkozhtJCxbFaz4Jr8i9KM15jvUawfPOhE4/Cs++MA3OErS21y4c2BsLTeE8uHXfQAv5FIL7DIfa+AR9uhGk9WHI0S9GlzAqIn0ml6BV9BW3oySPx0fEwT54H9tuCPS6qSjRRSOjaAgKDWFkB8EE+SS2w1jk5/Wv89net9ShZzJYdf/Am0Tgjedxg+jfT6QOyyjoGHZA7Hzp81cZxtPSLUOfvoPgELwerdgZte99mC6LZIBafP+johMX7DnsFbaCvdE20hSJBCbTAmuolGvoBA9HVfZkPkRavzpu8s8HvBEE3ih2Hhvh3Wsz0lWL2bMORtmNudBeP0jFXUyHegfCR/N4Ovc1VHMOrdIW+IbHIj8zHrma6egeGQqP6L1wj1yIt94+gnzxr3RBSNc+jw4hK+EVvgK9gibBqB8HXS4VLXAR3NiBPRoWgiJS9arMCQRALM4dX4sO9PE6RK7DF188CQkZWMyHKeEGJZqa8btZWDp3AB/adPSOiqIfdgBF6jACYSA0+p3wjqSzHnoU3QMkIeUIvPE2/eiA55XYkyEjxvKYOJj0kdAZZyB4YDha99wN3wGrkZ7zFBVlJLqF94cjfdRuAbRc2nW8Z4KcbfLJpafQPmgTO5PVOJ66CGW6GHz3zT7e20K07LEf3hHhKCqi9aSy5aoWolfgJIJyFzqFToM6ZwNMqnkIH9YTbfz30No/iZffXk/QR8FEMJ08S/+QlNeXv0WMDYWW1l1/Yw98osfQIuzlOYaxjVeiRHxyw0DqEDsN/XBU5objVpaEbfyNelGHnv1W4JUroR+Hooq+f2GBP1ZvmKRYe/eQw3APWoTOZApuYf9GMKV+kzfBKWgtK7JRGR71CV6C7oMWo8QwlpWcwAYdgXLhunfd5J8OeLmjMW/WHDbmGvLtlVDpVrLjmMb6TODD3QBfUmt3WsKIcVFUwvFQ5W4iLZpN4NE/C5+E/Oy1KDLRj0mfj0WLQuDuPx2OQUfg3GMrAfoUfAfOJSjXw7fPVASEDqGPOww63RL2/IvgxM6rW3AEfQRJFtJX8fFeOD0a3pLwJGw+vriynQ9QAuKO5u8SsnAUdNlhyMiah4iRgfAMn4COQfFw68a60C/zjNyA9vTRekQ+Cg1pZqkSbn0cvr+2Dr0j5sEvOh6esrOaxzoGS1jzDfCPHoTMjH2oED9TMwWPhkSiXcRqdA7vizzdDGUksVA9ndb3WSUKswc7kRfS5sGULdMdo3nfaxAaGciOYic607p38KeVI+Vu/dgaBEeOhu7aUuqEjNQOQH7WFBxPmAF7/8k8zzo49ZRBJFmnK0uxYnDm1DwCej7dlkgYVavgEz4G3mQWXv5byK6WkgUcgDfpq/tjB+kK9CPgRrGjn448Y986n+19Sx169luBJ9NColuV+cPw3bfJcAyki8b2luk0N5khCNqOl9/M6FALp19XukYsQduAVXDpRYc5mvSzxybMWDiQF5e5L7kBmXv65U0ac6ejPSmFJ4HnTbNrT2V5NCgWxpxFqKR51uazMXNGIF8/Erdz+t8j1aqR98jd1xDJyp9A32spwcPf2VNWZtfMzRUS4CIF6qn0gUiHNZIsZBxyNIPwQ3YEe/2hKMtjb5o/EgbVMKgyh1CJB0JnkvsaigL6GDlZw+nbDUduXh9Solj6XjHIZ6Pn875NOexEJBanfgLy6Z+ZMmNQRd9Qb5yG/MJRuFU5AEUFfaFi+6h4bTX/Y+D18mSqQj0bJdkroTf0Jx0djiK9dGKDaQkH/Fjvn0s5OyfdjSkwqheSdk2HMT2aYJjOOk0itenPzo8KwA6wMFciacVAR9qaaxiNLMMYpOtj6XeN5jEy5zac9Z4FE8Gqy5kCtZZ02NQfVcVD6av2QwnvtVg7hVZ3GnLpu+qLQ2Hisy2QqRc5v+Tpy5xMv2wwNLx2BgFs0JEGaqmIddS7SBvLuoxGei7blh11TtZ4PgOKzN1p2QGpaC30s5F9fQq0uhrJ1fL8fNWx3hr9YNLTELo1YShk/WSOzyDnlIC2ErhYGIJ2wi+AdEeKdUNZrzsidR9bp55V5ciUzIgaHVMPQ5mK7fLdAgJvzc+AtwuxcyXoLulkznjqXQ3wZE5W7kXSnmk0y9ElZDw7FxoYumVuss0tdANmrD16uRZG/17xDFmuJJjwoH/hGLINHYJX42/v7uUNjlHoyN2AMObGkbKsYa+4jsCTeZDNeDRwBgqzFuBWukT+najETJRR0lJy+LulnH6WJGcspVWq0sUpDvfd1xApovU05kqQ2TkEcRwBNQIFhnEUmRv6SUxUQmMBFd04Cfo89p4EvrGwD/RF/K5gKD+LX8bj8iZCXziIVokgMUpqY/Z0hqm8zzgKrbUulmCbQpkMQyGttnEs72UmAUcQFPVVIiQX5JF+85qFVDYBeCH9pGIt/6+dRQUitaP/V2CK5n/HKdcwmEYp19MVDb6n3iJ601j+PpIygsfznFS8mjpQ6UWoqFI35XfTSPp0o3gfctx4+t+sr3Lt6QQ4QcW6GQtolQr68N7GUmq+K8gfqLRFnmm4Ui+jzEPmsWPRTafw/pXr1YiE1jcZJvLYYcgrIIjyJZjQvfXOKyRdZLvmGeJgJL0uyBvGOojFkHaUNq2RIgGRtNVdUshjpQ1NMleaz3rxeuUEclWOPEN2KvyugCziR7Cxw62Zsx2Lkh+m0jpNZwfANlDmOCUg7r16VhMAOVZZ21kq6zrVccj6fjmBtx7t+2+if7+G1HE3YufMwB3gFZNe3gFeETtnHa1gv5Gky/RrnQk2t7CdcOxBNhE27bdn1+0Yugpteq9C+1770SZqKZyC92PW3IEoIAWo2TnwS0AYc6cpfoI36YVbaDxcg7fBJ3QeuvQYjt69h+PhkHHo1XsiHgucDJ+IyegYMZHUbjL8REg9OoeNoCM+hp9H0s/pj9mrJpISsOdlAxbLxLTS80gY8PHILl6ITi+8DvPTOthI5DEJfpMmUad+LrKHS1bflyor8M1SZdW7sSYUoLyX32QHQWo5zGWT5SmJgCW/yc4CHi+r/9NkxzvPXbuKXokHmSYr/DU1cka+l1X2d46RusjuBP5fiQ9z53+y20HOLd/L8fKdxBO5u861cu4mXyUUfCHvUXY+UCQMn2yJ4f+sUvN5H4WwPqXmMbk8p6TsKoVNguzUkF0I8h/WXc4l9yXXljaSe1bC7fHzj20hIr/VtIXSbpK1SKmjHCfC338MMCSxU7Jqzn23nJaoYGw32W0g15T/Km0o/5P7vnPv8l1dIm3GNjrNZ5DG49K0vL8CWJ1S8f50aPXcVbyj36uMM8i0luRrUPRCQ3aRsx+PBwexs5+ILsFT0TVsGHVsvJKroVPwLHSm7+wXGge/iJHoFDGc+jaatHsEP8fwmDHwCdtDI7NLYWxuQXswaS6BlzsJlbI5WyvpBSaSucWgiJ1oRvomdCU1d4h4gjq/Gc4h8XAOXIa4dSem1sLn3ysB/ecYHAOIZPoMTkGknFGb0TVykhLzvlwt6abupZr5uTPgFSg50mqsna//LrTptwjO4auVLUFe5Pw+5MHe5NKd/TeiQ+/dyr491/AVcIqiLxa6XplwdJalamEbeWPjSPPi2NMQ5JIwQ1lhMpS9M6lrTjjWXzkPyxQJC8AHdUYeujzQ/0UhECTswcUcKDE6zxTDIqUYDRKMsDtJoEmYuwtXKTeU9lCAVOd5/ppimyydXAnMzxnxaOKrpJoyr1az3lLirMgSOFn9k5CylRRxC1nXSmV8QXx1JUFO6Cbq00plysQpYhXaRcbTkKyFfZ+5cOgbB8c+M+EYLWmzV1Mfd8Mlcg39tb0YvyCOOi1WdCI7fgKPrsgt0tTSrMH8PhJ/+3QDfMnu7APp0wZIIs8dBPD6f39957I1L5z3CFpLR3wzPEkv2/LknXuvgKlwl3LxIvUgmupx9wDPyEr6Rq0jR15K4G2AH4HVus8StApdhvb9VhJwy+ARsANugc/BL+Akb/J5OEYuh2vUTHj03g4X/t4p9Ek49F4Mp/C18KS/mHxhIc37eFSpRpBqCK2YhILC4YBqLK4ZN6Ldyc8VpbT8J/E2/7Ki7EmT9zpYp0rQ22zFcrgmfY8GkdNg1rgNzKxsYe7ggjYrnoTdRVq9cyY0SMom+O4NkfFXFgm+ZH1a2kCHC7qn6NMPV5KllKljaemGI5/WyKBahM5Bw9Aq/AC8QxbDuSeBF7EOHiFbCQgZpadFepwg7DkDToHzlcEQ57CFaBkeh2aDFqDJEFLN0LVwD9xFcC6n7m3F2PkSFHcEStV0G2QejxT3Vs4gxf+uyd8xASuXT4OHzLmGiUGJJ8i3wzNq1a8H3/Us3eGO/gvh2nMbLdBGAm89PB7fgXMvbyTgiHb6YYV6Wh/h2D8DnbLQVTcKKs0hdIyaDvcA+nmBa+ATSavXYw3sHx+N69cPoCSLnL10KjSq7TT/i9nTLIB70EFliZpX0Az49oil+T5MurqYwNzGHmUiioxzcSuDvph+EGnFJNzODEOGcZqyqDfuowswP6ODpVClOh7an0buRMeitTI7S1Cdo+U6T4BIgNpzKiUqsoUE7ZUgrq9VkxpnwDnpS1j2nQEz23awsHhQHuY9Ym5B4aulmRWPa1ojzfzQccWzsDv1NcGag8YXbqH5CQlFz/NLiL0LtJzsrMwV+kprQlppThppk2xEIyr3PXX/L4viTqQUwjvpAlT6RfS5JKCRpEnrg7JM+rH0uz74QvLjiWVbQxfnINxC5uLz9OJCScsl/pqPzCOGb8OAaTEozJ6D/BuRyLkxET7+XfDAw7Opr7KwWfR9A63XSsxfOUvJCfhzHb8jYmX19IUloU0+/c+gGJmWiqe+E3Qh60lV16BTyEJ5PvdfOoZthnfkFmVPnXvYNrj1WomRY0ORR2sjgx9FhmhanSmsAHuduyoke8Fu5fSjaR6CJTtpuqOP0FFlRXjTzrSA9r03IGTQGDZeLPLzl8Kvxyo2kmw6XEiQ7cXD0fPRIXBmY2deuwPpgiSW9CH1TLu4G6bcAUq8RBlNzaWDXZktWUsH42b2EjQ6SX9IYl3W8dD+FKL4OzXSMDkfNkmlsEiqpDJVwyZRQrHnw3XP39EscBTMGjWDmbU5rBVgmVPsCCpLNP4Z2O6WGuCZwYpiQWls9gBfG9Eq8neKhYUFbBs8BPf5G9H8xW9gcbYcVgn5aHU8B5ZJt2EhGWjFDxMfUkJp1HUP/w1he1nQh250lr7sBR1SM08A6gEwKsP5Y1CkGYsK3XBodRPoz42kDm2BO9mZK3XJN3q2tI2Zd8gKOIbJ7vMaAA6ZOoRA7YNrV4+iS6iEHllBwMXDJ2Av3INpEYOnEZCH2KmPh8EYcY+OKyIDOvooUk4ZxOqB7GuS2nkGWvfaiXayPjmAbhXrMnnJXqUO/7LIomG3kOVwjyQgQnfSV9sF/35TaHGmoTBTJg77oSBnJkoMQbQ8E+qoVAyMMgmqm4yK7GHIUtHqRc3jOTfBr+dBeEfsgOfAcejWYydefjsN3jT1TiH7aOKlt9lER3eWUlG3kCXwDVxP8G+lJVyLbqFjoTVMRDV7NzH5t0k1Mk1jlKT9et0ybPj4MB8Ulaeuh/cnE9tEDVod/Bh24VNh0bApmhNkVuaWsLNoCjvL5rCyFMtFwFhYsi2sCCALNCSYmlPYNPeIAE6AZ8bjzMyt+Uqx5n8tbAjeZrA1a8JjbHkeS+U4C/nNir9Z8dq2beA4KR4OL0oGWVL1lyRatwz41F33P1xqgWdGH/6xtERotcuQL3s79X2VudiSvAC6PCPx9ut74EmXRRiSAM8taBdWPf36M2wfs069trMD30ZdXg770K3oP3k+Jo+fTTo4nZ/ZwfsLNV0B+/BdGDV9PIozFsCki4KxKJSd+5I6dJyiG4jy7KkooN+Xl7MIZfrBuHblJK0d/T2eq1PPfTQ0dK1IXYdOil8n9finZeQk8ttgSVlLJ7H3c2gXRZrYbwk0BVtRk0LpX4vkOlPeS1qlHMmxPQUFeQsxe/1EPBxzGM595sGr9z60D53LXmk9HGVCltbNg5RWpGMoaRXLxt1J/d3CJfOn3Mh6dIzYjoPPPoHi/ChU0rEuI8cuzouGJIesyhyIK8Z4eJ58i722jMrpKaSeYmFkBLKuB/qbROgaX2XUT3klxRWlTS1Dk+O30PAk63BOD8sLRjzwXDba73kHNiExsGzVFrZ2DfEglf8hC3MFTGYEQw1YfgmmP0rMzc3RgK9SFxtaRTObJjB/0AkPjV4Nt2PXYHOBlJdK30hGgM/QIp7RwpzU1PqUBo2SSFnrbJ//vDRKuok38vajmq6OwSB7HPuTdcWS6kUjVz8ffkFD4RVKa8dO2pnGomPoArk/pbizQ78jnvTD3GRRSOAG6vkKduwb4Rj5DDr1jcN3WRdgoP4aMgegkj5dee4glJCS3q3jPxdZX3vnfU7+EExZP5hWVbLYSnKUeLpQu4mphdj3wmvDaqvzy7LnhTeN0lN4yWa+3kfRjhVxp7l87Y2nkKMejDz94vuUhbR2S3gDq9lAfK9n75G7DJXlE6HSnoZrwBo49Set7HH8R7D9XPzCfgq71qV7LFzYQ8mGQlk76Ru8ADezVsGUKUkO+/PcY2gBaY1zBkNvHIuPf9gDK4KhUdI1gkECCtFXOSdZf+p+mP+umMuQtwK4AlieNqL5KUmoUoSGiSq0PvgGzB8Nh12zh9CUNPEBKnQjSyq5FcXcFo3MmvO75lT0prRC1go1tKHwdv9QEcDdebVjPW1pWW3NGtJCNmWd6EtatGG9zNGEx1iL9W36EFoMnALP576BmWRJSqPPePx6ne3ze8j8V0/CQCWXvZXlqliyrtG4bZSFGcOw7/Bm6tVq6sp2ONOl6RS5AzMWHxrO+1OKTG7fLbI1SkY7PQiO4FFxyMx6DreptxWZm1CZtQ4V6sW0aOsIvim1ev2vpVg3j53AAvj0GKnk4pAtdt4R6+AcukeJFl5bnZ/K7OVH2nsHTSfXXU4uvIN/kGBFf4CESzSnX4pv2E8xLg6feq2Xq6xNDJNtNOvYg2xEr8GDUGD8aaVCjYj5HwHJWz7o4hlYJ5vYM1fhgZSrBB577DoeZN1SO6ggaafuDICkVsIuqbAmkOpF/iYhyJMz0DBVBbfDn8DMdxDMrVv8qNC/jwhIhHZSLPleQENqak5qKWJmzmNE6vzvf1Asal/NbdiR0H9s9BAaTdwO+2c+Y5tJZ1SMZqlFsDupge1Ftp2k8ZL5Q1pKiY4mc3GWFPN72v2XYn6GgD5VjUZpN3jOfLgnXcZ3ut24ld0Ht9JnwmQYTWAMIQijoMs8AIfw9XRLltCSbYdLj6PoHlXDmu6UOnXvDxK3CLptoZSw9bD3/1mowLVr37Hq0mcR7KM2KamyOpAHu4dT2f8ICftJPMJXK+Ib8MvQ2uOmH7rkJtvpw54gf9/FBt6Nv3+wg061DOwMQ6m+5lXAJ6NLEonaIeVjWj4ZKLiFxkm5dT7cOqV2stYyTaMoipmE6qPf2DZJA+ct52HWNYRUrAFa0V9qSMVXQGBpoViFGh/rPy28Bv00MzORhpRGpIXWaGRuQTFTKGIjAs+KwLQiGC1qrdjvJ/Q9FT/RQvErrXndhhYtYGlhV+OT2ljCwq4ZrMfNgtOJSzBPZnsqMUn5DM7LQgO6AJJHT9pZJvuVyfXatv+5nC+G3SkdGkm2oPP5uGLajTKJGKCeCNn9oTf2QZVqMgrznkCnAH/Sx/3KoIos6O8UsgwffpUdxPr+WOrUvT9IxM+TEJfCJp1CFmNQ7Eppy79G8YqKJycnRQiT9XNz4B++CBW5dGhzpxNwMolfs0lXqx+J6pwofGY4STqkwwMJX/wqi2eRUqisBGm692OYPzIIlrakXgRYQwLN2qoBaZkV31tS4WSU0YzKbgZLyu8BOqGA1lRw8b0e5DVcbMwwvLsjFg/oiKcX9cQr+6LwybGR+DJpMrp4+qC5TUPYEJBKXX4n6yf3rJxbLJ+88nrSBgL4moEbK1hYWMHGrinMLW3RwMqGoCRtbdkZlsvT8MBpPTtEgk86RbF+/2SSv8HJMgLuJi1fCfZ9+ALy6T9JHJpiHX0vTT9U3lyBfFMktmyeAceoI/AMXIR2kfSpAtdi2doXX2Zd68t/ohw9+o5De9JMV/FBA6Rn2wpf/xD6edNRmjsexTnjUZUVi/y8Qagg56/MnoC919Jg/XI5aY8MsNz7cOsUUYqzhRQT7E5r8GDCNTRMKIHLgU9h1mMwLGxsavy1RhT6bA3Y4zcQqqe8mtFHqhnKN6dCmlk0ozVsAjPrmu+aUEHtrRvgIR5v07QBmvL7uf088Oa6UPzwZF/oEyOgTeuGqwneuJ40AKeXRSLStxm6tLRSBmMamzXhNdopr+IfNrKROT3SPQsKf/8jREZVpTOwoNW1VKwv78+yBWwtaIEJRmt2DpYNmsKiZxg8nnodFhdIN1+ugl1iDuxS7p95WJ/LhtmFEnRPTIVBYrZkj2fHOhSyObdKFluro/HD94fg2nsm3KkXbmRq7v570WvgX8ia/FXKiLGrnvIK3AT7iI1wl2wvvbdj0LT+5PlDlC1GEjnLpJWoXyOUHQalunHolSKWj75aHQ+3LpHBGOvUPPbE9EOUyXiKzGlRLNNkfWTNyGXTU2q4HHofdiETlYltoYFWNjUDKc3NGlAZSb2sLdGE9Ou1o1NQnNwHt493hfZkAD59LhKH5gxAWwtztGpAq8njzO0aw8aslTLIIuC1U4TnUKxKrfB4sTQWBLyFMmFuTuW3VQDA5vlDpIU5Lb9c286cQmtmScvWdQg6HvkY1kIbz1SgaYIeNidkLSqt2kuZlAxaLgPM/xmt/Lkoo9B8DskFaPfUReQalim58Muzh6FAPwyyqbeSnatOvwVdQubR55e55s1wiFwGT/94qWN9+T1Kv7GL0LznKniR0zuF7IZb2HykXdyHsqwImDImo8AUjnz9OGVyE6ohUOk2oP/BGWhw7irMXhAA0vlPNMDs1f/8fF+T0zfRIFELq6Gb0ayBOdKPxeDS/olwpsKa00qaN6OFshPfkEpM8AiFFN9QRhLNCDre3h8oMiBDf00RodL8zoLWixZMwN+SYmHBelm607o5sr7WsHvQFrZBMXA58QXMU4QulsE2+VewiTrE/EwhGid/D4uzsvb0ljIqbPYS0Pa5V5CjXqn4dBKCUJsXo2z/up05GIbikeg2YBHcui+GS5/VcA5+SgnJ/s4X3+7lvdWX36v4hS9QHGmf0J3wiNiKDiFb8Pm1HfQB+vPByCDLWORrY1GqlviXY2AwLobn02/B7JUSNEzW0aFPh1nyf36KwexVIyxeKkHQi2/h+qnROPXqOtgmpqPxsUw8GLMCNg3dYSXKbENlb0jrRappSQA0odVqpoDvbnD8XkJrxVeZxqjxB80VGmxNH83CnBSStNHGmr5sdCyayGjl2Vtss2o0Sqb1unCbFp8sII0WjLTcQkZ662qL+xTzs5L7oVDJ6WCWlg3btBuwSa7EJcMLdB/6IM8wHFUEXrFmAp/lcBToRmHC9NlwD5FEpuvg2WcPOkftwowVz/+2vW/15f6KN8HnGLkUnr0P0fo9AZ/gZcjQbEehQfbpxaBCM1jZYSw7hMsIwG80a+H57Ot8uJWwkrWQkl+tDkX4t0Uo0gUjRie9iJLnu+O1tI3syTPYixfD+eQVNOzmDXsPJzTqHQe/HV/A/cWv4TxrHczbuMDKvDFpZcs6APJ7SM2opwI4GS21awOzxu5w6TsdbZ77HFa0OG773kezkJlo7uQMVzd72ISMp6+rhlmKBlanc2vmMGUBgTI48tssnmUqX2XxwbksWJOmuiR8g/f0iShUjSK97APZVF2tGoZ8g+TQmIjNR2p2h7uGLYdX7y1wCdqGh8MmFPKe6ssfVdr3WQIvf1mNEI929P0eCRkGg3YLe8qBpCeDlF3K+XkRBN5UVJGmXClORLvED/jAi2FLJapLEe5HZPlSq7RPYHaevuCZbIIrF7apP2BX6nqoXwzC22lL0DzxG/qIBWhyMhO2XfvB1dMNfq3d4OTaGm4OHeBr7wRXJ1+09AmHbY+x6LP/VdgfvQz7+Gdg+ZATGts0J72zpVW0oWWSkU1bgoVW0aoJWvN9czMbfkcfS6YbCCIZvJHBneYEVuNai2Yhg0A2Ig0Vv/NBy0Ywt22Adn0WoN2RHGWtaJtn3oF5TAwatu2O9u064OHWDvB0cEFrNx94OdjDzckVjZzc8NDTN0jX78NHu1+RjoqiZASSPX1ndXAkTX/T9Dyqs6TDHAWTTgIAS8RtWYQ8BafPy9LCFXCL2IKOATVTX45dJ8v915c/snTrdsTaO3gj2oUtgnvYBmV1yyMR/aDPW4yim7Eo10jIg7EoljB8uRNwmz7fx4ajaJ70GSwkwWFdCnEfomSflRRWZ2+j3YuXMfj0e7hwfiPKTobilYtL4XLsHdgl69E0VY3Wz1yBezsfeDq3gruDB9p4tqBiu6KlW3sC0IvK7g43Rxc4uBKIjq54rFUrtG3RFmahE+F06DIaJP0Axz1JMG/djpTQDi3oC9oRTOY/G86X5WZtCDRL+e5BWrEmDQnChrC2bYIHhyxAqwSC7HwhfJ75G5oHj0LTNh3Qltd2cXaAu8uDcHdtijburJO7D1q5toeziyO8nB9CewcHuDh5w9mxBZx3vqlYuLra47eIuWwAJitok2TEO4Ub6dPFoIgspVA3GAX6oSghCAsNkXjv0gp0CFpKn34XXKJWwZ3A8wqdWg+6/1b5xxe5f3MPXQbv3rvgFngILpH78Ehkf+jYS1aox6FUH07aMo8WcLgyFF2e3R9X9U+hTeJXyuoJq1RZayirKagAyo7snylG7Qib2Rl+z9+UXdr8ziLNiCZJkpg/GxfPbYHpZC/kvRCAyoQWCDySBuvz9B8vym7pErjF7YanvQ/cndvBUZSYyu7h4AYXlxZo69ESrTzboK27A5xcnNGltSs6tmuHB71bo7mvE9xpIdt6tIWre0s85OIAu8Cx8N7+Ptocuw6f3edh69cLNjaNaBEtYd+4JR7sMw7tLnwCi7PfocUL38Nu+CI0ah8CjzY+8HZxhWPrlvBzElC1gbu71MUD3o5t4OfQmPVoCwf3VqwXLbKTPdydnOBj7wh3+/boZN8OzstfrGmHn7fPrxQFZHd2sMum3rQCWJ820tLl4svC3QTdIBSrBsGoHY0ivQT3lRiW0/HBZfpy3XcpOcwlkJNb0Bp05GutCtSX/1Z5NvXj533D4+ESshGOQfHw6LUDXQKGKSOaJZp+qE6PQWmOLGYl5eTDLGCPmpm3GR2Pn6dvcRsWVIKanvcuKlULvMYp2bRg9G/SJO82X1OLMeDoKXx6YRQMx3sh/6QvvjoVhxnnTiu7pM1Tae1SsuhLFqHR9L1o2dYDHajMrs7OcHJqj+aeVHonTzg6d4CDszdcXdrB06U5welyj3iQ6nnQ13IjYJwJBgcCyNPREW72HdDCORBtI6ah664EtBq2BE3dH+V1HODbtiUcXToQWG51nrMukWNdncT6etDytoeLY0e4OniSEj8EB1pgj1WJMHtZknH+rH1+pVinklKeLldWElnKGlp2TO6J7+OaaQVKDSNQKRHrciQvxTgl+YtEHPjw0iZ07LEebYI3wzVkh7J1p3PYT4uf68t/uWx98pWt3qEr+HBW18R5Cd2IblEjoMreqezfk+w0ZUrMjBGQTDtV6mHIMKxEQPJJKoQAjDRKVt7XoTCWp9S0XpKVNA8xKclIPx6IomOP4fK5aBQc64W0l7bBklbGXOKbKHFRimrmA0/noWGCAQ3SDGh00oC2z6Wj+RMb0cTXm1awK/xaOKFLGyq1ozNau4pVvBcQXo4OBJ0LQetOK+TKz46wd+oKR8dOpKod0aGNBx5u6UZAehE0zujg0IZU1gHtXEgZ7wN4bgS1i4MjvNs40xK7w8H7EdjSSj42dy/szn/IDok+7OkK2Eo2WtmsW0f73K+Yp9DSnSmD1Vkj27MAkaeTYNAthyl3OiQJSxmfS55hEqo1QSjKG4O3PtqDDoFb4B61HJ4R+5VFE91qt4zVlz9RefHi52v8QlfCXeK19CUAg/agU49RuJm3HNW0diWZk2DM60vLN1bJhFOpjUOBZhH80p6mYlApEooIGlkjSGU7J/FbbqNRggp2J/Mx8PTf8e2Z0Sg+7gddYg9UveCEq4mDkZ7SHw4nLsEs2UTg/YoRPlLbFqdy0O3EF2g2bAYs3UgHnQggR3sCywne9AF92rijxwPe6NDWFfau9qSkTnASANYBIG8HUlP+z9lFhGAlpfUmoJycHdHC0xntXN3hR5B2akML60BL2voBOLo6w65rCJxjN6DDsQ/Q8OQ13jfb4GwhO5vfYbtPYhFpehHMk3Mx5/NXkZczjQykJkyeyTBQiSBWrhqLwvyBeCFhHh4d+jRcQjdAUr+5h62BT+jcetD9aUu3T6396PO5BhyBU/gauIcvpD+whdbtGHvVMNzOkpBwkqZrHHvVAaSg0wE+9Kdvvgq7i2WkQT/A6gz9s3NGPHDiMnxP/gOvnZ6Hihc9oU8JgD7hUVLLLshN6I7CE90xJIF09Ww1rE/Jyoz7B17ThALYJUludRmSz6MFIPVKLYdtqgFuL34Km/AxaO3hRwvnTEraBo4+rWHv3Qr2Lq3qBJ67+I4EnocjQUjK2N7ZCw7tOsDF1QNObi1g7+WIZs6+cAibjEef+QgNjtPHOkvqSH/VNvUamh0rwoPHdWiSqIWFsu+OFq6Oev/bIm2TRFAnX8OnupOoVkeS8o+H0TCUDGQEytST+NobuXweY6aFwD1kCzx7PwkX/9loH7AbwSN21oPur1Aelki+IZuVaFLOganoTDC+9Opy6PJi6DtMQqUuCMZc2UgbicKMKdDm9cElTSLaHbuEhilq9Dv1Bt47twBlJwKRlRqBH5LCgBfbISepJ7JSekOb1B17U/eQTlagYWo6adiv838ktonlqSJYJRXDJrFMSaZvlVwGyzQdzNNuwvoM6W2yjr7iddil6ND8qauwi5oJZ/vWdYDuJ+C5k5Y6unigubMHGkePh+/h99DwBK+XXA6bVA2aJH9H6kuLfp71OEPrQ5DZJZEKJ+TBOqkUZimyG0OG+H/Fjo77EQLP69TL0OXsULITSaCgYl0/VGWOIQAnK+FCTFlLETWwL5/bAXT03472wcvRMmw7wmKPGmofa335K5Qeg1fDO1oCz+yEZ3Q8PIJXYPHilSjNH46yrNm0fENIOUej6oexyL/UFzfOdkXls51RmOCJkueDYUjugBtpPXAzJRrlx31wPWUgCo93hfFEDzx18TBaHvuGIJGROQ0Vi725EmvyPyvmtIDKe57b7mwBGiZrYUla3OhYBnye+wKtZm2HU9xqtBmzFJ4H3kYDJcRfpTIx/auo739aLmTTgppgcS6bVt2EfV/sQK4qDuWS7k09SonArOw20I5BuW44cnUb0Sk4Fi4Bu+AZJCnP+MyCtmH7iddUtY+zvvyVSvSo5bdlotUjaAfcg7fBNXoxekSNh0a7FmX6WFQbpkL9biAqPhqMW+8ORlGyH0pOdEFGcldUPeuPnMRA5Cd0RsnxjtAk+UN3rBu2njkCK1oPs7OVaEg/TYnSdbqUil734MxvEpk7k/PKNhqJO0IrZXmqGOYS8PVMGWlhIS1WPpon6NEoRQXrtAzWR0vqWsX//bbh/39XZJ7TViKZnTHA5cSH+Ea3BEUZk5CvpJSOQZlEfJZ4rLmjUZAzBu9/TOsWthquYRvgGjkHzqH74R2wGBc/vNm99jHWl79i6TlybTvX8FVo3WsH/HqvVyZiW0etw2d84IX6vij4eDAyT/pBf+xh5CU+fo/kkFZmpPrT2gVi4oUjpIP37/9YSOyXN3RodEIieqlg9sENNDlBWnqWwHjFCKuTtGgnCapX+HqGPlaSCpYp/PxcNsyTSmAuka8vksrSslq8LMAWEUtWQfCb0JjAb5BSiuYSmfpMOV+/JV28DfPjWpi/aoLlixKFWiKI3WS9tfTnSHFJIy1Scmt2WiRq8MDLV2HzSjVszpeR2sq0CtDo9M0f7+Gfyh2LmswO6PRlAk7CQVTAJkmHhy7osPvz8wSWLOEbiRIVOzlSesl7btLJ4FYM8vUzMHNJDPxCJMrXRjgEb4B7z5Xw6lo/XfC/VMx9QubDiT6DpB7zClkL16i9WLhS4moMhvZUN5ie7XUP6AwJ3VGQ5IArZ6agfWqqAhhb8ZF+roB1yR2lpIVS9vi9ZsC0t27iVlE1jufq8KJah9TsQsR8pUbw5zdx23QLG74tRvIH13Gr+CbCXr6OnYYCHlcITXUZrukqcVRXioDXxJ80oXlSOi1dOVollCLrNpBRWoS074pQUWzEgJdUePpaHgy3y3Hq6+vIuW1Cs+e/h9sLX+OV3BKUl6kw5z36kYl5SDBV8z9qvPBdLtTVQNz7ajRMSId1wq+4x5dl+Zkscqa1O1OJ3olP4ybpZGnmBALsUeTpR6NQE4diyZ2eM4lMox/SM5bDLzAO7hE76IMTcGFPKkv/YmZuv1b7vOrL/1KZsOgwHILW0n9YB/fIdWgVsB5ePWfg6keroT51r8XTn3wMGUmPQW3ahO4JryiDEZZnfsXAA4FnodDEQkx4V43qiiroym6jsLoKRZWVGH9WjwcT03E2uwjZt4tRUVEC9e3b6JBwmX5SIZol5OAr3Mbub3SwOJPDc9WGS0gVamuiRcyEHSmoU9JX+EpfjZySatif+BTf3r6Fo1k6NEgqQvltPaZ+UIlWx6+jWWomslCNta9/TwBXo8lpAvhYAU6oTCi6VQ2vZz+CxcU8PJDI3+u6nzrEOlnCARaTVn6Ey4YnUSL5NHKHK4vUSzSSUERyGgj4JA7lJDzzzHp4RuxCu1BJaiMBrjbzdTbW70sOrH1M9eV/sWw49PLD7YMXwtl/JdwC16Hl41vh1WM2Vs2fg+KM8ai+Pgu3vo3E1eQgFH7RH1mF41CgGYDqzHBcyj1AOpgNy3NqNE5Ss9e/BbvUG6RtMu9VxyLitGLYpNJ6JBdi7htZAK3N4jOXMJC0cfKFq+j/ShbWfXyTgNMj+s134Jf4Nm7ersZ7eZUwO1ENK55Xd7sCO7/LhNV5LfbcyMGqm2rSSII5OR+NTmlw0lSGirJsbL9yGXM+vQHX11Q4ZazEN1W3EZmUgiojSEH/RqBWoOWzBgL8FhZd+hQ2p8px9KqO1zbgSMZ1TP1Ui/A3yvFQAq0X6eY996LILTRN/hJNSY/N2WnIzgLrtEwc/Po4TCpSydzxyjSBLFIo0g1GuXosbqlmKiEfNbqd8O87CG5B2+ApQWRDFsExZAOCYuqXf/2fKsHDl8JFUhwHr4VH2DIliUXnoNW4enM7qvRDUJU+GWXawTCp55PLxcCojYXJMApG/RTEX38L1mfz0TApU0miYXZWLBAV8R5F1dNK6WgRymBzWg3HF7+E1zENGqQa0DBFKBoB9HI+miReg3XKNTRMvAmrxGyem/7dyXL6TSoCnddIpLW7UIQmCdfxwPGb/FzKaxLQZ/J4/A1Y0T9snHIdLV6kbye7vVNz0fKEEXavfElwEEiJQDPxJ88RrMe+Qcvn82FF/7BR8ndoc0zm7/ifC/T7kuV9JcwT6p4eMee9NDhJ+vxqEWzPF2P120dxK2ck8lWRUOXPUIIMV+cMUEBXrJ6u7C7QZ/XDglUz4C7JQEJXwCsoHr59n8TDUfGYt+2Kd+3jqC//18ojIZK3IR6ufQ+Sfk5Hp8eO4fH+c3G1fATKrkts/gEo0Y9CfuZUlGfNZw8+CiV50cjPnoYn3thK60damFAAC7F6Z6tJ7zJq/J+0SjRLkvWJ9yqwmexw4GvDBCManzTCKslEn0tPK8T3KTrYEQCNE7S0plqCQ0/rSoCeJbVUQlGIpaE1TC1Bs+QsHpsHi3MqmF2UqFwyClqIhrSwQm/NSXWtzhTTctbsnbNIkWkGWRQur7+sy49yx3djh9JEAvOeIghfqkCL1G9hnlwJm7QyxL26G7eMIwi6KQqVLNQNQZmkJVZNQJ5hPN9PQP71fvjwi/1oIUFdQ/You8QdA3coi527RA6/Xdv89eX/colbeujNR6PWk/5sh3PwHjiErEJ7/9VYt30ajJL9VUvFolJJxtkCQzSqqFjluT1xO30qbmrmYMTbCbRsBEKCmlajku+L0YAAMpdccz9X6lqxkPWhovi0QFantLQyWaSrMh1Ai5KoU+bA2j5XwPMRREkE0/l8WkwBmIQelLk8STbC/1KaHDOR+vGYs4UErrzSb3wmC42SxMczwFZiyAi4JKSeEvuSFlh5z2NZl3umQWqBJ/EwLU5XoMGpTMpVArccUa88TYs/G9XZ/sjSjUa5fgTfjyW9lNTco1CZMxTlqmEwqg+gS/hAuIQeRMfg9XAIXAXnyF1w6/UEjqR82qy22etLfakpQQOWo0XgNDiH7IB30EY4s3d+pM8mXHxnP4y6YezJB6JIPROFSmrmqTDmB6OIgCzOnoyb6iWY/s5zaH76e/p1eoJOFLjWetwlspnWmlbO4rwRjgkZaD7yadgd/RItEzNgs+NDmC17Da5HbsAu9jTM570E65c1sJmchnaJkoBSA7Ppx9F5zzcwm/cWmi97A85Jelhtfw/Wc87A9elv4bb+Q1gvOIUOR3nMyENoueMTmE08hoab3kOTF9OVjEB3EmNKFp6761cjBlifzsCDx77F/DdToFGNRxV9NkkOWqIbg1L1FBTlSt72mjzs5ZqxMOZuRP/YqbAPiKcPvQSugZKcdBe6hCzH7n1nT9Y2c32pL/eWnYl/c+wcvhCd+sggwFa4Ra+hEknSlNn46KMjKM0bpfgvsku6yBBB4M1BCa2ivrgvbmnWwaAaiye/PkGfinTv1VxSvSxYixWRwK6nSvHAiVy+ij9I8J2jRTv0DSzHPEc6mA1n+mwWq16B2bq30fz5qzAf+SzpHUGXVAjXZ0llV5xFw5Wvo8OWrwlanmfuBbQgMDvsuEpgnkaDSSlwW3sJDy56C82mnEWjXR/Bat4FWBy9gpaHv0VrXlcyFSlWjdRVACZZZa1kxJTWzTKlWKGkElWtWfI1PPvDaZiyx9GSDYTaOIOWf3At2Hjv7IiKcsajnO81ueMxebpk61kDr/DVaN2btDJoPbxC16Jz6OzE2qatL/XlX5fwsQsbtQ+bg059j8Ajagfa99sGp8fnoXPAXHx0aQGMxn5UyLlUvGhlIr46OxL5uXHIyZc8geH8bi7e1TwJlxcuwiwVsE5Wo/E5+n8y2HFar6w4kZUnypSDzPcp4CQY6NuZndRR8Utg9tZt2NKvU/YLXsyjJRVLpEETCaGnrLOU1SkmNE4uhi0BJWHmrUkRG/H7pseK0PR4ERonymBIMemsEeYSkEk5B0XoJl9lQ7D5qbIa6vmSCe2fO4ZL2QmokM3DuaOhN0xEPn3cSk1f+nOj6ceNRFVWNH280Sg2LceUOdPg0zMerYN2wTFyI1x7bYJnr6WIHLWmfrSyvvyG8vjtBn60do6BC5RY+N5he+Aevh+P9NqP198cg0LdAPb8MgI6CNWqPqhUjYBav4LKGguTsh50ErKztyHs1b/BktTS7qxK8bnMZSGypFU+k4uGBNqDS96A+05apnUfofmxdDQ4rYb5uBMED39PLKO/RiCeoz92hlYp2YTWx3guUkyzC6S1z91E4wRS0OWvoxHpqIw+tjiugeWrBjxAkFpJPvMLxTXgkgxHp0ysg4COYCTtbZJUhJFvX0CWaQ2q1UNoxUcrlq1IM5lgG4vS3OGkkiOVEHsFuYORp52LQRMD4dlnN9qFzoXD4xvhE7wKXYJ3I3BofHVty9WX+vLbS7duaxv6+s+Aewh9P4LPNXotHHrugF+P3Vi/czZK1ENRkDUBBfn9UaCLoWUYhwpdiKLAlXxfrQlFnmYaLt88Au/nUmB2vpKWpgqNU0jzzhlgeeATtD70OayO0UfcfAk+z30Jq1FPwu/kd2gx8UXYL7iAHls+g9m0Z9Ho9DdocewKHNe+gYY734RV7EF4PvMlzBYno83hf6D5ppfRZdv78D74BZoOeQa+G/+BDvtJXYVW0qczFwCfK0WXZ8/is/RzyNEMA9RhyvB/TVDgMbTaNWHTCzXSgUxFnrEPdDclqldftOu7C/bhW5SkouLDCaXsNXhJvYWrL79fGTNnq0PnqFGkVEth778dLmGSY3sdnAN34ZGIcdDpViqZiwq18wjA8ZSR0OeNpALTeuQIbRuGUt0E6DJm4eQX78L5ma9gdUEFi9dojcQCvp4Pa8m195YKjY5p0YAU9KETtFjn85Rd7bZnC9H8bBH9PlLSxGzYntKhobKYmv+hb2aRpqbk0TfUoqkEnT1uRLMLJgVwdqcNcDj+Fk5eOYkK1Sx2FtHIMA2mVZtIcE1BkXoOyvRhym798qzJKFWPg1Ybg6QLc9Gl5zI4hm6GW9A6+EZshG/UFvj03YZpC/fUA66+/HElQ1fcNnDIcngFrYb94/GQNGLO4RuonNvgGzgLzxyeSYsxC8acISjJGYsy9USUaSSdWE0qadkAWqwbB4N2BnINS7Hv+1No/aKsMCmHBX02i1P5pJQE1PlcWJB22tInlNCEP4061vpoMlVwjr6e0FdJp5wqEdAKYXm2HJYXZIOtCi0I0DWfpOGqbjHKdBMJtNr0Zkp20xEoV49EKetWkDMUpfoRqNSNQZFuH4IHRcIjYhlcwlcqub2dgzfBKTwe3n1XYPXeU6drm6K+1Jf/Tlm6J+0zl4i9aN//ADr0XQfPiHlwiZwF15CV8Ascg6+vboYph4DL6oeyjLEoVI8mDR2NMsV3GoEKWf1BileqFeszHK/pE9Dq2GswO2GCnWzxuUi/7LyWfpwMzPwMeLVzbg8kXaO/R9/vLIF56jKapGTB4fkMbLlygeedjcqsaShVzVAia/8yr+BYRcqyo2n9+kGvWYZV2+egQ/hMeAXHo33QJrj22ANn0uu2oRvgEziz3rrVlz9XKc277gjA0qvnCriGr4Fr8Ap4B2xUVmzIgmDXoM0IHTAQGen7UKGZAJNa0laTimpF+ccoAX+q1BLSbhJ02aNwK7c/KnLH4fvc6Rj13hswO1mCZqlX6wReA9mTl6LBw2fO4FzeUQJsBkpUPHcOAZc9AcgeRGsbgzzteMXCKanNFNDJAuYJSHlpCTqHPAG3sN2w77UcfsE70S5iK9pGbkKr3rPRK2Lt57W3WV/qy5+77Hjh1Zd8Q+ejg/hF4btJQbfydSW8whcpmY569huBz75aTl+Q1i9jGAoJhGLVPIKB7/PCaKnGK5PUmaaJ0BSE0D98DEZarM+KF2P4ayfR6qQJbseuYOcne2HSziWw+gKqYNzOkp0AE+lHRipTHTIqacqNRZ5xEEzGvjxPFAE5Fs8c3YL2gSvwIK1y+/DtsA9aBNc+7DTCNsHZfxeCBm2AOv9219rbqS/15a9XpizZf8nLfyHadV8L9+D98Kayu0XGwTloBzyC9sE3ehaOHj4EjW4BSkyRpJ4SdWsg1KZhKM6NwW1awCp1DAp1YhX5SmDpdXHIo49YouuHW1kjcEsTRdo6GEU5U1GoHwyjMZB+2ngU8Xhjbk8YVBsxMXYG2keugtujq9ExaDk8w5bAOWwjfbcl8AgmlfRfgrU7z/vXVru+1Jf/nbJr5/7bbXrNh0v4DrQL2AaXgNXoFLWM9HQJHCPWwztsF3pGjMTlL3ejWBeLCknCoqoJyluUR59QNRFlOTIoUpN+WlJZaXPDUWKYRAs3UxkxLdSPhkm/Gk8enYkOkaPhFLmQwNqE9gH74By4Ba6Ra9GadfCL2EwfdCtmx+93ra1efakv//vluTPv67wDFyu53d3DltMSLoJn0GJ4RW9Buz7b0M3/AN+vhdugEXjz8wMoy55MajpOAWGVDNAooRVILfNioMnYiY0b1uHR0GlwD5yLthFr8KD/crSP2gSP0NVwDKdErYFXxCr0HLSqfpCkvtSXO6X3kHjSvnkE4WJ0DNwF55B9cA/ZAI/ADfAO3wZ7SWIfTGoaOBnxuzcjePBoWrJlPP4JOPfeBtfAZ+EWvIMAXga30FW0oov52wp0CtqC4RMOX6i9TH2pL/Xln5Wlu46teqTPXLQPWQPP0P1wDd4FtzD6iGFr4BG2mt+thhelfchqgo8WM3gnQboVXkGr0CV0CcbP344j5z9tWHu6+lJf6su/U1bvTQh/NGopvEI2ok2vdfQHd6Jt0Ga07rECspZ04caTSHvrmnvt4fWlvtSX36Mcf/la09q39eUvV8zM/h/QNGN7yuSJmAAAAABJRU5ErkJggg==';
    this.studentsScoresheet.forEach(() =>
      widths.push((100 / this.studentsScoresheet.length).toString() + '%')
    );

    const documentDefinition: TDocumentDefinitions = {
      info: {
        title: `${this.classname} ${this.scoresheetService.selectedYear} Scoresheet`,
        author: 'Fanelesibonge Malaza',
        subject: 'Monthly scoresheet',
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        [
          {
            image: image,
            fit: [50, 50],
            width: 200,
            alignment: 'center',
          },
          {
            layout: {
              hLineWidth: function () {
                return 0;
              },
              vLineWidth: function () {
                return 0;
              },
            },
            table: {
              headerRows: 0,
              widths: ['33%', '33%', '33%'],
              body: [
                [
                  this.addTableText(this.classname, 14, '', '0', [2, 15]),
                  this.addTableText(this.schoolName, 14, '', '', [2, 15]),
                  this.addTableText(this.scoresheetYear, 14, '', '0.5', [2, 4]),
                ],
              ],
            },
          },
        ],
        {
          layout: {
            hLineWidth: function () {
              return 0.4;
            },
            vLineWidth: function () {
              return 0.4;
            },
          },
          table: {
            widths: 'auto',
            headerRows: 1,
            body: this.studentsScoresheet,
          },
        },
        {
          text: "Class Teacher's Signature: ____________________",
          alignment: 'center',
          margin: [22, 18],
        },
        {
          text: 'Headteachers Signature: ____________________',
          alignment: 'center',
          margin: [22, 8],
        },
      ],
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  // function to create table header row
  createTableHeaders() {
    const headers = [this.addTableText('Pos'), this.addTableText('Name')];

    for (let i = 2; i < this.displayedColumns.length - 3; i++) {
      // console.log(this.subjects[i]);
      headers.push(this.addTableText(this.displayedColumns[i]));
    }

    // add the last three column
    headers.push(this.addTableText('Aggregate'));
    headers.push(this.addTableText('Position'));
    headers.push(this.addTableText('Pass/Fail'));

    this.studentsScoresheet.push(headers);
    // this.findPhysicalScienceIdScoresheet();
  }

  // function to sort students list using position
  sortStudents() {
    this.dataSource.data.sort((a, b) => a.position - b.position);
  }

  // function to add students to a 2D array for table body
  createStudentInfo() {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      const student = this.dataSource.data[i];
      console.log(student);
      // console.log(student);
      const tempArr = [];

      tempArr.push(this.addTableText(student.position.toString()));
      tempArr.push(this.addTableText(student.surname + ' ' + student.name));

      student.marks.forEach((mark) => {
        tempArr.push(this.addTableText(mark.toString()));
      });

      tempArr.push(this.addTableText(student.aggregate.toString()));
      tempArr.push(this.addTableText(student.position.toString()));
      tempArr.push(this.addTableText(student.pass_fail));

      this.studentsScoresheet.push(tempArr);
    }

    this.findPhysicalScienceIdScoresheet();
  }

  addTableText(
    text: string,
    fontSize?: number,
    fillColor?: string,
    fillOpacity?: string,
    margin?: number[],
    bold?: boolean,
    alignment?: string
  ) {
    return {
      text: text,
      fontSize: fontSize || 6,
      bold: bold || false,
      alignment: alignment || 'center',
      fillColor: fillColor || '',
      fillOpacity: fillOpacity || '',
      margin: margin || [],
    };
  }

  // function to get physics and chemistry _ids
  findPhysicalScienceIds() {
    const physicsRegEx = new RegExp('Physic');
    const chemRegEx = new RegExp('Chem');

    // variable for physics and chemistry marks
    let physicsIndex = null;

    for (let i = 0; i < this.displayedColumns.length; i++) {
      const name = this.displayedColumns[i];
      console.log(name);

      if (physicsRegEx.test(name)) {
        physicsIndex = i - 2;
      }

      if (chemRegEx.test(name)) {
        this.chemistryIndex = i - 2;
      }
    }

    for (let j = 0; j < this.dataSource.data.length; j++) {
      const temp = this.dataSource.data[j];

      if (physicsIndex != null && this.chemistryIndex != -1) {
        const finalPhysics =
          Number.parseInt(temp.marks[physicsIndex]) +
          Number.parseInt(temp.marks[this.chemistryIndex]);

        if (!isNaN(finalPhysics)) {
          temp.marks.splice(physicsIndex, 1, (finalPhysics / 2).toString());
        }
      }

      this.dataSource.data[j].marks = temp.marks;
      console.log(this.dataSource.data[j].marks);
    }

    // remove chemistry from the displayed columns
    if (this.chemistryIndex != -1 && physicsIndex != null) {
      this.displayedColumns.splice(this.chemistryIndex + 2, 1);
    }
  }

  findPhysicalScienceIdScoresheet() {
    const physicsRegEx = new RegExp('Physic');
    const chemRegEx = new RegExp('Chem');

    // variable for physics and chemistry marks
    let physicsIndex = null;
    let chemistryIndex = null;
    for (let i = 0; i < this.studentsScoresheet[0].length; i++) {
      const name = this.studentsScoresheet[0][i];
      console.log(name);

      if (physicsRegEx.test(name['text'])) {
        physicsIndex = i - 2;
      }

      if (chemRegEx.test(name['text'])) {
        chemistryIndex = i - 2;
      }
    }

    console.log(`Physics Index: ${physicsIndex}`);
    console.log(`Chemistry Index: ${chemistryIndex}`);

    // for (let j = 0; j < this.dataSource.data.length; j++) {
    //   const temp = this.dataSource.data[j];
    //
    //   if (physicsIndex != null && chemistryIndex != null) {
    //     const finalPhysics =
    //       Number.parseInt(temp.marks[physicsIndex]) +
    //       Number.parseInt(temp.marks[chemistryIndex]);
    //
    //     if (!isNaN(finalPhysics)) {
    //       temp.marks.splice(physicsIndex, 1, (finalPhysics / 2).toString());
    //     }
    //   }
    //
    //   this.dataSource.data[j].marks = temp.marks;
    //   // console.log(this.dataSource.data[j].marks);
    // }

    // remove chemistry from the displayed columns
    if (physicsIndex != null) {
      console.log(this.studentsScoresheet);

      for (let i = 1; i < this.studentsScoresheet.length; i++) {
        this.studentsScoresheet[i].splice(physicsIndex + 3, 1);
      }

      // remove chemistry mark for every student
      // this.studentsScoresheet.for;
    }
  }
}
