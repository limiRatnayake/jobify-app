import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";

const Error = () => {
  const error = useRouteError();
  console.log(error, "Use router error");
  if (error.status == "404") {
    return (
      <Wrapper>
        <div className="">
          <img src={img} alt="Not Fount" />
          <h3>Ohh! Page Not Found</h3>
          <p>We can't seems to find the page that you are looking for</p>
          <Link to={"./dashboard"}>back home</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper className="">
      <div className="">
        <h1>Something went wrong</h1>
      </div>
    </Wrapper>
  );
};
export default Error;
