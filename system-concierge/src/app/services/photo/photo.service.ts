import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { IMAGE_MAX_SIZE } from '../../util/constants';
import { Platform } from '@angular/cdk/platform';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoResult } from '../../interfaces/photo-result';
import { PhotoResultStatus } from '../../models/enum/photo-result-status';


@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    constructor(private platform: Platform, private ngxImageCompressService: NgxImageCompressService) { }

    async takePicture(): Promise<PhotoResult> {
        if (this.platform.ANDROID || this.platform.IOS) {
            return await this.takeMobilePicture();
        }
        //Browser
        return await this.takeMobilePicture();
    }

    // -----------------------------------------
    // MOBILE (CAPACITOR)
    // -----------------------------------------

    private async takeMobilePicture(): Promise<PhotoResult> {
        try {
            const photo = await Camera.getPhoto({
                quality: 50,
                resultType: CameraResultType.Base64,
                source: CameraSource.Camera,
            });
            // dataUrl que o compressor precisa
            const imageDataUrl = `data:image/${photo.format};base64,${photo.base64String}`;

            // Orientação padrão
            const orientation = -1;

            // Comprime a imagem
            const compressedImage = await this.ngxImageCompressService.compressFile(
                imageDataUrl,
                orientation,
                50,   // qualidade
                40    // proporção
            );

            // retorna somente o base64 puro, sem o "data:image/jpeg;base64,"
            return {
                status: PhotoResultStatus.SUCCESS,
                base64: compressedImage
            };
        } catch (error) {
            return { status: PhotoResultStatus.ERROR };
        }
    }

}