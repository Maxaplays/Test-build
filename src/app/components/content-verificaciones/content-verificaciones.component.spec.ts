import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentVerificacionesComponent } from './content-verificaciones.component';

describe('ContentVerificacionesComponent', () => {
  let component: ContentVerificacionesComponent;
  let fixture: ComponentFixture<ContentVerificacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentVerificacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentVerificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
