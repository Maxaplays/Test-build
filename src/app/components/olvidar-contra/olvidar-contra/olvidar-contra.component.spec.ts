import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidarContraComponent } from './olvidar-contra.component';

describe('OlvidarContraComponent', () => {
  let component: OlvidarContraComponent;
  let fixture: ComponentFixture<OlvidarContraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidarContraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidarContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
