import { TestBed } from '@angular/core/testing';

import { ProfesionService } from './profesion.service';

describe('ProfesionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfesionService = TestBed.get(ProfesionService);
    expect(service).toBeTruthy();
  });
});
