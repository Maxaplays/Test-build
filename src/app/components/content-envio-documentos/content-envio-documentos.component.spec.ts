import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEnvioDocumentosComponent } from './content-envio-documentos.component';

describe('ContentEnvioDocumentosComponent', () => {
  let component: ContentEnvioDocumentosComponent;
  let fixture: ComponentFixture<ContentEnvioDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentEnvioDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentEnvioDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
