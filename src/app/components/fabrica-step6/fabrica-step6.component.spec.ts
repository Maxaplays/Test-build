import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep6Component } from './fabrica-step6.component';

describe('FabricaStep6Component', () => {
  let component: FabricaStep6Component;
  let fixture: ComponentFixture<FabricaStep6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
