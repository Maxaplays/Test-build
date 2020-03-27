import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep4Component } from './fabrica-step4.component';

describe('FabricaStep4Component', () => {
  let component: FabricaStep4Component;
  let fixture: ComponentFixture<FabricaStep4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
