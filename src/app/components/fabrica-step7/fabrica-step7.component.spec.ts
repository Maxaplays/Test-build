import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep7Component } from './fabrica-step7.component';

describe('FabricaStep7Component', () => {
  let component: FabricaStep7Component;
  let fixture: ComponentFixture<FabricaStep7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
