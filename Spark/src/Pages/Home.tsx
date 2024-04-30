import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import { UseParent } from "../Context/ParentProvider";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface check{
    data:{
        accessToken:string,
    }
}
export default function Home() {
    const nav=useNavigate();
    const { isDark,dispatch } = UseParent();
    const [initialRender, setInitialRender] = useState(true);
    const {token}=UseParent();
    const navigate=useNavigate();

    useEffect(()=>{
        async function check():Promise<void> {
           const data:check|undefined=await axios.get("http://localhost:3000/user/check",{withCredentials:true});
            dispatch({type:"add",payload:data && data.data && data.data.accessToken ? data.data.accessToken:""});   
        }
        check();
    },[]);

    useEffect(()=>{
        if(token){
            nav("/");
        }

    },[token])


    useEffect(() => {
        setInitialRender(false);
    }, []);

    return (
        <>
            <NavBar />
            
            <motion.div
                className="w-[100%] h-[100%] bg-white text-black"
                animate=  {!initialRender &&  isDark ? { backgroundColor:"#242526",color: "#DDDFE3"}:{ backgroundColor:"#FFFFFF",color: "#000000" }  }
                transition={{ delay: 1, duration: 1 }}
            >
                 <div className='w-screen h-screen '>
                {isDark && (
                     <div
                     style={{backgroundImage: `url('/images/Spark_BG.jpg') `}}
                     className='fixed w-full h-full bottom-0 left-0 opacity-70  object-contain wave'
                   ></div>
                )}


                <div className='top-[13vh] md:top-[15vh] left-10 text-[40px] sm:text-[60px] md:text-[80px] font-semibold z-10 absolute text-[#210028] dark:text-sky-300 raleway '>
                    <motion.p  initial={{x:"-100vh"}}  animate={{x:0}} transition={{delay:2,duration:1,type:"spring",stiffness:300}}  >Spark</motion.p>
                    <motion.div  initial={{x:"-100vh"}}  animate={{x:0}} transition={{delay:2.5,duration:1,type:"spring",stiffness:300}}   className='text-[25px] sm:text-[35px] md:text-[40px] text-pink-600 font-light raleway-light '>
                      Where Everything Starts!
                    </motion.div>
                </div>
                <div className='absolute bottom-16 left-10 md:w-[30%] pr-5 md:pr-0'>
                   
                    {/* <div className='text-[13px] sm:text-base md:text-[18px] '>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Eius sit, laudantium cupiditate esse animi ab ex, iure
                        eveniet provident facilis, similique dignissimos fuga.
                        Nam ex at ipsum quae placeat voluptates.
                    </div> */}
                    <motion.div className=" md:w-[90%] pr-5 md:pr-0">
                    <p className="text-[2rem]">Connect with people around the world and make new friends.</p>

                    </motion.div>

                    <div className='flex gap-x-3 items-center justify-start mt-6 sm:mt-8 md:mt-10 '>
                        <button
                            className='btn-home boxed'
                            onClick={() => {
                                navigate("/login");
                            }}>
                            Login
                        </button>
                        <button
                            className='btn-home boxed'
                            onClick={() => {
                                navigate("/register");
                            }}>
                            Register
                        </button>
                    </div>
                </div>
             </div>        </motion.div>   
        </>
    );
}
