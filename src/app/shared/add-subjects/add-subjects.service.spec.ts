import { TestBed } from '@angular/core/testing';

import { AddSubjectsService } from './add-subjects.service';

describe('AddSubjectsService', () => {
  let service: AddSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
