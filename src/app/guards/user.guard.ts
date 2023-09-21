import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectAppUser } from '../store/app.selectors';

export const UserGuardFn: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAppUser).pipe(
    map((user) => {
      if (!user) {
        router.navigate(['login']);
        return false;
      }
      return true;
    }),
  );
};
