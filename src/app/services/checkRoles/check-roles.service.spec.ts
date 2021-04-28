import { TestBed } from '@angular/core/testing';

import { CheckRolesService } from './check-roles.service';

describe('CheckRolesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckRolesService = TestBed.get(CheckRolesService);
    expect(service).toBeTruthy();
  });
});
