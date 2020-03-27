import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentExcepcionesComponent } from './content-excepciones.component';

describe('ContentExcepcionesComponent', () => {
  let component: ContentExcepcionesComponent;
  let fixture: ComponentFixture<ContentExcepcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentExcepcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentExcepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
