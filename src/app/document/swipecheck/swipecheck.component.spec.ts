import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SwipecheckComponent } from './swipecheck.component';

describe('SwipecheckComponent', () => {
  let component: SwipecheckComponent;
  let fixture: ComponentFixture<SwipecheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipecheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipecheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
