import { TestBed } from '@angular/core/testing';

import { PassControlsService } from './pass-controls.service';

describe('PassControlsService', () => {
  let service: PassControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
