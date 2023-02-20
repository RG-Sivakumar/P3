import { TestBed } from '@angular/core/testing';

import { DevadminService } from './devadmin.service';

describe('DevadminService', () => {
  let service: DevadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
