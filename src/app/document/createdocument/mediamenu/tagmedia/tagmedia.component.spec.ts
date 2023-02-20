import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagmediaComponent } from './tagmedia.component';

describe('TagmediaComponent', () => {
  let component: TagmediaComponent;
  let fixture: ComponentFixture<TagmediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagmediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
