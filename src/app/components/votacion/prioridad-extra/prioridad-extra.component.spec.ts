import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadExtraComponent } from './prioridad-extra.component';

describe('PrioridadExtraComponent', () => {
  let component: PrioridadExtraComponent;
  let fixture: ComponentFixture<PrioridadExtraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioridadExtraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioridadExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
