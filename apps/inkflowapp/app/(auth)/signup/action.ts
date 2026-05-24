"use server"
import { prisma } from "@repo/db";
import bcrypt from "bcrypt"
import { signUpScheema } from "@repo/zodPackage"

export const signUpAction = async (prevState:any,formData: FormData) => {
    const raw = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string
    }

    const result = signUpScheema.safeParse(raw);

    if (!result.success){
        return{
            error: result.error.issues[0].message
        }
    }
    const {username, email, password} = result.data
    if (!password) {
        return
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        })
        return {
            success: "Account created successfully"
        }
    } catch (e) {
        console.log("Error ocured while signup", e)
        return {
            error: `User already exists with same user name or email!`
        }
    }
}