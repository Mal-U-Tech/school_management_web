import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTeachersDialogComponent } from './update-teachers-dialog.component';

describe('UpdateTeachersDialogComponent', () => {
  let component: UpdateTeachersDialogComponent;
  let fixture: ComponentFixture<UpdateTeachersDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateTeachersDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateTeachersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
