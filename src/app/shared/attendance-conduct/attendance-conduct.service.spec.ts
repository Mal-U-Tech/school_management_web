import { TestBed } from '@angular/core/testing';

import { AttendanceConductService } from './attendance-conduct.service';

describe('AttendanceConductService', () => {
  let service: AttendanceConductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceConductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
