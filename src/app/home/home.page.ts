import { Component } from "@angular/core";
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  capturedImage: string | undefined;
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
}
