import { TestBed } from '@angular/core/testing';

import { ParentescoService } from './parentesco.service';

describe('ParentescoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParentescoService = TestBed.get(ParentescoService);
    expect(service).toBeTruthy();
  });
});
