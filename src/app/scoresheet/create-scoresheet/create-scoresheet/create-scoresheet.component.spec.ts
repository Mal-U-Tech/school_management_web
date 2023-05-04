import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScoresheetComponent } from './create-scoresheet.component';

describe('CreateScoresheetComponent', () => {
  let component: CreateScoresheetComponent;
  let fixture: ComponentFixture<CreateScoresheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateScoresheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScoresheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
