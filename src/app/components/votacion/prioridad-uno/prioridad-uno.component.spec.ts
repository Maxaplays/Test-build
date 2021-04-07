import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadUnoComponent } from './prioridad-uno.component';

describe('PrioridadUnoComponent', () => {
  let component: PrioridadUnoComponent;
  let fixture: ComponentFixture<PrioridadUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioridadUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioridadUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
