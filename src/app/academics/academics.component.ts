import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

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

  constructor(private breakpointObserver: BreakpointObserver) {}
}
