import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep2Component } from './fabrica-step2.component';

describe('FabricaStep2Component', () => {
  let component: FabricaStep2Component;
  let fixture: ComponentFixture<FabricaStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
