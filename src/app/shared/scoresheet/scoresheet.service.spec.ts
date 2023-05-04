import { TestBed } from '@angular/core/testing';

import { ScoresheetService } from './scoresheet.service';

describe('ScoresheetService', () => {
  let service: ScoresheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoresheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
