import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShareOptionComponent } from './share-option.component';

describe('ShareOptionComponent', () => {
  let component: ShareOptionComponent;
  let fixture: ComponentFixture<ShareOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
