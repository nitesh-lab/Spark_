
import { post } from "../../Pages/Profile";
import SinglePost from "./SinglePost";

export default function PostFeed({uid,posts}:{uid:string,posts:post[]}){

  if(posts.length<1){
    return;
  }

    return (
        <>
        <div className="relative flex min-h-screen bg-blue-100 flex-col  overflow-hidden ">
  <div className="mx-auto max-w-screen-xl px-4 w-full">
    <div className="grid w-full sm:grid-cols-2 xl:grid-cols-4 gap-6">

      {
        posts.map((e,i)=>{
          return <SinglePost key={i} uid={uid} element={e}/>
        })
      }      
      
    </div>
  </div>
</div>
        </>
    )
}

