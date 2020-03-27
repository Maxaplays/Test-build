import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLoginComponent } from './sidebar-login.component';

describe('SidebarLoginComponent', () => {
  let component: SidebarLoginComponent;
  let fixture: ComponentFixture<SidebarLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
