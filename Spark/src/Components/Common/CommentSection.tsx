import axios from "axios";
import { useEffect, useState } from "react";

interface obj {
    avatar: string;
    comment: string;
    Uid: string;
    name:string;
}

export default function CommentSection({ SetshowComment, id }: { SetshowComment?: React.Dispatch<React.SetStateAction<boolean>>, id: string }) {

    const [comments, setComments] = useState<obj[]>([]);

    useEffect(() => {
        async function getAllComments() {
            if (id) {
                const data = await axios.post("https://spark-9j9e.onrender.com/api/post/getAllComments", { post_id: id }, { withCredentials: true });
                setComments(data.data.user);
            }
        }
        getAllComments();
    }, [id]);

    if(comments.length==0){  
return (
<div className="fixed z-50 top-[5%] bottom-[5%] left-[10%] 
right-[10%] sm:top-[10%] sm:bottom-[10%] sm:left-[15%] sm:right-[15%]
 md:top-[10%] md:bottom-[10%] md:left-[25%] md:right-[25%] bg-[#242526]   inset-0 flex items-center justify-center">
<div className="absolute top-0 right-0 p-2 z-[1000]">
                <button onClick={() => SetshowComment && SetshowComment(false)} className="text-white font-bold text-[1rem]  mr-[1em] md:text-[1.5rem] focus:outline-none">
                    X
                </button>
            </div>
        <div>
            <p className="text-white font-semibold">No comments to Show.</p>
        </div>
</div>)
    }

    return (
        <>
        <div className="fixed z-50 top-[5%] bottom-[5%] left-[10%] right-[10%] sm:top-[10%] 
        sm:bottom-[10%] sm:left-[15%] sm:right-[15%] md:top-[10%] md:bottom-[10%] md:left-[25%]
         md:right-[25%] bg-[#242526]  inset-0 flex items-center justify-center">
            <div className="absolute top-0 right-0 p-2 z-[100]">
                <button onClick={() => SetshowComment && SetshowComment(false)} className="text-black font-bold text-[1rem]  mr-[1em] md:text-[1.5rem] focus:outline-none">
                    X
                </button>
            </div>
            <div className="h-full w-full overflow- y-scroll rounded-lg">
                <div className="mx-[0.8em] mt-[0.8em] md:mx-[1em] md:mt-[1em] flex flex-col gap-[0.5em] md:gap-[1em]">
                    {comments.map((e, i) => {
                        return <Comment key={i} image={e.avatar} comment={e.comment} name={e.name} />
                    })}

                </div>
            </div>
        </div>
    </>
    
    

    );
}

function Comment({ image, comment,name }: {image: string, comment: string,name:string }) {
    return (
        <>
            <div className="rounded-lg flex shadow-post my-[0] w-[98%] mx-[1%] sm:mt-[0.4em] sm:rounded-lg sm:w-[80%] sm:mx-[10%] gap-[0.2em] md:gap-[1em] bg-white bg-clip-border-black text-black dark:bg-Dark dark:text-white shadow-md">
                <div className="rounded-full my-[1em] mx-4 mt-4 bg-white shadow-lg">
                <p className="text-[0.6rem] md:text-[0.8rem]">{name}</p>
                    <img className="h-[2em] w-[2em] md:h-[3em] md:w-[3em] rounded-full" src={image} alt="profile-picture" />
           
                </div>
                <div className="p-[1em] text-center">
                    <p className="mb-2 block font-sans text-[0.7rem] md:text-[1.1rem] font-semibold leading-snug tracking-normal antialiased">
                        {comment}
                    </p>
                </div>
           
            </div>
        </>
    )
}
