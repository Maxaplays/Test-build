import { TestBed } from '@angular/core/testing';

import { TarjetasTrelloService } from './tarjetas-trello.service';

describe('TarjetasTrelloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TarjetasTrelloService = TestBed.get(TarjetasTrelloService);
    expect(service).toBeTruthy();
  });
});
