import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentControlDeCalidadComponent } from './content-control-de-calidad.component';

describe('ContentControlDeCalidadComponent', () => {
  let component: ContentControlDeCalidadComponent;
  let fixture: ComponentFixture<ContentControlDeCalidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentControlDeCalidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentControlDeCalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
