import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, takeWhile } from 'rxjs';
import { selectReportsForMatTable } from 'src/app/store/reports/reports.selector';

@Component({
  selector: 'app-mat-tab-table',
  templateUrl: './mat-tab-table.component.html',
  styleUrls: ['./mat-tab-table.component.scss'],
})
export class MatTabTableComponent implements AfterViewInit, OnDestroy {
  // @Input() data!: Observable<any[]>;
  reports$ = this.store.select(selectReportsForMatTable);
  alive = true;

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    console.log('This is in after view init MatTabTableComponent');
    this.reports$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data) => {
        console.log(data);
      },
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
