import { IClass } from '../interfaces/class.interface';
import { ISubject } from '../interfaces/subject.interface';

export function showClassSubjectWarning(value: IClass): boolean {
  const subjects =
    value.users?.reduce((a, c) => {
      return [...a, ...(c.subjects ?? [])];
    }, [] as ISubject[]) ?? [];

  const count = new Set(subjects.map(({ id }) => id)).size;

  return (value.subjects?.length ?? 0) > count;
}

export function showClassStudentWarning(value: IClass): boolean {
  return (value.students?.length ?? 0) < 1;
}

export function showClassSubjectCountWarning(value: IClass): boolean {
  return (value.subjects?.length ?? 0) < 1;
}

export function showClassWarning(value: IClass): boolean {
  return showClassSubjectWarning(value) || showClassStudentWarning(value) || showClassSubjectCountWarning(value);
}
