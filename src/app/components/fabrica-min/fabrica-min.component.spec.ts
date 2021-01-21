import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricaMinComponent } from './fabrica-min.component';

describe('FabricaMinComponent', () => {
  let component: FabricaMinComponent;
  let fixture: ComponentFixture<FabricaMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricaMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricaMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
