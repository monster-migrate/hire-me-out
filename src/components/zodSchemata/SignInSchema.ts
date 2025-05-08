import { z } from "zod";

const SignInSchema = z.object({
    email: z.string().email({ message: "Enter a valid email address." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

export default SignInSchema;