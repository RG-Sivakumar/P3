import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddMultipleImagesComponent } from './add-multiple-images.component';

describe('AddMultipleImagesComponent', () => {
  let component: AddMultipleImagesComponent;
  let fixture: ComponentFixture<AddMultipleImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMultipleImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMultipleImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
