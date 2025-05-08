import { z } from 'zod';

const SignUpSchema = z
    .object({
        fullname: z
            .string({
                required_error: "Full name is required",
            })
            .min(3, { message: "Full name must be at least 3 characters" })
            .max(100, { message: "Full name must be at most 100 characters" })
            .regex(/^[\p{L}\p{M}.'\- ]+$/u, {
                message: "Full name can only contain letters, spaces, apostrophes, and hyphens",
            }),

        email: z
            .string({
                required_error: "Email is required",
            })
            .email({ message: "Invalid email address" }),

        password: z
            .string({
                required_error: "Password is required",
            })
            .min(4, { message: "Password must be at least 8 characters" })
            .max(32, { message: "Password must be at most 32 characters" }),

        confirmPassword: z
            .string({
                required_error: "Please confirm your password",
            })
            .min(4, { message: "Confirm password must be at least 8 characters" })
            .max(32, { message: "Confirm password must be at most 32 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export default SignUpSchema;