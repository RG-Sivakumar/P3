import { TestBed } from '@angular/core/testing';

import { LazyLoadScriptService } from './lazy-load-script.service';

describe('LazyLoadScriptService', () => {
  let service: LazyLoadScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LazyLoadScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
