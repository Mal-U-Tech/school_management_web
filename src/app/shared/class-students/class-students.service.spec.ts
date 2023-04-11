import { TestBed } from '@angular/core/testing';

import { ClassStudentsService } from './class-students.service';

describe('ClassStudentsService', () => {
  let service: ClassStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
