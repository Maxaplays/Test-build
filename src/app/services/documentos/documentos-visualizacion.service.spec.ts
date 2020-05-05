import { TestBed } from '@angular/core/testing';

import { DocumentosVisualizacionService } from './documentos-visualizacion.service';

describe('DocumentosVisualizacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentosVisualizacionService = TestBed.get(DocumentosVisualizacionService);
    expect(service).toBeTruthy();
  });
});
