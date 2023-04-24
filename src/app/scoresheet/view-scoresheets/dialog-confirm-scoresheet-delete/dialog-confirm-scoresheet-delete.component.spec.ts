import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmScoresheetDeleteComponent } from './dialog-confirm-scoresheet-delete.component';

describe('DialogConfirmScoresheetDeleteComponent', () => {
  let component: DialogConfirmScoresheetDeleteComponent;
  let fixture: ComponentFixture<DialogConfirmScoresheetDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmScoresheetDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmScoresheetDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
