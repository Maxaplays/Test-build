import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentGestionarPlantillasComponent } from './content-gestionar-plantillas.component';

describe('ContentGestionarPlantillasComponent', () => {
  let component: ContentGestionarPlantillasComponent;
  let fixture: ComponentFixture<ContentGestionarPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentGestionarPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentGestionarPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
