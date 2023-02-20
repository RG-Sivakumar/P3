import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewimagedownloadpopupComponent } from './previewimagedownloadpopup.component';

describe('PreviewimagedownloadpopupComponent', () => {
  let component: PreviewimagedownloadpopupComponent;
  let fixture: ComponentFixture<PreviewimagedownloadpopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewimagedownloadpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewimagedownloadpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
