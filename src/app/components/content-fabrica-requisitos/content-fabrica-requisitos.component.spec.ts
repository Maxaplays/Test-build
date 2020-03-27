import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaRequisitosComponent } from './content-fabrica-requisitos.component';

describe('ContentFabricaRequisitosComponent', () => {
  let component: ContentFabricaRequisitosComponent;
  let fixture: ComponentFixture<ContentFabricaRequisitosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaRequisitosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaRequisitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
