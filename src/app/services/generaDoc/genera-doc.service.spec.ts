import { TestBed } from '@angular/core/testing';

import { GeneraDocService } from './genera-doc.service';

describe('GeneraDocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneraDocService = TestBed.get(GeneraDocService);
    expect(service).toBeTruthy();
  });
});
