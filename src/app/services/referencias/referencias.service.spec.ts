import { TestBed } from '@angular/core/testing';

import { ReferenciasService } from './referencias.service';

describe('ReferenciasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenciasService = TestBed.get(ReferenciasService);
    expect(service).toBeTruthy();
  });
});
