import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextAnnotationComponent } from './text-annotation.component';

describe('TextAnnotationComponent', () => {
  let component: TextAnnotationComponent;
  let fixture: ComponentFixture<TextAnnotationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAnnotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
