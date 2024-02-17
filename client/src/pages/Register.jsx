import { Form, redirect, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const registerFormAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration successful");
    return redirect("/login");
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};
const Register = () => {
  return (
    <Wrapper className="">
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          type={"text"}
          name={"name"}
          labelText={"Name"}
        />
        <FormRow
          type={"text"}
          name={"lastName"}
          labelText={"Last Name"}
        />
        <FormRow
          type={"text"}
          name={"location"}
          labelText={"Location"}
        />

        <FormRow
          type={"email"}
          name={"email"}
          labelText={"Email"}
        />
        <FormRow
          type={"password"}
          name={"password"}
          labelText={"Password"}
        />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to={"/login"} className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
