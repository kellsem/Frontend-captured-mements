import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { MdOutlineDateRange } from "react-icons/md"

interface DateSelectorProps{
  date: Date
  setDate:() => void
}
export const DateSelector = ({date}: DateSelectorProps) =>{
  return(
 <div>
  <button className="inline-flex items-center gap-2 text-[13px] front-medium text-purple-600 bg-purple-200"
  >
    <MdOutlineDateRange className="text-lg"/>
    {format(date ||" ", 'do MM yyyy', {locale: enUS})} 

    </button>
 </div>
  ) 
}