import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaSolicitudCreditoComponent } from './content-fabrica-solicitud-credito.component';

describe('ContentFabricaSolicitudCreditoComponent', () => {
  let component: ContentFabricaSolicitudCreditoComponent;
  let fixture: ComponentFixture<ContentFabricaSolicitudCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaSolicitudCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaSolicitudCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
