import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAproveComponent } from './user-aprove.component';

describe('UserAproveComponent', () => {
  let component: UserAproveComponent;
  let fixture: ComponentFixture<UserAproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
