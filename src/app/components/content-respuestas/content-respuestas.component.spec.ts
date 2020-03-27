import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentRespuestasComponent } from './content-respuestas.component';

describe('ContentRespuestasComponent', () => {
  let component: ContentRespuestasComponent;
  let fixture: ComponentFixture<ContentRespuestasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentRespuestasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
