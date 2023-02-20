import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageDisplyTestComponent } from './image-disply-test.component';

describe('ImageDisplyTestComponent', () => {
  let component: ImageDisplyTestComponent;
  let fixture: ComponentFixture<ImageDisplyTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDisplyTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDisplyTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
