import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentFabricaMinComponent } from './content-fabrica-min.component';

describe('ContentFabricaMinComponent', () => {
  let component: ContentFabricaMinComponent;
  let fixture: ComponentFixture<ContentFabricaMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentFabricaMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentFabricaMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
