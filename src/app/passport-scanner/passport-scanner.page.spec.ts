import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassportScannerPage } from './passport-scanner.page';

describe('PassportScannerPage', () => {
  let component: PassportScannerPage;
  let fixture: ComponentFixture<PassportScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
