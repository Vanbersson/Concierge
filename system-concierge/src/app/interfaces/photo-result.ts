import { PhotoResultStatus } from "../models/enum/photo-result-status";

export interface PhotoResult {
  status: PhotoResultStatus;
  base64?: string;
}