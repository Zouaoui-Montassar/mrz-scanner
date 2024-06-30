import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from 'tesseract.js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-identite-scanner',
  templateUrl: './identite-scanner.page.html',
  styleUrls: ['./identite-scanner.page.scss'],
})
export class IdentitePage {
  capturedImage: string | undefined;
  rescaledImage: string | undefined;
  ocrText: string = '';
  imageLoadError: boolean = false;
  parsedData: any = {};
  idCardForm: FormGroup;
  isLoading = false;
  constructor(private formBuilder: FormBuilder) {
    this.idCardForm = this.formBuilder.group({
      type: [''],
      issuingCountry: [''],
      lastName: [''],
      firstName: [''],
      documentNumber: [''],
      nationality: [''],
      dateOfBirth: [''],
      sex: [''],
      dateOfExpiry: [''],
      optionalData: [''],
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
      });

      this.capturedImage = image.dataUrl;
      this.imageLoadError = false;
      this.isLoading= true;
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
        this.isLoading= false;
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
      const firstline = lines[lines.length - 3];
      const secondline = lines[lines.length - 2];
      const thirdline = lines[lines.length - 1];
      
      this.parsedData = {
        ...this.extractDataFromFirstLine(firstline),
        ...this.extractDataFromSecondLine(secondline),
        ...this.extractDataFromThirdLine(thirdline)
      };
      console.log('Extracted Data:', this.parsedData);


      this.idCardForm.patchValue({
        type: this.parsedData.documentType,
        issuingCountry: this.parsedData.issuingCountry,
        lastName: this.parsedData.lastName,
        firstName: this.parsedData.firstName,
        documentNumber: this.parsedData.documentNumber,
        nationality: this.parsedData.nationality,
        dateOfBirth: this.parsedData.dateOfBirth,
        sex: this.parsedData.sex,
        dateOfExpiry: this.parsedData.dateOfExpiry,
        optionalData: this.parsedData.optionalData,
      });
    } else {
      console.error('Insufficient lines for MRZ code');
    }
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
    const optionalData = secondline.substring(28, 30).replace(/</g, ' ');
    
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
    const optionalData2 = thirdline.substring(0, 30).replace(/</g, ' ');
    
    return {
      optionalData2,
    };
  }
  saveData() {
    console.log('Saving data:', this.idCardForm.value);
  }

  discardData() {
    console.log('Discarding data');
    this.capturedImage = undefined;
    this.parsedData = {};
    this.idCardForm.reset();
  }
}
