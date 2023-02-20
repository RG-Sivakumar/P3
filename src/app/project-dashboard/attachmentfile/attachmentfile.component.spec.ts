import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AttachmentfileComponent } from './attachmentfile.component';

describe('AttachmentfileComponent', () => {
  let component: AttachmentfileComponent;
  let fixture: ComponentFixture<AttachmentfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
