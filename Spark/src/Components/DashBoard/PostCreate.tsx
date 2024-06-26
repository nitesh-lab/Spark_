import { FaVideo } from 'react-icons/fa';
import { MdPhoto } from 'react-icons/md';
import { UseParent, user_data } from '../../Context/ParentProvider';

interface PostCreateProps {
    setmodal: React.Dispatch<React.SetStateAction<boolean>>;
}

function PostCreate({ setmodal,setisVideoopen}: (PostCreateProps&{setisVideoopen:React.Dispatch<React.SetStateAction<boolean>>} )){

    const { isDark,user }:{isDark:boolean,user:user_data|object} = UseParent();

    return (
        <div className={`dark:bg-[#242526] dark:text-white w-[90%] mx-[auto] mt-[1em] z-1 bg-white mb-5 pt-3 rounded-lg px-2 md:px-4 ${!isDark ? "shadow-post" : ""}`}>
            <div className='flex items-center gap-x-2'>
                {/* Load image here */}
                <div className='dark:bg-[#4E4F50]/70 dark:hover:bg-[#4E4F50] rounded-full px-4 py-[9px] w-[90%] flex justify-start dark:text-[#b0b3b8] font-medium transition-20 h-10 cursor-pointer text-[#65676b] bg-[#E4E6E9]/60 hover:bg-[#E4E6E9]' onClick={() => { setmodal((s: boolean) => !s); }}>
                    <div className='mr-2 overflow-hidden text-overflow-ellipsis'>
                        What's on your mind, {`${"name" in user && user.name?user.name.toLowerCase():""}`}
                    </div>
                </div>
            </div>

            <div className={`mt-3 flex items-center justify-between gap-x-2 border-t dark:border-t-[#3a3a3a] border-t-[#bbb9b9] py-1 text-[15px]`}>
                <button className='flex items-center justify-center w-full gap-x-2 dark:text-[#b0b3b8] text-[#65676b] hover:bg-[#F2F2F2] font-semibold py-2 transition-20 dark:hover:bg-[#4E4F50] rounded-lg' onClick={() => setisVideoopen(true)}>
                    <FaVideo className='text-[#f3425f] text-[22px]'  /> Video
                </button>

                <button  className='flex items-center justify-center w-full gap-x-2 dark:text-[#b0b3b8] text-[#65676b] hover:bg-[#F2F2F2] font-semibold py-2 transition-20 dark:hover:bg-[#4E4F50] rounded-lg' onClick={() => setmodal(true)}>
                    <MdPhoto className='text-[#45bd62] text-[22px]' /> Photo
                </button>
            </div>
        </div>
    );
}

export default PostCreate;
