import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { FaRegFileImage } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md";

interface ImageProps{
image: string | File | null
setImage: Dispatch<SetStateAction<File | string | null>>
onHandleDeleteMomentImg: ()=> void
}
 
export const ImageSelector = ({image, setImage, onHandleDeleteMomentImg}: ImageProps) =>{
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("")

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
  const file = e.target.files
  if (file){
    setImage(file[0])
  } 
}
  const onChangeImage = () =>{
  inputRef.current?.click()
  }
const handleRemoveImage = () =>{
  setImage(null)
  onHandleDeleteMomentImg()
}


 useEffect(() =>{
   if (typeof image === 'string' && image) {
     setPreview(image)
   } else if (image instanceof File) {
     const objectUrl = URL.createObjectURL(image)
     setPreview(objectUrl)
     return () => {
       URL.revokeObjectURL(objectUrl)
     }
   } else {
     setPreview("")
   }
 }, [image])

  return(
  <div>
    <input type="file" 
    accept="image/*"
    ref={inputRef}
    onChange={handleImageChange}
    className="hidden"
        />
        {!image ?
        <button className="w-full h-[200px] flex items-center justify-center rounded-md bg-violet-50 text-sm text-slate-700 hover:bg-violet-200 mt-2 p-5 gap-2 "
        onClick={onChangeImage}
      >
       <div>
        <FaRegFileImage className="text-xl text-violet-500" />
        </div>   
         <p className="text-sm text-slate-500">
          Browser image files to upload
         </p>

        </button>
        : 
        <div className="w-full relative">  
          {preview && (
            <img src={preview} alt="selected" 
              className="w-full h-[300px] object-cover rounded-lg"/>
          )}
          <button className=" bnt-small absolute top-2 right-2"
          onClick={handleRemoveImage}>
            <MdDeleteOutline className="text-lg"/>
          </button>
        </div>
}        


  </div>
)
}

