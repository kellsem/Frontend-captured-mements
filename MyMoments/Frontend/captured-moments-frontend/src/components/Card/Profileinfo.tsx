import { getInitials } from "../../utils/helpers"

 interface UserInfoProps{
  created_at: string
  email: string
  fullName: string
  id: string
  password: string
  updated_at: string;
}
 interface ProfileProps{
 userInfo: UserInfoProps,
 onLogout: () => void
}

export function Profile({userInfo, onLogout}:ProfileProps){

  return(
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 front-medium bg-slate-100"> 
         {getInitials(userInfo.fullName)}
      </div>
  
      <div>
         <p className="text-sm font-medium">{userInfo.fullName || ""}</p>
         <button className="text-sm text-slate-700 underline " onClick={onLogout}>
          Lougout

         </button>
      </div>
    </div>
  )
}
