import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-mrz-scanner',
  templateUrl: './mrz-scanner.page.html',
  styleUrls: ['./mrz-scanner.page.scss'],
})
export class MrzScannerPage {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  mrzData: string = '';
  capturedImageDataUrl: string | null = null;

  private scanInterval: any;

  ionViewDidEnter() {
    this.initCamera();
    this.startScanning();
  }

  ionViewWillLeave() {
    this.stopScanning();
  }

  initCamera() {
    const video = this.videoElement.nativeElement;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });
  }

  startScanning() {
    this.scanInterval = setInterval(() => {
      this.captureImage();
    }, 10000); // Change the interval to 10 seconds
  }

  stopScanning() {
    clearInterval(this.scanInterval);
    const video = this.videoElement.nativeElement;
    video.pause();
    video.srcObject = null;
  }

  captureImage() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedImageDataUrl = canvas.toDataURL('image/jpeg');
      this.recognizeMRZ();
    }
  }

  recognizeMRZ() {
    if (this.capturedImageDataUrl) {
      Tesseract.recognize(this.capturedImageDataUrl, 'eng', { logger: (m: any) => console.log(m) })
        .then(({ data: { text } }: { data: { text: string } }) => {
          this.mrzData = text;
          console.log('MRZ Data:', this.mrzData);
        });
    }
  }
  /*  data: { text } }: { data: { text: string } } */

  extractMRZ(text: string): string[] {
    const lines = text.split('\n');
    const mrzLines = lines.filter(line => this.isMRZLine(line));
    return mrzLines;
  }

  isMRZLine(line: string): boolean {
    const mrzPattern = /^[A-Z0-9<]{10,44}$/;
    return mrzPattern.test(line.trim());
  }
}
