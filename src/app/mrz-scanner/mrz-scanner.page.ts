import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from 'tesseract.js';


@Component({
  selector: 'app-mrz-scanner',
  templateUrl: './mrz-scanner.page.html',
  styleUrls: ['./mrz-scanner.page.scss'],
})
export class MrzScannerPage  {

  scannedText: string = '';

  constructor() {}

  async scanMrz() {
    try {
      const image = await this.takePicture();
      if (image) {
        this.scannedText = await this.recognizeMRZ(image);
        console.log('MRZ Data:', this.scannedText);
        // Process and display MRZ data
      } else {
        console.error('No image captured');
      }
    } catch (error) {
      console.error('Error scanning MRZ:', error);
    }
  }

  async takePicture(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  }

  async recognizeMRZ(imageDataUrl: string): Promise<string> {
    const result = await Tesseract.recognize(
      imageDataUrl,
      'eng',
      {
        logger: (m: any) => console.log(m)
      }
    );

    return result.data.text;
  }

}
