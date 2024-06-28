import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveScannerPage } from './live-scanner.page';

describe('MrzScannerPage', () => {
  let component: LiveScannerPage;
  let fixture: ComponentFixture<LiveScannerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveScannerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
