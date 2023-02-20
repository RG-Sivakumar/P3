import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChapterModelComponent } from './chapter-model.component';

describe('ChapterModelComponent', () => {
  let component: ChapterModelComponent;
  let fixture: ComponentFixture<ChapterModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
