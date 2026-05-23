import z, { email, minLength, string } from "zod"

export const signUpScheema = z.object({
    userName: z.string().min(2).max(50),
    email: z.email(),
    password: z.string().min(8)
})