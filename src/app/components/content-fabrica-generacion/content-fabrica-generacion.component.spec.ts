import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaGeneracionComponent } from './content-fabrica-generacion.component';

describe('ContentFabricaGeneracionComponent', () => {
  let component: ContentFabricaGeneracionComponent;
  let fixture: ComponentFixture<ContentFabricaGeneracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaGeneracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaGeneracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
