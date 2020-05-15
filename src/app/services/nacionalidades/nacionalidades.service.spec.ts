import { TestBed } from '@angular/core/testing';

import { NacionalidadesService } from './nacionalidades.service';

describe('NacionalidadesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NacionalidadesService = TestBed.get(NacionalidadesService);
    expect(service).toBeTruthy();
  });
});
