import { SigninBtn } from "./signinBtn";
import { SignupForm } from "./signupForm";

const Signup = () => {
  return (
    <section className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className=" text-center mb-6 ">
        <h1 className="text-xl md:text-3xl font-bold">Create an account. </h1>
        <p className=" text-sm md:text-lg text-gray-500">Start sketching with your team for free.</p>
      </div>
        <SignupForm/>
        <div className="flex ">
          <p className=" mt-3 text-gray-500 text-sm">
            Already have an account? {<SigninBtn/>}
          </p>
        </div>
    </section>
  );
};

export default Signup;
