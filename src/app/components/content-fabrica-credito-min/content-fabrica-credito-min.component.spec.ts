import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaCreditoMinComponent } from './content-fabrica-credito-min.component';

describe('ContentFabricaCreditoMinComponent', () => {
  let component: ContentFabricaCreditoMinComponent;
  let fixture: ComponentFixture<ContentFabricaCreditoMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaCreditoMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaCreditoMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
