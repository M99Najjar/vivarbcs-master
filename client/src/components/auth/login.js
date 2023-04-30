import { useEffect } from "react";
import { useSignin } from "../../hooks/useSignin";
import ErrorsBox from "../form/ErrorsBox";

const Login = () => {
  const { signin, error, isLoading } = useSignin();

  const handleCredentialResponse = async (response) => {
    const id_token = response.credential;
    signin(id_token);
  };
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );

    //google.accounts.id.prompt();
  }, []);

  return (
    <>
      <div id="buttonDiv"></div>
      <div className=" m-3" />
      <ErrorsBox errors={error} />
    </>
  );
};

export default Login;
