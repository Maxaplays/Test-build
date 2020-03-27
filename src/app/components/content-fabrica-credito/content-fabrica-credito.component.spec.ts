import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaCreditoComponent } from './content-fabrica-credito.component';

describe('ContentFabricaCreditoComponent', () => {
  let component: ContentFabricaCreditoComponent;
  let fixture: ComponentFixture<ContentFabricaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
