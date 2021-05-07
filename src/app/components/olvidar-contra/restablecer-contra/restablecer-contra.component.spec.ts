import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerContraComponent } from './restablecer-contra.component';

describe('RestablecerContraComponent', () => {
  let component: RestablecerContraComponent;
  let fixture: ComponentFixture<RestablecerContraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestablecerContraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestablecerContraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
