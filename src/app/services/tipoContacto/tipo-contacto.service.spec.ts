import { TestBed } from '@angular/core/testing';

import { TipoContactoService } from './tipo-contacto.service';

describe('TipoContactoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipoContactoService = TestBed.get(TipoContactoService);
    expect(service).toBeTruthy();
  });
});
