import { prisma } from "@repo/db";
import bcrypt from "bcrypt"
import { signUpScheema } from "@repo/zodPackage"

export const signUpAction = async (formData: FormData) => {
    const raw = {
        userName: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    const result = signUpScheema.safeParse(raw);

    if (!result.success){
        // return{
        //     error: result.error
        // }
    }
    const {userName, email, password} = result.data
    if (!password) {
        return
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        await prisma.user.create({
            data: {
                username: userName,
                email: email,
                password: hashedPassword
            }
        })
    } catch (e) {
        // return {
        //     error: `${e} error occured while sign up!`
        // }
    }
}