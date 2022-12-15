import { TestBed } from '@angular/core/testing';

import { SchoolRegApiService } from './school-reg-api.service';

describe('SchoolRegApiService', () => {
  let service: SchoolRegApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolRegApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
