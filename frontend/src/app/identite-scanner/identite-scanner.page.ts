import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from "tesseract.js";
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './identite-scanner.page.html',
  styleUrls: ['./identite-scanner.page.scss'],
})
export class IdentitePage {
  capturedImage: string | undefined;
  rescaledImage: string | undefined;
  ocrText: string = "";
  imageLoadError: boolean = false;
  firstline: string = "";
  secondline: string = "";
  thirdline: string = "";
  parsedData: any = {};

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
      try {
        const { data: { text } } = await Tesseract.recognize(this.rescaledImage, 'eng', {
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
          psm: Tesseract.PSM.SPARSE_TEXT,
        });
        this.ocrText = text;
        console.log('OCR Text:', this.ocrText);
        this.extractAndCorrectMRZ();
      } catch (error) {
        console.error('Error recognizing MRZ', error);
      }
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
          const targetDPI = 300;
          const originalDPI = 72;
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

extractAndCorrectMRZ() {
    const lines = this.ocrText.split('\n').filter(line => line.trim() !== '');
    if (lines.length >= 3) {
      this.firstline = lines[lines.length - 3];
      this.secondline = lines[lines.length - 2];
      this.thirdline = lines[lines.length - 1];
      this.correctMRZLines();
      this.parsedData = {
        ...this.extractDataFromFirstLine(this.firstline),
        ...this.extractDataFromSecondLine(this.secondline),
        ...this.extractDataFromThirdLine(this.thirdline)
      };
      console.log('Extracted Data:', this.parsedData);
    } else {
      console.error('Insufficient lines for MRZ code');
    }
  }

  correctMRZLines() {
    this.firstline = this.correctFirstLine(this.firstline);
    this.secondline = this.correctSecondLine(this.secondline);
    this.thirdline = this.correctThirdLine(this.thirdline);
    console.log('Corrected First Line:', this.firstline, this.firstline.length);
    console.log('Corrected Second Line:', this.secondline, this.secondline.length);
    console.log('Corrected Third Line:', this.thirdline, this.thirdline.length);
  }

  correctFirstLine(firstline: string): string {
    // Implement TD1-specific corrections for the first line if needed
    return firstline;
  }

  correctSecondLine(secondline: string): string {
    // Implement TD1-specific corrections for the second line if needed
    return secondline; 
  }

  correctThirdLine(thirdline: string): string {
    // Implement TD1-specific corrections for the third line if needed
    return thirdline;
  }

  extractDataFromFirstLine(firstline: string) {
    const documentType = firstline.substring(0, 2).replace(/</g, '');
    const issuingCountry = firstline.substring(2, 5).replace(/</g, '');
    const lastName = firstline.substring(5).split('<<')[0].replace(/</g, ' ');
    const firstName = firstline.split('<<')[1]?.replace(/</g, ' ').trim() ?? '';
    
    return {
      documentType,
      issuingCountry,
      lastName,
      firstName,
    };
  }

  extractDataFromSecondLine(secondline: string) {
    const documentNumber = secondline.substring(0, 9).replace(/</g, '');
    const documentNumberCheckDigit = secondline.substring(9, 10);
    const nationality = secondline.substring(10, 13).replace(/</g, '');
    const dateOfBirth = secondline.substring(13, 19);
    const dateOfBirthCheckDigit = secondline.substring(19, 20);
    const sex = secondline.substring(20, 21);
    const dateOfExpiry = secondline.substring(21, 27);
    const dateOfExpiryCheckDigit = secondline.substring(27, 28);
    const optionalData = secondline.substring(28, 30).replace(/</g, '');
    
    return {
      documentNumber,
      documentNumberCheckDigit,
      nationality,
      dateOfBirth,
      dateOfBirthCheckDigit,
      sex,
      dateOfExpiry,
      dateOfExpiryCheckDigit,
      optionalData,
    };
  }

  extractDataFromThirdLine(thirdline: string) {
    const optionalData2 = thirdline.substring(0, 30).replace(/</g, '');
    
    return {
      optionalData2,
    };
  }
}
