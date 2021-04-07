import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadConfigComponent } from './prioridad-config.component';

describe('PrioridadConfigComponent', () => {
  let component: PrioridadConfigComponent;
  let fixture: ComponentFixture<PrioridadConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioridadConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioridadConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
