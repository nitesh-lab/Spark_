import {useState} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {Navigate, NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { UseParent } from "../Context/ParentProvider";
import NavBar from "../Components/NavBar/NavBar";
import { motion } from "framer-motion"; 
import { Server_Register } from "../Services/user";

export interface signup{
    name: string,
    email: string,
    password: string,
    rePassword: string,
    avatar:FileList|null,
}

function Register(){

    const navigate = useNavigate();
    const [eye, setEye] = useState<boolean>(false);
    const [reEye, setReEye] = useState<boolean>(false);
    const {isDark,token}=UseParent();
    const [loading, setLoading] = useState<boolean>(false);
    const initState = {
        name: "",
        email: "",
        password: "",
        rePassword: "",
        avatar:null,
    };
    const [state, setState] = useState<signup>(initState);

    function handleChangeInput(e:React.ChangeEvent<HTMLInputElement>){
        setState({...state, [e.target.name]: e.target.value});
    }

   function handleChangeFiles(e:React.ChangeEvent<HTMLInputElement>){
        setState({...state,[e.target.name]:e.target.files})
    }

   async function register():Promise<void>{
        setLoading(true);
        try {
            console.log(state);

            if (state.password !== state.rePassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }

           await Server_Register(state);
            toast.success( "Register success!");
            setLoading(false);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error( "Something went wrong!");
        }
    }

    if (token) {
        return <Navigate to='/' />;
    }
    return (
        <div>
         <NavBar />

            <div
className={`bg-[#5c7bd1] mt-[4em] dark:bg-[#4E4F50] w-full h-[100vh] flex items-center relative md:grid-cols-3 `}
               
style={{
            backgroundImage: !isDark? "none" : "url(/images/bg.png)",
      }}>
                         
                <div className='flex md:col-span-2 w-full  items-center justify-center '>
            <div className='bg-[#ffffff]/80 mx-[5%] md:mx-0 w-full mt-9 dark:bg-[#3a3a3a] dark:text-white/70 md:w-auto px-[20px] md:px-[80px] py-[15px] sm:py-[30px] md:py-[40px] rounded-3xl  '>
                      
                        <form
                            className='mt-[13px] sm:mt-[15px] md:mt-[20px] font-bold '
                            onSubmit={(e) => {
                                e.preventDefault();
                                register();
                            }}>
                            {/* name and email */}
                            <div className='grid grid-cols-2 gap-x-2 md:gap-x-3 '>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Name
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='text'
                                        className='w-[8em] sm:w-[12em] md:w-[15em]  input-register rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white '
                                        placeholder='Jack Frost'
                                        name='name'
                                        onChange={(e) => handleChangeInput(e)}
                                        autoComplete="username" 
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Email
                                    </div>
                                    <input
                                        disabled={loading}
                                        type='email'
                                        className='w-[8em] sm:w-[12em] md:w-[15em]  input-register rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white'
                                        placeholder='User@gmail.com'
                                        name='email'
                                        onChange={(e) => handleChangeInput(e)}
                                    />
                                </div>
                            </div>
                            {/* password and confirm password */}
                            <div className='mt-4 md:mt-[25px] grid grid-cols-2 gap-x-2 md:gap-x-3'>
                                {/* Password */}
                                <div className='col-span-1'>
                                    <div className='text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Password
                                    </div>
                                    <div className='flex items-center relative'>
                                        <input
                                            disabled={loading}
                                            type={eye ? "text" : "password"}
                                            className='w-[8em] sm:w-[12em] md:w-[15em]  input-register rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white '
                                            placeholder='Password'
                                            name='password'
                                            autoComplete="current-password" 
                                            onChange={(e) =>
                                                handleChangeInput(e)
                                            }
                                        />
                                        {eye ? (
                                            <AiOutlineEye
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setEye(!eye)}
                                            />
                                        ) : (
                                            <AiOutlineEyeInvisible
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setEye(!eye)}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Confirm password */}
                                <div className='col-span-1'>
                                    <div className='text-[0.8rem] sm:text-sm md:text-[16px] mb-1 md:mb-2'>
                                        Confirm password
                                    </div>
                                    <div className='flex items-center relative'>
                                        <input
                                            disabled={loading}
                                            type={reEye ? "text" : "password"}
                                            className='w-[8em]  sm:w-[12em] md:w-[15em]  input-register rounded-lg p-[0.8em] color:black dark:bg-gray-800 dark:color:white '
                                            placeholder='Password'
                                            name='rePassword'
                                            autoComplete="new-password" 
                                            onChange={(e) =>
                                                handleChangeInput(e)
                                            }
                                        />
                                        {reEye ? (
                                           
                                            <AiOutlineEye
                                                className=' text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setReEye(!reEye)}
                                            />
                                           
                                        ) : (
                                           
                                            <AiOutlineEyeInvisible
                                                className='text-black/20 text-[20px] absolute right-2 cursor-pointer h-full dark:text-white/40'
                                                onClick={() => setReEye(!reEye)}
                                            />
                                           
                                        )}
                                    </div>
                                </div>
                            </div>
                          
                            <div className='mt-4 md:mt-[25px] sm:grid grid-cols-2 gap-x-2 md:gap-x-3'>
                               
                            <div className="text-center col-span-2">
                            <motion.label  initial={{borderRadius:"0%"}}   whileHover={{borderRadius:"50%"}} transition={{duration:1}}
             className=" bg-[#46289A]/80 p-[1em] mt-[0.3em] hover:bg-[#46289A] text-white font-bold text-[1.1rem] my-[5px] rounded-lg"
           htmlFor="avatar"
        >
        Profile
        </motion.label >
        <input 
        type="file" 
        id="avatar" 
        name="avatar" 
        style={{ display: 'none' }} 
        onChange={(e) => {
           handleChangeFiles(e);
        }} 
        />
        </div>

        </div> 
                            <div className="flex justify-center items-center">
                            <motion.button
                             initial={{borderRadius:"0%"}}   whileHover={{borderRadius:"50%"}} transition={{duration:1}}                  
                                className={` mt-[30px] md:mt-[35px] p-[2em] font-extrabold text-[20px] md:text-2xl bg-[#46289A]/80 hover:bg-[#46289A] border text-white py-[8px] md:py-[13px] rounded-[5px]  ${
                                    loading ? "loading" : ""
                                } `}
                                type='submit'
                                disabled={loading}>
                                {loading ? "Loading..." : "Register"}
                            </motion.button>
                            </div>
                        </form>

                        <div className='mt-[8px] md:mt-[16px] text-[13px] md:text-[15px] text-center '>
                            <span className='block md:inline '>
                                If u have an account,{" "}
                            </span>
                            <NavLink
                                to='/login'
                                className='font-bold text-[17px]  '>
                                let's login
                            </NavLink>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
    )
}

export default Register;
