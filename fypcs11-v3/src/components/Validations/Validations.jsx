import * as yup from 'yup';

export const SignupValidationSchema = yup.object({
    user: yup
    .string('')
    .required('User name is required'),
    connectionString: yup
    .string()
    .required('host:port/sid'),
    password: yup
    .string()
    .required('Password is required'),
    // confirm_password: yup
    // .string()
    // // .required('Confirm Password is required'),
    // confirmPassword: yup
    // .string().oneOf([yup.ref('passWord'), null], 'Password must match').required(),
});

