import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadcompleteComponent } from './uploadcomplete.component';

describe('UploadcompleteComponent', () => {
  let component: UploadcompleteComponent;
  let fixture: ComponentFixture<UploadcompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadcompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadcompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
