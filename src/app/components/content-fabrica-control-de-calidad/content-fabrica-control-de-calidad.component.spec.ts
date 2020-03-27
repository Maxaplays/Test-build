import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaControlDeCalidadComponent } from './content-fabrica-control-de-calidad.component';

describe('ContentFabricaControlDeCalidadComponent', () => {
  let component: ContentFabricaControlDeCalidadComponent;
  let fixture: ComponentFixture<ContentFabricaControlDeCalidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaControlDeCalidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaControlDeCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
