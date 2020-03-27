import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionesComponent } from './verificaciones.component';

describe('VerificacionesComponent', () => {
  let component: VerificacionesComponent;
  let fixture: ComponentFixture<VerificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
