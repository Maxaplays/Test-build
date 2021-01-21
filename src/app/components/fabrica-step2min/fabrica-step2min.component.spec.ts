import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaStep2minComponent } from './fabrica-step2min.component';

describe('FabricaStep2minComponent', () => {
  let component: FabricaStep2minComponent;
  let fixture: ComponentFixture<FabricaStep2minComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaStep2minComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaStep2minComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
