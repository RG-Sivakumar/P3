import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GrandLoaderComponent } from './grand-loader.component';

describe('GrandLoaderComponent', () => {
  let component: GrandLoaderComponent;
  let fixture: ComponentFixture<GrandLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrandLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrandLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
