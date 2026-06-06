import { signupSchema } from './auth/signup.validation';
import { loginSchema } from './auth/login.validation';
import { forgotPasswordSchema } from './auth/forgot-password.validation';
import { resetPasswordSchema } from './auth/reset-password.validation';

const VALIDATION = {
    signupValidation: signupSchema,
    loginValidation: loginSchema,
    forgotPasswordValidation: forgotPasswordSchema,
    resetPasswordValidation: resetPasswordSchema,
};

export default VALIDATION;
