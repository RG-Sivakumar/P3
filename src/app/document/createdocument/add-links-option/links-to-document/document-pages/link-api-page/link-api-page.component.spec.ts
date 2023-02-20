import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkApiPageComponent } from './link-api-page.component';

describe('LinkApiPageComponent', () => {
  let component: LinkApiPageComponent;
  let fixture: ComponentFixture<LinkApiPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkApiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkApiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
