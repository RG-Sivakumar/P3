import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SupportSidebarComponent } from './support-sidebar.component';

describe('SupportSidebarComponent', () => {
  let component: SupportSidebarComponent;
  let fixture: ComponentFixture<SupportSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
