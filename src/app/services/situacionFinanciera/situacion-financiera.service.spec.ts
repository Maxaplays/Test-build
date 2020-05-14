import { TestBed } from '@angular/core/testing';

import { SituacionFinancieraService } from './situacion-financiera.service';

describe('SituacionFinancieraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SituacionFinancieraService = TestBed.get(SituacionFinancieraService);
    expect(service).toBeTruthy();
  });
});
