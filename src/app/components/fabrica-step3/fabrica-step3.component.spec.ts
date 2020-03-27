import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep3Component } from './fabrica-step3.component';

describe('FabricaStep3Component', () => {
  let component: FabricaStep3Component;
  let fixture: ComponentFixture<FabricaStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
