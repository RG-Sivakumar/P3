import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectFolderAnnotateComponent } from './select-folder-annotate.component';

describe('SelectFolderAnnotateComponent', () => {
  let component: SelectFolderAnnotateComponent;
  let fixture: ComponentFixture<SelectFolderAnnotateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFolderAnnotateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFolderAnnotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
