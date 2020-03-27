import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaPoliticasComponent } from './content-fabrica-politicas.component';

describe('ContentFabricaPoliticasComponent', () => {
  let component: ContentFabricaPoliticasComponent;
  let fixture: ComponentFixture<ContentFabricaPoliticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaPoliticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaPoliticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
