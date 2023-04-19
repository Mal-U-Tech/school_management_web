import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmScoresheetModulesCreatedComponent } from './confirm-scoresheet-modules-created.component';

describe('ConfirmScoresheetModulesCreatedComponent', () => {
  let component: ConfirmScoresheetModulesCreatedComponent;
  let fixture: ComponentFixture<ConfirmScoresheetModulesCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmScoresheetModulesCreatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmScoresheetModulesCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
