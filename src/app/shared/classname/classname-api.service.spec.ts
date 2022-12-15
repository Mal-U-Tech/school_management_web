import { TestBed } from '@angular/core/testing';

import { ClassnameApiService } from './classname-api.service';

describe('ClassnameApiService', () => {
  let service: ClassnameApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassnameApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
