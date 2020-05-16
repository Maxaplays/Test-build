import { TestBed } from '@angular/core/testing';

import { ConyugesService } from './conyuges.service';

describe('ConyugesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConyugesService = TestBed.get(ConyugesService);
    expect(service).toBeTruthy();
  });
});
