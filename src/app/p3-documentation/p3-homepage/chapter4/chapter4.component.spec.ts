import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Chapter4Component } from './chapter4.component';

describe('Chapter4Component', () => {
  let component: Chapter4Component;
  let fixture: ComponentFixture<Chapter4Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Chapter4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Chapter4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
