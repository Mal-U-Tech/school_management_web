import { FormControl, ValidatorFn } from '@angular/forms';

export type FormBuilderMap<T> = {
  [P in keyof T]: [T[P]] | [T[P], ValidatorFn[]]
}

export type FormControlMap<T> = {
  [P in keyof T]: FormControl<T[P] | null>;
};
