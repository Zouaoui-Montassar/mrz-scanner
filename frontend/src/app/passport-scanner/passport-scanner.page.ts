import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import * as Tesseract from "tesseract.js";
import { FormBuilder, FormGroup } from '@angular/forms';
import { PassportService } from '../services/passport.service';


@Component({
  selector: 'app-passport-scanner',
  templateUrl: './passport-scanner.page.html',
  styleUrls: ['./passport-scanner.page.scss'],
})
export class PassportScannerPage {
  capturedImage: string | undefined;
  rescaledImage: string | undefined;
  ocrText: string = "";
  imageLoadError: boolean = false;
  firstline: string = "";
  secondline: string = "";
  parsedData: any = {};
  isLoading = false;
  passportForm: FormGroup;


  constructor(private fb: FormBuilder, private passportService: PassportService) {
    this.passportForm = this.fb.group({
      type: [''],
      country: [''],
      surname: [''],
      givenNames: [''],
      passportNumber: [''],
      nationality: [''],
      dateOfBirth: [''],
      sex: [''],
      dateOfExpiry: [''],
      personalNumber: [''],
    });
  }

  ngOnInit() {}

  isValidParsedData(): boolean {
    return this.parsedData && Object.keys(this.parsedData).length > 0;
  }
  
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
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
        this.updateForm();
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
    if (lines.length >= 2) {
      this.firstline = lines[lines.length - 2];
      this.secondline = lines[lines.length - 1];
      this.correctMRZLines();
      this.parsedData = {
        ...this.extractDataFromFirstLine(this.firstline),
        ...this.extractDataFromSecondLine(this.secondline)
      };
      console.log('Extracted Data:', this.parsedData);
    } else {
      console.error('Insufficient lines for MRZ code');
    }
  }

  correctMRZLines() {
    this.firstline = this.correctFirstLine(this.firstline);
    this.secondline = this.correctSecondLine(this.secondline);
    console.log('Corrected First Line:', this.firstline, this.firstline.length);
    console.log('Corrected Second Line:', this.secondline, this.secondline.length);
  }

  correctFirstLine(firstline: string): string {
    firstline = 'P<' + firstline.substring(2);

    const charsToReplace = ['C', 'K', 'L'];
    let consecutiveChars = 0;
    for (let i = 2; i < firstline.length; i++) {

      if (charsToReplace.includes(firstline[i])) {
        consecutiveChars++;
        if (consecutiveChars >= 3) {
          firstline = firstline.substring(0, i - 2) + '<'.repeat(firstline.length - (i - 2));
          break;
        }
      } else {
        consecutiveChars = 0;
      }


    }

    const firstLineEndIndex = firstline.indexOf('<<<<');
    if (firstLineEndIndex !== -1) {
      firstline = firstline.substring(0, firstLineEndIndex + 4).padEnd(firstline.length, '<');
    }

    return firstline;
  }

  correctSecondLine(secondline: string): string {
    return secondline; 
  }

  extractDataFromFirstLine(firstline: string) {
    const type = firstline.charAt(0);
    const country = firstline.substring(2, 5);
    

    let startIndex = 5;
    while (startIndex < firstline.length && firstline.charAt(startIndex) !== '<') {
      startIndex++;
    }
  

    let surname = firstline.substring(5, startIndex).replace(/</g, '');

    let givenNames = '';
    let i = startIndex;
    while (i < firstline.length) {
      if (firstline.charAt(i) === '<') {
        givenNames += ' ';
        i++;
      } else {
        givenNames += firstline.charAt(i);
        i++;
      }
    }

    type.trim();
    country.trim();
    surname = surname.trim();
    givenNames = givenNames.trim();
  
    return {
      type,
      country,
      surname,
      givenNames,
    };
  }
  


  extractDataFromSecondLine(secondline: string) {
    const passportNumber = secondline.substring(0, 9).replace(/</g, '');
    const passportNumberCheckDigit = secondline.substring(9, 10);
    const nationality = secondline.substring(10, 13).replace(/</g, '');
    const dateOfBirth = secondline.substring(13, 19);
    const dateOfBirthCheckDigit = secondline.substring(19, 20);
    let sex = secondline.substring(20, 21);
    const dateOfExpiry = secondline.substring(21, 27);
    const dateOfExpiryCheckDigit = secondline.substring(27, 28);
    const personalNumber = secondline.substring(28, 42).replace(/</g, '');
    const personalNumberCheckDigit = secondline.substring(42, 43);
    const compositeCheckDigit = secondline.substring(43, 44);


    if (sex !== 'F' && sex !== 'M') {
      const before = secondline.substring(19, 20);
      const after = secondline.substring(21, 22);
      if (before === 'F' || before === 'M') {
        sex = before;
      } else if (after === 'F' || after === 'M') {
        sex = after;
      } else {
        sex = '<'; 
      }
    }

    return {
      passportNumber,
      passportNumberCheckDigit,
      nationality,
      dateOfBirth,
      dateOfBirthCheckDigit,
      sex,
      dateOfExpiry,
      dateOfExpiryCheckDigit,
      personalNumber,
      personalNumberCheckDigit,
      compositeCheckDigit,
    };
  }

  formatDate(dateString: string): string {
    const year = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const day = dateString.substring(4, 6);
    return `${day}/${month}/20${year}`;
  }

  updateForm() {
    this.passportForm.setValue({
      type: this.parsedData.type,
      country: this.parsedData.country,
      surname: this.parsedData.surname,
      givenNames: this.parsedData.givenNames,
      passportNumber: this.parsedData.passportNumber,
      nationality: this.parsedData.nationality,
      dateOfBirth: this.parsedData.dateOfBirth,
      sex: this.parsedData.sex,
      dateOfExpiry: this.parsedData.dateOfExpiry,
      personalNumber: this.parsedData.personalNumber,
    });
  }

  saveData() {
    console.log('Saving data:', this.passportForm.value);
    this.passportService.addPassport(this.passportForm.value).subscribe(
      response => {
        console.log('Passport data saved successfully:', response);
      },
      error => {
        console.error('Error saving passport data:', error);
      }
    );
  }

  discardData() {
    console.log('Discarding data');
    this.capturedImage = undefined;
    this.parsedData = {};
    this.passportForm.reset();
  }
}
