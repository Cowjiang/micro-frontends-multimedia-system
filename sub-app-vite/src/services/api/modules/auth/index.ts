import { http } from '@/services';
import { SendEmailCaptchaParams } from '@/services/api/modules/auth/params';

const sendEmailCaptcha = (params: SendEmailCaptchaParams) => http.get('/api/user/email/verification', params)

export default {
  sendEmailCaptcha
}
