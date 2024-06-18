import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentitePage } from './identite-scanner.page';

describe('QrScannerPage', () => {
  let component: IdentitePage;
  let fixture: ComponentFixture<IdentitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
