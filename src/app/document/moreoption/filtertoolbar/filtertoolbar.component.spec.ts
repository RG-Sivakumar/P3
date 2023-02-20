import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FiltertoolbarComponent } from './filtertoolbar.component';

describe('FiltertoolbarComponent', () => {
  let component: FiltertoolbarComponent;
  let fixture: ComponentFixture<FiltertoolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltertoolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltertoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
