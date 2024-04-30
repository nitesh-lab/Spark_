import { UseParent } from "../../Context/ParentProvider";


function Suggestion(){

    
    const {isDark}=UseParent();

    

    return (
        <div
            className={`bg-white ${
                !isDark && "shadow-post"
            } dark:bg-[#242526] rounded-lg py-4 px-5 md:fixed w-full md:w-[24%] mr-12 mb-4 md:mb-0 `}>
           Hii
        </div>
    )
}
export default Suggestion;