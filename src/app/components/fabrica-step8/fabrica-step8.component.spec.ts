import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep8Component } from './fabrica-step8.component';

describe('FabricaStep8Component', () => {
  let component: FabricaStep8Component;
  let fixture: ComponentFixture<FabricaStep8Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep8Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
