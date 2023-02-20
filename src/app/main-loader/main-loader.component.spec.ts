import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainLoaderComponent } from './main-loader.component';

describe('MainLoaderComponent', () => {
  let component: MainLoaderComponent;
  let fixture: ComponentFixture<MainLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
