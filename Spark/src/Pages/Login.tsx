import { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import { UseParent } from "../Context/ParentProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { motion } from "framer-motion";
import { ServerLogin, ServerLogin_Google } from "../Services/user";

export interface log {
  email: string,
  password: string,
  checked:boolean,
}

export default function Login() {
  const { isDark } = UseParent();

  const [eye, setEye] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
    const {dispatch}=UseParent();
    const nav=useNavigate();
    const [state, setState] = useState<log>({
    email: "",
    password: "",
    checked:false,
  });

  async function login(): Promise<void> {
    setLoading(true);
    try {
       const token=await ServerLogin(state);
       dispatch({type:"add",payload:token});
       if(token && token?.length>0){
      toast.success("Login success.");
       }
     setTimeout(()=>{
      nav("/");
     },2000)
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error( "Something went wrong!");
      setLoading(false);
    }
  }

  async function login_google() {
    setLoading(true);
    try {
        await ServerLogin_Google();
        setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  }


  function handleChange(e: React.ChangeEvent<HTMLInputElement>){
   
    setState((prevState) => ({...prevState,[e.target.name]:e.target.value,}));
  }

function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
    setState((prevState) => ({
      ...prevState,
      checked: e.target.checked,
    }));
  }
  return (
    <>
      <div>
        <NavBar />
        <div className="pt-12 bg-[#FEDCC5] dark:bg-[#4E4F50] h-screen w-screen flex items-center relative transition-50 ">
          <div className="fixed z-0 bottom-0">
            <img
              src="/images/chicken-bg.png"
              alt="bg"
              className="h-[100vh] w-auto object-cover "
            />
          </div>

          <div className="w-full md:w-[80%] mx-auto flex items-center justify-center  md:justify-between z-[1] md:mt-4 ">
            <div className="bg-[#FEE7D6] mt-[0.3em] overflow-y-hidden  dark:bg-[#3a3a3a] dark:text-white w-[12em] md:w-auto px-[20px] md:px-[80px] py-[30px] md:py-[40px] rounded-3xl ">
              <form
                className="md:mt-[20px] "
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <div className="">
                  <div className="mt-[0.5em] text-sm md:text-[16px] mb-2">
                    Email
                  </div>
                  <input
                    type="email"
                    className="w-[9em] sm:w-[12em] md:w-[15em] input-login rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white "
                    placeholder="User@gmail.com"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-[25px]">
                  <div className="text-sm md:text-[16px] mb-2">Password</div>
                  <div className="flex items-center relative">
                    <input
                      type={eye ? "text" : "password"}
                      className=" w-[9em] sm:w-[12em] md:w-[15em] input-login rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white  "
                      placeholder="Password"
                      name="password"
                      value={state.password}
                      onChange={handleChange}
                    />
                    {eye ? (
                      <AiOutlineEye
                        className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                        onClick={() => setEye(!eye)}
                      />
                    ) : (
                      <AiOutlineEyeInvisible
                        className="text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40"
                        onClick={() => setEye(!eye)}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-[12px] md:mt-[17px] text-[13px] cursor-pointer font-normal flex justify-between items-center ">
                  <span>
                    Remember{" "}
                    <input
                      type="checkbox"
                        
                      className="rounded-lg text-black dark:text-white p-[0.8em] ring-[#F25019] checked:bg-[#F25019]"
                      checked={state.checked}
                      onChange={handleCheck}
                    />
                  </span>
                </div>
                <button
                  className={`mt-[35px] md:mt-[35px] w-full font-extrabold text-[20px] md:text-2xl bg-[#F25019] text-white py-[8px] md:py-[13px] rounded-[5px] ${
                    loading ? "loading" : ""
                  } flex items-center justify-center `}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <ReactLoading
                      type="bubbles"
                      width={32}
                      height={32}
                      color="white"
                    />
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>
              <div className="mt-[15px] md:mt-[30px] font-normal text-[13px] text-center ">
                or continue with
              </div>
              <div className="mt-[8px] md:mt-[16px] flex items-center justify-center  gap-x-[11px] shrink-1 ">
                <motion.div
                  whileHover={{ scale: 1.8, originX: 0 }}
                  transition={{ duration: 0.5 }}
                  className="icon-login "
                  role="button"
                  onClick={()=>login_google()}
               >
                  <img
                    src="/images/icon-gg.png"
                    alt="icon-gg"
                    className=" w-[1.5em] md:w-[1.8em] h-auto rounded-full"
                  />
                </motion.div>
              </div>
              <div className="mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center ">
                <span className="block md:inline ">
                  Don't have an account yet?{" "}
                </span>
                <NavLink
                  to={"/register"}
                  role="button"
                  className="hover:scale-110 text-[0.8rem] sm:text-[18px] font-bold "
                >
                  Register for free
                </NavLink>
              </div>
            </div>
            <img
              src={`/images/${isDark ? "chicken.png" : "chicken-dark.png"}`}
              alt="chicken"
              className="w-[50%]  h-auto object-cover  md:inline "
            />
          </div>
        </div>
      </div>
    </>
  );
}
