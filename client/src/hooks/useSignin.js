import { useState } from "react";
import { api } from "../components/api";
import { useAuthContext } from "./useAuthContext";

export const useSignin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoding] = useState(null);
  const { dispach } = useAuthContext();

  const signin = async (id_token) => {
    setIsLoding(true);
    setError(null);

    const response = await api.post("/api/users/login", {
      id_token,
    });

    if (response.status !== 200) {
      setIsLoding(false);
      setError(response.error);
    }
    if (response.status === 200) {
      if (response.data.user.user_role === 2) {
        //save username and photo
        localStorage.setItem("user", JSON.stringify(response.data));

        //update auth context
        dispach({ type: "LOGIN", payload: response.data });
        setIsLoding(false);
      } else {
        setError("ليس لديك الصلاحية");
      }
    }
  };
  return { signin, isLoading, error };
};
