import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetBaseIconsizeComponent } from './set-base-iconsize.component';

describe('SetBaseIconsizeComponent', () => {
  let component: SetBaseIconsizeComponent;
  let fixture: ComponentFixture<SetBaseIconsizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SetBaseIconsizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBaseIconsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
