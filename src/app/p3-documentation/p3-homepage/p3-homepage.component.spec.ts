import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { P3HomepageComponent } from './p3-homepage.component';

describe('P3HomepageComponent', () => {
  let component: P3HomepageComponent;
  let fixture: ComponentFixture<P3HomepageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ P3HomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P3HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
