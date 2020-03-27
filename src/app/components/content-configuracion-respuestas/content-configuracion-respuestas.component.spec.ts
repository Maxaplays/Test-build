import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentConfiguracionRespuestasComponent } from './content-configuracion-respuestas.component';

describe('ContentConfiguracionRespuestasComponent', () => {
  let component: ContentConfiguracionRespuestasComponent;
  let fixture: ComponentFixture<ContentConfiguracionRespuestasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentConfiguracionRespuestasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentConfiguracionRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
