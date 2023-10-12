import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTeacherDialogComponent } from './remove-teacher-dialog.component';

describe('RemoveTeacherDialogComponent', () => {
  let component: RemoveTeacherDialogComponent;
  let fixture: ComponentFixture<RemoveTeacherDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveTeacherDialogComponent]
    });
    fixture = TestBed.createComponent(RemoveTeacherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
