import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotationDeleteComponent } from './annotation-delete.component';

describe('AnnotationDeleteComponent', () => {
  let component: AnnotationDeleteComponent;
  let fixture: ComponentFixture<AnnotationDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
