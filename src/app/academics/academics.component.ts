import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddSubjectsService } from '../shared/add-subjects/add-subjects.service';

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.scss'],
})
export class AcademicsComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Overview', cols: 1, rows: 1 },
          { title: 'Streams', cols: 1, rows: 1 },
          { title: 'Subjects', cols: 1, rows: 1 },
          { title: 'Departments', cols: 1, rows: 1 },
          { title: 'Teachers', cols: 1, rows: 1 },
          { title: 'Class Students', cols: 1, rows: 1 },
          { title: 'Subject Teachers', cols: 1, rows: 1 },
          { title: 'Teachers', cols: 1, rows: 1 },
          { title: 'Head of Departments', cols: 1, rows: 1 },
          { title: 'Committees', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Overview', cols: 2, rows: 1 },
        { title: 'Streams', cols: 1, rows: 1 },
        { title: 'Subjects', cols: 1, rows: 1 },
        { title: 'Departments', cols: 1, rows: 1 },
        { title: 'Teachers', cols: 1, rows: 1 },
        { title: 'Class Students', cols: 1, rows: 1 },
        { title: 'Subject Teachers', cols: 1, rows: 1 },
        { title: 'Class Teachers', cols: 1, rows: 1 },
        { title: 'Head of Departments', cols: 1, rows: 1 },
        { title: 'Committees', cols: 1, rows: 1 },
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private api: ClassnameApiService,
    private subjectsApi: AddSubjectsService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getStreams();
    this.getSubjects();
  }

  public larger = '350px';
  public smaller = '150px';
  public streamsCount = '0';
  public subjectCount = '0';

  getStreams() {
    this.api.viewAllClasses(0, 0).subscribe({
      next: (data: any) => {
        console.log(data.length);
        this.streamsCount = data.length.toString();
        console.log(this.streamsCount);
      },
      error: (err) => {
        this.showSnackBar(err.toString(), 'Close');
      },
    });
  }

  getSubjects() {
    this.subjectsApi.getAllSubjects(0, 0).subscribe({
      next: (data: any) => {
        this.subjectCount = data.length.toString();
      },
      error: (err) => {
        this.showSnackBar(err.toString(), 'Close');
      },
    });
  }

  // function to navigate to add streams component
  navigate = (path: string): void => {
    this.router.navigate(['add-streams']);
  };

  // function to display snackbar
  showSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
