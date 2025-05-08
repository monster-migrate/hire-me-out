type SignUpErrors = {
    fullname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string; // optional for general form errors
};

export default SignUpErrors;