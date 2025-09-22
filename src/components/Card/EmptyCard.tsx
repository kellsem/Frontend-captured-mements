
interface EmptyCardsProps {
imgSrc: string
message: string
}
export const EmptyCard = ({imgSrc, message}: EmptyCardsProps) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No notes" className="w-24" />
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center lading-7 nt-5">
       {message}
      </p>
    </div>
  )
}