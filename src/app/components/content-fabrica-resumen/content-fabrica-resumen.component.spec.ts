import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaResumenComponent } from './content-fabrica-resumen.component';

describe('ContentFabricaResumenComponent', () => {
  let component: ContentFabricaResumenComponent;
  let fixture: ComponentFixture<ContentFabricaResumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaResumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
