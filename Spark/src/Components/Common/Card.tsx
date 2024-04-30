import { AiFillHeart, AiOutlineHeart, AiOutlineSend } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";

export default function Card({name}:{name:string}){

    
return(
    <>
<div className="bg-white mx-[5%] rounded-[8%] md:mx-[20%] w-[90%] md:w-[60%] p-[1em] md:p-[1.5em] my-[1rem] dark:bg-Dark dark:text-white  overflow-hidden shadow-lg">
 
 <div className="flex gap-2">
    <img src="/images/bg.png" alt="nope" style={{borderRadius:"50%"}} className=" w-[3em] h-[3em] " />
    <p className="mt-[0.5em]">{name}</p>
 </div>

    <div className="my-[0.8em]">
        <p>Comment</p>
    </div>
 
 <div className="flex justify-between ml-[0.2em] my-[1em]">
  <div className="ml-[0.2em]">
<AiOutlineHeart className='text-[18px] text-[#65676b] inline-block mr-[0.4em]  dark:text-[#afb0b1]' />
                        <span>
                            10 likes
                        </span>
                        </div>
<div className="me-[0.2em]">
10 comments
</div>
</div>

<div className="flex justify-around ml-[1em]">
<div>
          <button
            className=' py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#c22727] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#c22727] transition-50 cursor-pointer  '
                    >
                        <AiFillHeart className='text-xl translate-y-[1px] text-[#c22727] ' />
                        Like
                    </button>
          </div>
          <div>
          <button
            className='py-[6px] px-2 flex items-center justify-center gap-x-1 w-full rounded-sm hover:bg-[#e0e0e0] text-[#6A7583] dark:hover:bg-[#3A3B3C] font-semibold text-[15px] dark:text-[#b0b3b8] transition-50 cursor-pointer '
            >
                    <FiMessageSquare className='text-xl translate-y-[2px] ' />
                    Comment
                </button>
          </div>
 </div>


          <div className='my-[0.8em] flex gap-x-1.5 px-2 sm:px-3 md:px-4 py-1 items-center '>
                <img
                    src="/images/logo.png"
                    alt='user_avatar'
                    className='w-8 sm:w-9 h-8 sm:h-9 object-cover shrink-0 rounded-full '
                />
                <form
                    className='flex px-2 rounded-full bg-[#F0F2F5] w-full mt-1 items-center dark:bg-[#3A3B3C]  '
                    onSubmit={(e) => {
                        e.preventDefault();
                        // addComment(post._id);
                    }}>
                    <input
                        type='text'
                        className='px-2 py-1 sm:py-1.5 border-none focus:ring-0 bg-inherit rounded-full w-full font-medium dark:placeholder:text-[#b0b3b8] '
                        placeholder='Write a comment...'
                    />
                    <button>
                        <AiOutlineSend className='shrink-0 text-xl transition-50 hover:scale-125 dark:text-[#b0b3b8] ' />
                    </button>
                </form>
            </div>
</div>
</>
)
}
       