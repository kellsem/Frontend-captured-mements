import {useState} from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

interface PasswordInputProps{
  value:string
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}
//condicional do icon password (mudança de cor com paginas)
export const PasswordInput = ({value, onChange, placeholder }:PasswordInputProps) => {
  const [ isShawPassword, setIsShawPassword] = useState(false)
  const location = useLocation()
  
  const toggleShowPassword = () => {
    setIsShawPassword(!isShawPassword)
  }
  const iconColor = location.pathname === '/login'? 'text-primary': 
                    location.pathname === '/signUp'&& 'text-emerald-500';
  
  return (
    <div className="flex items-center bg-violet-600/5 px-5 roudend mb-3">
      <input
      value={value}
      placeholder={placeholder || 'Password'}
      type={isShawPassword ? "text" : "password"}
      className="w-full text-sm bg-transparent py-3 mr-4 roudend outline-none"
      onChange={onChange}
      />
      
      {isShawPassword ? 
      <FaRegEye 
      size={22}
      className={`${iconColor} cursor-pointer`}
      onClick={() => toggleShowPassword()}
      />
        :
      <FaRegEyeSlash 
      size={22}
      className={`${iconColor} cursor-pointer`}
      onClick={() => toggleShowPassword()}
      />
     }
</div>
  )
}