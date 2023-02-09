export interface SendEmailCaptchaParams {
  email: string;
}

export type GetUploadSignatureParam = {
  targetTypeName: string
}

export interface OSSTokenVo {
  token: string;
  downloadDomain: string;
  uploadDomain: string;
  keyPrefix: string;
}
