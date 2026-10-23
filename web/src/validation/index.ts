import { signupSchema } from './auth/signup.validation';
import { loginSchema } from './auth/login.validation';
import { forgotPasswordSchema } from './auth/forgot-password.validation';
import { resetPasswordSchema } from './auth/reset-password.validation';
import { personalInfoSchema, passwordChangeSchema } from './settings/settings.validation';

const VALIDATION = {
    signupValidation: signupSchema,
    loginValidation: loginSchema,
    forgotPasswordValidation: forgotPasswordSchema,
    resetPasswordValidation: resetPasswordSchema,
    personalInfoValidation: personalInfoSchema,
    passwordChangeValidation: passwordChangeSchema,
};

export default VALIDATION;

