import { http } from '@/services';
import { SendEmailCaptchaParams } from '@/services/api/modules/auth/typings';

const sendEmailCaptcha = (params: SendEmailCaptchaParams) => http.get('/user/email/verification', params)

export default {
  sendEmailCaptcha
}
