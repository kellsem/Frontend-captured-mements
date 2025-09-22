import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { MdClose, MdOutlineDateRange } from "react-icons/md"
import "react-day-picker/style.css"; 
import { useState, type SetStateAction } from "react";

interface DateSelectorProps{
  date: Date
  setDate: React.Dispatch<SetStateAction<Date>>
}
export const DateSelector = ({date, setDate}: DateSelectorProps) =>{
const[openDatePicker, setOpenDatePicker] = useState<boolean>(false)

  return(
 <div>
  <button className="inline-flex items-center gap-2 text-[13px] font-medium text-purple-600 bg-purple-200 border border-purple-300 hover:bg-purple-50 rounded-md px-2 py-1"
  onClick={()=> { setOpenDatePicker(true)}}
  >
    <MdOutlineDateRange className="text-lg"/>
    {format(date || new Date(), 'do MM yyyy', {locale: enUS})} 
    </button>
     
     {openDatePicker && 
      <div className="overflow-y-scroll  bg-purple-50/80 p-5 rounded-lg relative pt-9">  
        <button className="w-10 h-10 roudend-full flex items-center justify-center bg-purple-100 text-purple-600 hover:bg-purple-200 absolute top-3 right-3"
        onClick={()=> {setOpenDatePicker(false)}}
        
        >
            <MdClose className="text-xl text-purple-600"/>
        </button>
     <DayPicker
     required
     captionLayout="dropdown-years"
     mode="single"
     selected={date}
     onSelect={setDate}
     pagedNavigation
     className="rdp-root"

     />
      </div>
}

 </div>
  ) 
}