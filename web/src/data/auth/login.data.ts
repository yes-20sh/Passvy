import { LoginField } from '@/interfaces/auth/login.interface';

export const loginFields: LoginField[] = [
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'name@example.com',
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
  },
];
