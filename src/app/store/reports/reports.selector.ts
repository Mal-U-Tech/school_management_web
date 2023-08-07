import { MatTableDataSource } from '@angular/material/table';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IReports } from 'src/app/shared/reports/reports.interface';
import { ReportState } from './reports.reducer';

export const selectReport = createFeatureSelector<ReportState>('reports');

export const selectReportsArray = createSelector(
  selectReport,
  (state: ReportState) => state.reports,
);

export const selectReportsIsLoading = createSelector(
  selectReport,
  (state: ReportState) => state.reportsIsLoading,
);

export const selectChosenReport = createSelector(
  selectReport,
  (state: ReportState) => state.chosenReport,
);

export const selectReportsErrorMessage = createSelector(
  selectReport,
  (state: ReportState) => state.errorMessage,
);

export const selectReportsForMatTable = createSelector(
  selectReport,
  (state: ReportState) => {
    const reports: {
      label: string;
      datasource: any;
    }[] = [];

    console.log(state.reports);

    for (let i = 0; i < state.reports.length; i++) {
      const temp: IReports = state.reports[i];

      if (reports.length === 0) {
        reports.push({
          label: temp.year,
          datasource: (new MatTableDataSource<IReports>().data = [temp]),
        });
        console.log(reports);
      } else {
        // find the index of the current year
        const yearIndex = reports.findIndex((rep) => rep.label === temp.year);

        if (yearIndex === -1) {
          // this is a new and different year. Add in new index
          reports.push({
            label: temp.year,
            datasource: (new MatTableDataSource<IReports>().data = [temp]),
          });
        } else {
          // the year and index has been found.
          // append to the available datasource
          reports[yearIndex].datasource.push(temp);
          console.log(reports);
        }
      }
    }

    // if reports is empty
    if (!reports.length) {
      // add current year and empty array
      const year = new Date().getFullYear().toString();
      reports.push({
        label: year,
        datasource: [],
      });
    }

    return reports;
  },
);
