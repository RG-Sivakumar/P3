import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotationMenuComponent } from './annotation-menu.component';

describe('AnnotationMenuComponent', () => {
  let component: AnnotationMenuComponent;
  let fixture: ComponentFixture<AnnotationMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
