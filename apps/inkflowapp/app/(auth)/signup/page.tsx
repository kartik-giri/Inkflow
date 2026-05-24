import { SignupForm } from "./signupForm";

const Signup = () => {
  return (
    <section className=" w-full min-h-screen flex flex-col justify-center items-center ">
      <div className=" text-center mb-6 ">
        <h1 className="text-3xl font-bold">Create an account. </h1>
        <p className=" text-gray-500">Start sketching with your team for free.</p>
      </div>
        <SignupForm/>
        <div>
          <p className=" mt-3 font-semibold text-sm">
            Already have an account?
          </p>
        </div>
    </section>
  );
};

export default Signup;
