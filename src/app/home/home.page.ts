import { Component } from "@angular/core";
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from "tesseract.js";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  capturedImage: string | undefined;
  rescaledImage: string | undefined;
  ocrText: string = "";
  imageLoadError: boolean = false;

  constructor() {}

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      this.capturedImage = image.dataUrl;
      this.imageLoadError = false;

      if (this.capturedImage) {
        console.log('Starting OCR process...');
        this.rescaledImage = await this.rescaleImageTo300DPI(this.capturedImage);
        this.recognizeMRZ();
      }
    } catch (error) {
      console.error('Error capturing image', error);
      this.capturedImage = undefined;
      this.imageLoadError = true;
    }
  }

  onImageError() {
    this.capturedImage = undefined;
    this.imageLoadError = true;
  }

  async recognizeMRZ() {
    if (this.rescaledImage) {
      Tesseract.recognize(this.rescaledImage, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<', // MRZ code characters
        psm: Tesseract.PSM.SPARSE_TEXT, // Assume a single uniform block of text
      })
      .then(({ data: { text } }: { data: { text: string } }) => {
        this.ocrText = text;
        console.log('OCR Text:', this.ocrText);
      })
      .catch((error: any) => {
        console.error('Error recognizing MRZ', error);
      });
    }
  }

  async rescaleImageTo300DPI(dataUrl: string): Promise<string> {
    const img = new Image();
    img.src = dataUrl;

    return new Promise<string>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const originalWidth = img.width;
          const originalHeight = img.height;

          // Calculate the new width and height to achieve 300 DPI
          const targetDPI = 300;
          const originalDPI = 72; // Assuming the original DPI is 72
          const scaleFactor = targetDPI / originalDPI;

          const newWidth = originalWidth * scaleFactor;
          const newHeight = originalHeight * scaleFactor;

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          resolve(canvas.toDataURL('image/jpeg'));
        }
      };
    });
  }
}
