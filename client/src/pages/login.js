import Login from "../components/auth/login";
import { useAuthContext } from "../hooks/useAuthContext";
import { ReactComponent as LogoSVG } from "../assets/Logo.svg";

const LoginPage = () => {
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <div className="bg-white py-8 px-12 rounded-2xl border-2 border-gray-400 flex flex-col justify-center items-center">
        <LogoSVG className=" h-32 mb-5" />
        <h1 className="text-3xl text-center text-gray-700 ">
          للمتابعة ضمن التطبيق
        </h1>
        <h3 className="text-sm text-center text-gray-700 ">
          يرجى تسجيل الدخول عبر:
        </h3>

        <div className="mt-5">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
