import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDeCalidadComponent } from './control-de-calidad.component';

describe('ControlDeCalidadComponent', () => {
  let component: ControlDeCalidadComponent;
  let fixture: ComponentFixture<ControlDeCalidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlDeCalidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDeCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
