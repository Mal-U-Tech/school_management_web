import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAppUser } from '../store/app.selectors';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const DashboardGuardFn: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAppUser).pipe(
    map((user) => {
      if (user) {
        router.navigate(['dashboard']);
        return false;
      }
      return true;
    })
  );
};
