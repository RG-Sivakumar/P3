import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkToUrlComponent } from './link-to-url.component';

describe('LinkToUrlComponent', () => {
  let component: LinkToUrlComponent;
  let fixture: ComponentFixture<LinkToUrlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkToUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkToUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
