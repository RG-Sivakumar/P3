import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FolderMoreComponent } from './folder-more.component';

describe('FolderMoreComponent', () => {
  let component: FolderMoreComponent;
  let fixture: ComponentFixture<FolderMoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
