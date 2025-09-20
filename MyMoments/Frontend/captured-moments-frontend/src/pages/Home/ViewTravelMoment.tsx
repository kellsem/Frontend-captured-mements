import { GrMapLocation } from "react-icons/gr"
import { MdClose, MdDelete, MdUpdate } from "react-icons/md";
import { formatDate } from "../../utils/helpers";


interface MomentProps {
  id: string;
  imageUrl: string;
  title: string;
  story: string;
  visitedDate: string;
  visitedLocation: string[];
  isFavorite: boolean;
}

interface ViewTravelMomentProps{
momentInfo: MomentProps,
onClose: ()=> void,
onDeleteClick: ()=> void
onEditClick: ()=> void
}

 export const ViewTravelMoment = ({ 
   momentInfo,
   onClose,
   onDeleteClick,
   onEditClick }: ViewTravelMomentProps) =>{
    return(
    <section className="relative    ">
    <header className="flex items-center justify-end">
      <div className="flex items-center gap-3 bg-violet-50/50 rounded-l-lg p-2">
        <button className="btn-small" onClick={onEditClick}>
          <MdUpdate className="text-lg"/> UPDATE STORY
        </button>

        <button className="btn-small btn-delete" onClick={onDeleteClick}>
          <MdDelete className="text-lg"/> DELETE
        </button>

        <button onClick={onClose}>
          <MdClose className="text-lg text-slate-400"/>
        </button>
      </div>

    </header>
    <div>
      <article className="flex-1 flex flex-col gap-2 py-4">
        <h1 className="text-2xl text-slate-950"> 
          {momentInfo && momentInfo.title}
        </h1>
   
         <div className="flex items-center gap-3 justify-between">
             <span className="text-xs text-slate-500">
               {formatDate(momentInfo.visitedDate || "")}
             </span>

             <div className="inline-flex items-center gap-2 text-[13px] text-violet-600 bg-violet-200/40 rounded px-2 py-1">
               <GrMapLocation className="text-sm"/>
               {momentInfo && 
               momentInfo.visitedLocation.map((visited, idx)=>
                momentInfo.visitedLocation.length == idx + 1 
               ? `${visited}` 
               : `${visited}, `
              )}
             </div>
         </div>
         
         </article>

         <img src={momentInfo?.imageUrl} 
         alt=""
         className="w-full h-300px object-cover rounded-lg"
         />

         <footer className=" mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {momentInfo.story}
          </p>
         </footer>

    </div> 
    </section>
  )
 }
