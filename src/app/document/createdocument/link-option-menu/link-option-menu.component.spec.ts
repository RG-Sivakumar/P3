import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkOptionMenuComponent } from './link-option-menu.component';

describe('LinkOptionMenuComponent', () => {
  let component: LinkOptionMenuComponent;
  let fixture: ComponentFixture<LinkOptionMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkOptionMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkOptionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
