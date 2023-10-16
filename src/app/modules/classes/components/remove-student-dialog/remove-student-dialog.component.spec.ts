import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveStudentDialogComponent } from './remove-student-dialog.component';

describe('RemoveStudentDialogComponent', () => {
  let component: RemoveStudentDialogComponent;
  let fixture: ComponentFixture<RemoveStudentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveStudentDialogComponent]
    });
    fixture = TestBed.createComponent(RemoveStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
