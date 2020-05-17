import { TestBed } from '@angular/core/testing';

import { ArchivosService } from './archivos.service';

describe('ArchivosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchivosService = TestBed.get(ArchivosService);
    expect(service).toBeTruthy();
  });
});
