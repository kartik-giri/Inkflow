import { SigninForm } from "./signinForm"

const SignIn = ()=>{
    return (
    <section className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className=" text-center mb-6 ">
        <h1 className="text-3xl font-bold">Welcome back. </h1>
        <p className=" text-gray-500">Sign in to continue sketching on InkFlow.</p>
      </div>
        <SigninForm/>
        <div>
          <p className=" mt-3 font-semibold text-sm">
            Don't have an account?
          </p>
        </div>
    </section>
    )
}

export default SignIn