import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

const StyleBtn = styled.button`
  font-size: 1.5rem;
  background: red;
  color: white;
`;

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>tracking</span> app
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi
            iusto nostrum quas nisi obcaecati voluptas neque voluptatum sit
            corporis aperiam! Mollitia quia facere sapiente similique deleniti
            temporibus sunt explicabo iure!
          </p>
          <Link to={"/register"} className="btn register-link">
            Register
          </Link>
          <Link to={"/login"} className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="jobify" className="img main-img" />
      </div>
    </Wrapper>
  );
};
export default Landing;
