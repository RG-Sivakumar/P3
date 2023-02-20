import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MediamenuComponent } from './mediamenu.component';

describe('MediamenuComponent', () => {
  let component: MediamenuComponent;
  let fixture: ComponentFixture<MediamenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MediamenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediamenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
