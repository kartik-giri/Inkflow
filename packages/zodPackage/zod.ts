import z, { email, minLength, string } from "zod"

export const signUpScheema = z.object({
    username: z.string().min(2, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
    email: z.email({message:"Please enter a valid email address"}),
    password: z.string().min(8, "Password must be at 8 characters")
})