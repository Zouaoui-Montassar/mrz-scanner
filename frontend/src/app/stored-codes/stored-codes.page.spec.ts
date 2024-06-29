import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoredCodesPage } from './stored-codes.page';

describe('StoredCodesPage', () => {
  let component: StoredCodesPage;
  let fixture: ComponentFixture<StoredCodesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StoredCodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
