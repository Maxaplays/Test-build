import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentConsultaGeneralComponent } from './content-consulta-general.component';

describe('ContentConsultaGeneralComponent', () => {
  let component: ContentConsultaGeneralComponent;
  let fixture: ComponentFixture<ContentConsultaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentConsultaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentConsultaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
