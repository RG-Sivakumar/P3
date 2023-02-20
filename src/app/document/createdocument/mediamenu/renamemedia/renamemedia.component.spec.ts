import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RenamemediaComponent } from './renamemedia.component';

describe('RenamemediaComponent', () => {
  let component: RenamemediaComponent;
  let fixture: ComponentFixture<RenamemediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RenamemediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenamemediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
