import { useNavigate } from "react-router-dom";
import { Profile } from "../Card/Profileinfo";
import Logo from "../assets/captured-moments-logo.svg"


  
  interface InfoProps{
  created_at: string
  email: string
  fullName: string
  id: string
  password: string
  updated_at: string;
}
  interface NavbarProps{
    userInfo: InfoProps | null
    }

  export function Navbar ({userInfo}: NavbarProps){
    const navigate = useNavigate()

    const isToken = localStorage.getItem('cm:token')
    const showProfileInfo = isToken && userInfo

const logout = () => {
  localStorage.clear()
  navigate("/login")
}

  return (
   <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0  z-10">
    <img src={Logo} alt='logo da empresa ' className="h-11" />

    {showProfileInfo && <Profile userInfo={userInfo} onLogout={logout}/>}
   </div>
  )}

