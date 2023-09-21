import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';
import { UserGuardFn } from './user.guard';


describe('authenticateGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => UserGuardFn(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
