import { http } from '@/services';
import { GetUploadSignatureParam, OSSTokenVo, SendEmailCaptchaParams } from '@/services/api/modules/auth/typings';

// 发送电子邮件验证码
const sendEmailCaptcha = (params: SendEmailCaptchaParams) => http.get('/user/email/verification', params);

// 获取OSS目录上传签名
const getUploadSignature = <T extends GetUploadSignatureParam>(params: T) => http.get<T, OSSTokenVo>('/oss/token', params);

// 获取socket连接凭证
const getSocketToken = () => http.get<void, string>('/socket/connection');

export default {
  sendEmailCaptcha,
  getUploadSignature,
  getSocketToken
};
