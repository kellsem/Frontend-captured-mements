import { DayPicker } from "react-day-picker"
import type { DateRange } from "react-day-picker";

interface DateFilterProps{
  dateRage: DateRange | undefined
  OnHandleDaySelected: (range: DateRange | undefined) => void
}



export const DateFilter = ({dateRage, OnHandleDaySelected }: DateFilterProps) => {
  return (
    <aside className="w-[320px]">
      DateFilter

      <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg p-3">
           <DayPicker 
           required
           captionLayout="dropdown-years"
           mode="range"
           selected={dateRage}
           onSelect={OnHandleDaySelected}
           pagedNavigation
           className="rdp-root"

           />
      </div>
    </aside>


  )
}
