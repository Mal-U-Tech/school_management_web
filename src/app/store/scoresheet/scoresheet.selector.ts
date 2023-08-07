import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SCORESHEET } from 'src/app/scoresheet/view-scoresheets/view-scoresheets.component';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import { SubjectsState } from '../subjects/subjects.reducer';
import { selectSubject } from '../subjects/subjects.selector';
import { ScoresheetState } from './scoresheet.reducer';

export const selectScoresheet =
  createFeatureSelector<ScoresheetState>('scoresheet');

export const selectScoresheetsArray = createSelector(
  selectScoresheet,
  (state: ScoresheetState) => state.scoresheets,
);

export const selectScoresheetIsLoading = createSelector(
  selectScoresheet,
  (state: ScoresheetState) => state.scoresheetIsLoading,
);

export const selectScoresheetErrorMessage = createSelector(
  selectScoresheet,
  (state: ScoresheetState) => state.errorMessage,
);

export const selectAllScoresheetsSortedByYear = createSelector(
  selectScoresheet,
  (state: ScoresheetState) => {
    const scoresheets = [];
    let years: string[] = [];

    console.log(state.scoresheets);
    // first retrieve the year that are in the serviceResult array
    for (let i = 0; i < state.scoresheets.length; i++) {
      let tempYear = '0';
      const item = state.scoresheets[i];

      if (item.year == tempYear) {
        continue;
      } else if (item.year != tempYear) {
        const found = years.find((year) => year === item.year);

        if (found === undefined) {
          tempYear = item.year;
          years.push(item.year);
        }
      }
    }

    // sort years in descending order
    years = years.sort((n1, n2) => Number.parseInt(n2) - Number.parseInt(n1));

    // assign scoresheets to years
    years.forEach((year) => {
      const tempSheets: SCORESHEET[] = [];
      let j = 1;
      state.scoresheets.forEach((res) => {
        if (res.year == year.toString()) {
          tempSheets.push({
            _id: res._id || '',
            index: j.toString(),
            name: res.name,
            year: res.year,
            classes: res.classes as IClassname[],
          });

          j++;
        }
      });
      scoresheets.push({
        year: year.toString(),
        scoresheets: tempSheets,
      });
    });

    // handle for when there are no sheets in year
    if (!scoresheets.length) {
      // handle when scores when there are no scoresheets
      scoresheets.push({
        year: new Date().getFullYear().toString(),
        scoresheets: [],
      });
    }

    return scoresheets;
  },
);

// selector to get classes along with their subjects
export const selectStreamsForScoresheet = createSelector(
  selectSubject,
  selectScoresheet,
  (subject: SubjectsState, scoresheet: ScoresheetState) => {
    const secondaryRegEx = new RegExp('^Form [1-3].');
    const highSchoolRegEx = new RegExp('^Form [4-5].');
    const classes: {
      class_id: string;
      name: string;
      subjects: ISubjects[];
    }[] = [];

    for (let i = 0; i < scoresheet.selectedScoresheet.classes.length; i++) {
      const temp = scoresheet.selectedScoresheet.classes[i] as IClassname;

      // TODO: Implement this logic in effects or reducer
      if (secondaryRegEx.test(temp.name)) {
        classes.push({
          class_id: temp._id || '',
          name: temp.name,
          subjects: subject.secondarySubjects,
        });
      }
      if (highSchoolRegEx.test(temp.name)) {
        classes.push({
          class_id: temp._id || '',
          name: temp.name,
          subjects: subject.highSchoolSubjects,
        });
      }
    }

    return classes;
  },
);

export const selectChosenScoresheet = createSelector(
  selectScoresheet,
  (state: ScoresheetState) => state.selectedScoresheet,
);

// export const selectScoresheetsByYear = createSelector(selectScoresheet, (state: ScoresheetState) => {
//     const scoresheets: IScoresheet[] = [];
//
//     console.log(state.scoresheets);
//
//     state.scoresheets.forEach((sheet) => {
//       if (sheet.year == year) {
//         scoresheets.push(sheet);
//       }
//     });
//
//     console.log(scoresheets);
//     return scoresheets;
//   });
