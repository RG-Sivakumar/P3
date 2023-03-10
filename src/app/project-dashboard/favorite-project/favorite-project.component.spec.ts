import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FavoriteProjectComponent } from './favorite-project.component';

describe('FavoriteProjectComponent', () => {
  let component: FavoriteProjectComponent;
  let fixture: ComponentFixture<FavoriteProjectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
