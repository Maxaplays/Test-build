import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaComponent } from './content-fabrica.component';

describe('ContentFabricaComponent', () => {
  let component: ContentFabricaComponent;
  let fixture: ComponentFixture<ContentFabricaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
