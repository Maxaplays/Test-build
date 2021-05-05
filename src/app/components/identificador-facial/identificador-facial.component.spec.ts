import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificadorFacialComponent } from './identificador-facial.component';

describe('IdentificadorFacialComponent', () => {
  let component: IdentificadorFacialComponent;
  let fixture: ComponentFixture<IdentificadorFacialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificadorFacialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificadorFacialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
