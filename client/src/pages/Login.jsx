import {
  Form,
  redirect,
  Link,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitBtn } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loginFormAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const errors = { msg: "" };
    if (data.password.length < 3) {
      errors.msg = "password too short";
      return errors;
    }
    try {
      await customFetch.post("/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful");
      return redirect("/dashboard");
    } catch (error) {
      console.log(error);
      // toast.error(error?.response?.data?.msg);
      errors.msg = error?.response?.data?.msg;
      return errors;
    }
  };
const Login = () => {
  const errors = useActionData(); //useActionData can be used to add custom validation or other functionalities
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      await customFetch.post("/auth/login", data);
      toast.success("Take a test run!!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <Wrapper className="">
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type={"email"} name={"email"} labelText={"Email"} />
        <FormRow type={"password"} name={"password"} labelText={"Password"} />
        {errors?.msg && <p style={{ color: "red" }}>{errors?.msg}</p>}
        <SubmitBtn />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          Explore the App
        </button>
        <p>
          Not a member yet?
          <Link to={"/register"} className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
