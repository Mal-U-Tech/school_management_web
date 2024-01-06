import { createSelector } from '@ngrx/store';
import { selectCurrentSchoolClasses, selectCurrentSchoolSubjects } from '../../schools/store/schools.selectors';


export const selectCountOfSubjectClasses = (subject : string) => createSelector(selectCurrentSchoolClasses, (classes) => {
    return classes.filter((c) => (c.subjects?.filter((s) => s.id === subject)?.length ?? 0) > 0).length;
});

export const selectCountOfSubjectStudents = (subject : string) => createSelector(selectCurrentSchoolClasses, (classes) => {
    let countOfStudents : number = 0;
    classes.filter((c) => (c.subjects?.filter((s) => s.id === subject)?.length ?? 0) > 0).forEach((c) => countOfStudents += c.students?.length ?? 0);
    return countOfStudents;
});

export const selectCountOfSubjectTeachers = (subject : string) => createSelector(selectCurrentSchoolSubjects, (subjects) => {
    let countOfTeachers : number = 0;
    (subjects.filter((s) => s.id === subject)).forEach((item) => countOfTeachers += item.teachers?.length ?? 0);
    return countOfTeachers;
});

export const selectDateOfLastUpdate = (subject : string) => createSelector(selectCurrentSchoolSubjects, (subjects) => {
    let stringOfLastUpdated : string = '';
    (subjects.filter((s) => s.id === subject)).forEach((item) => stringOfLastUpdated = item.updated_at.toString().slice(0, 10).replace(/-/g, '/'));
    return stringOfLastUpdated;
});
