import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentLoginComponent } from './content-login.component';

describe('ContentLoginComponent', () => {
  let component: ContentLoginComponent;
  let fixture: ComponentFixture<ContentLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
