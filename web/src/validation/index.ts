import { signupSchema } from './auth/signup.validation';
import { loginSchema } from './auth/login.validation';

const VALIDATION = {
    signupValidation: signupSchema,
    loginValidation: loginSchema,
};

export default VALIDATION;
