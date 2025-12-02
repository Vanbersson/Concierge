import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { IMAGE_MAX_SIZE } from '../../util/constants';


@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    constructor(private ngxImageCompressService: NgxImageCompressService) { }

    async selectPhoto(): Promise<string> {
        try {
            const { image, orientation } = await this.ngxImageCompressService.uploadFile();

            const imageSize = this.ngxImageCompressService.byteCount(image);

            if (imageSize > IMAGE_MAX_SIZE) {
                return "Limit";
            }

            const compressedImage = await this.ngxImageCompressService.compressFile(
                image,
                orientation,
                40,   // qualidade
                40    // proporção
            );

            // Remove prefixo data:image/jpeg;base64,
            const base64Data = compressedImage.includes(',')
                ? compressedImage.split(',')[1]
                : compressedImage;

            return base64Data;
        } catch (err) {

            console.error(err);
            return "Error";
        }
    }
}