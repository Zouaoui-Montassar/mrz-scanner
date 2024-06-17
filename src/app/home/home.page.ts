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
  imageLoadError: boolean = false;
  mrzData: string = "";

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

  recognizeMRZ() {
    if (this.capturedImage) {
      Tesseract.recognize(this.capturedImage, 'eng', {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<', // MRZ code characters
        psm: Tesseract.PSM.SINGLE_BLOCK, // Assume a single uniform block of text
      })
      .then(({ data: { text } }: { data: { text: string } }) => {
        // Get the last two non-empty lines
        console.log(text);
        const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
        const lastLines = lines.slice(-2);

        // Correct filler characters in the MRZ code
        const correctedLines = this.correctFillerCharacters(lastLines);

        // Join the corrected lines into the final MRZ code
        this.mrzData = correctedLines.join('\n');
        console.log('Corrected MRZ code:', this.mrzData);
      })
      .catch((error: any) => {
        console.error('Error recognizing MRZ', error);
      });
    }
  }

  correctFillerCharacters(lines: string[]): string[] {
    // Define the expected lengths for each field in the MRZ TD3 code
    const fieldLengths = [1, 9, 15, 30, 7, 7, 1, 14, 1, 14, 7];

    return lines.map(line => {
      // Split the line into individual characters
      const characters = line.split('');

      // Iterate over the characters and correct filler characters based on the expected lengths
      characters.forEach((char, index) => {
        const expectedLength = fieldLengths[index];
        if (char === 'L' && characters.slice(index, index + expectedLength).every(c => c === '<')) {
          // Replace 'L' with '<' if it appears in a sequence of '<' characters
          characters[index] = '<';
        }
      });

      // Join the characters back into a string
      return characters.join('');
    });
  }

}
