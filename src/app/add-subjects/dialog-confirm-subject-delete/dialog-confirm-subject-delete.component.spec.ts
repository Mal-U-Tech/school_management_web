import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmSubjectDeleteComponent } from './dialog-confirm-subject-delete.component';

describe('DialogConfirmSubjectDeleteComponent', () => {
  let component: DialogConfirmSubjectDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmSubjectDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmSubjectDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmSubjectDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
