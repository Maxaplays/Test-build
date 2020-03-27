import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaComponent } from './fabrica.component';

describe('FabricaComponent', () => {
  let component: FabricaComponent;
  let fixture: ComponentFixture<FabricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
