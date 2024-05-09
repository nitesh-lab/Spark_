import { useEffect, useState } from "react";
import { UseParent } from "../../Context/ParentProvider";
import PostCreate from "./PostCreate";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingPost from "../Common/Loader";
import Post from "./Post";
import Modal from "./Modal";
import axios from "axios";
import { socket } from "../../Services/ConnectSocket";

   export interface post{
        photo:string,
        posted:string,
        like:string,
        comment:string[],
        text:string,
        Uid:string,
        avatar:string,
        name:string,
        post_id:string,
    }

export default function Center({setisVideoopen,videourl,setVideourl}:{setisVideoopen:React.Dispatch<React.SetStateAction<boolean>>,videourl:string,setVideourl:React.Dispatch<React.SetStateAction<string>>}){
    
    const [posts,setPosts]=useState<post[]>([]);
    const [showmodal,setmodal]=useState<boolean>(false);
    return(
    <>
    <div className="w-[100%]  order-3 md:order-2  col-start-1 col-end-11 flex  items-center flex-col  md:row-start-1 md:row-end-2    row-start-3 row-end-4 md:col-start-3 md:col-end-9"> 
     <PostCreate setmodal={setmodal}  setisVideoopen={setisVideoopen}/>  
     <Content posts={posts} setPosts={setPosts}/>
     {(showmodal || videourl) && <Modal setPosts={setPosts}  setmodal={setmodal} videourl={videourl} setVideourl={setVideourl}/>}
     </div>
        </>
    )
}

function Content({posts,setPosts}:{posts:post[],setPosts:React.Dispatch<React.SetStateAction<post[]>>}){

    const loading=false
    const error=false;
   

    const {isDark,token}=UseParent();

    const [hasmore,sethasMore]=useState<boolean>(true);
    
    useEffect(()=>{

        socket.on("newComment", (obj) => {
            const { post_id }: { post_id: string } = obj;
            setPosts((prevPosts) => {
                return prevPosts.map((post) => {
                    if (post.post_id === post_id) {
                        return {
                            ...post,
                            comment: [...post.comment, ""]
                        };
                    } else {
                        return post; 
                    }
                });
            });
        });

        socket.on("newLike",(obj)=>{
            const {post_id}:{post_id:string}=obj
          
            setPosts((s)=>{
                return s.map((e)=>{
                    if(e.post_id===post_id){
                        return {...e,like:e.like+1}
                    }
                    else{
                        return e
                    }
                })

            })   
        })  
        return ()=>{
            socket.off("newLike")
            socket.off("newComment")
        }
    },[])

    useEffect(()=>{
        async function getAllposts(){
           if(token.length>0){
        const data=await axios.get("https://spark-9j9e.onrender.com/api/user/CheckOfflinePosts",{withCredentials:true})
        console.log(data.data.posts)       
        setPosts(()=>[...data.data.posts])
        sethasMore(data.data.state)
        }  
    }  
        getAllposts(); 
        },[token])
    

    if (loading) {
        return (
            <div>
                <LoadingPost />
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`bg-white ${
                    !isDark && "shadow-post"
                } dark:bg-[#242526] rounded-lg w-full text-center text-xl font-bold py-10 `}>
                <div>No post found... Try again!</div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className='dark:text-white w-full text-center text-xl font-semibold pt-[40vh] flex-col '>
                <div>
                    You don't follow anyone.
                    <br />
                    Let's do something!
                </div>
            </div>
        );

    }

    async  function getNewPosts():Promise<void>{
         
        const time=posts[posts.length-1].posted   
   
       const data=await axios.post("https://spark-9j9e.onrender.com/api/user/getNewOfflinePosts",{time:time},{withCredentials:true});
        
       setPosts((s)=>[...s,...data.data.user])
       sethasMore(data.data.state);
    }

    return  posts.length>0 ?
        <>
        <InfiniteScroll
        dataLength={posts.length}
            next={getNewPosts}
            hasMore={hasmore}
            loader={<LoadingPost />}   >
            {posts.map((post) => (
                <Post
                key={Math.random()}   
                    post={post}
                 />
                 
            ))}
        </InfiniteScroll>
        {!hasmore && 
        <h1 className="text-black font-bold mb-[10px] sm:my-[20px] md:my-[30px] dark:text-white">Follow More Friends to see new Posts...</h1>
        
        }
        </>:<p>loading...</p>
       }
    



  

  
  