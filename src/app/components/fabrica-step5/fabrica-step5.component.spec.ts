import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep5Component } from './fabrica-step5.component';

describe('FabricaStep5Component', () => {
  let component: FabricaStep5Component;
  let fixture: ComponentFixture<FabricaStep5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
