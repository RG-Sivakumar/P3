import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewToolbarComponent } from './preview-toolbar.component';

describe('PreviewToolbarComponent', () => {
  let component: PreviewToolbarComponent;
  let fixture: ComponentFixture<PreviewToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
