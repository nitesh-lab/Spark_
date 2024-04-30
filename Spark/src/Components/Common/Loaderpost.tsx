
export default function Loaderpost({custom,color,text}:{custom?:string,color?:string,text?:string}){
    return(<>
        <div className={custom}>
        <div className={`flex items-center justify-center h-[100%] p-5 ${color?color:"bg-[#242526]"} min-w-screen`}>
        <div className="flex space-x-2 animate-pulse">
            <div className={`w-3 h-3 ${text?text:"bg-white"} rounded-full`}></div>
            <div className={`w-3 h-3 ${text?text:"bg-white"} rounded-full`}></div>
            <div className={`w-3 h-3 ${text?text:"bg-white"} rounded-full`}></div>
        </div>
    </div>
    </div>
    </>
    )
}