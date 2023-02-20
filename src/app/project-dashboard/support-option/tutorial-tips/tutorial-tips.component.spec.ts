import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutorialTipsComponent } from './tutorial-tips.component';

describe('TutorialTipsComponent', () => {
  let component: TutorialTipsComponent;
  let fixture: ComponentFixture<TutorialTipsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
