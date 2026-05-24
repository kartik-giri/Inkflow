import { SigninForm } from "./signinForm"
import { SignupBtn } from "./signupBtn"

const SignIn = ()=>{
    return (
    <section className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className=" text-center mb-6 ">
        <h1 className="text-xl md:text-3xl font-bold">Welcome back. </h1>
        <p className=" text-sm md:text-lg text-gray-500">Sign in to continue sketching on InkFlow.</p>
      </div>
        <SigninForm/>
        <div>
          <p className=" mt-3 text-gray-500  text-sm">
            Don't have an account? <SignupBtn/>
          </p>
        </div>
    </section>
    )
}

export default SignIn