import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewimageComponent } from './previewimage.component';

describe('PreviewimageComponent', () => {
  let component: PreviewimageComponent;
  let fixture: ComponentFixture<PreviewimageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
