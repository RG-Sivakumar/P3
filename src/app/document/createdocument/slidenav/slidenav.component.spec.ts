import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SlidenavComponent } from './slidenav.component';

describe('SlidenavComponent', () => {
  let component: SlidenavComponent;
  let fixture: ComponentFixture<SlidenavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
