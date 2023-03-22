export interface OSSTokenVo {
  token: string;
  downloadDomain: string;
  uploadDomain: string;
  keyPrefix: string;
}

export type TargetTypeName = 'mfms-chat' | 'mfms-material' | 'mfms-temp';
