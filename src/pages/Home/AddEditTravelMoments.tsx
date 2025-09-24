import { MdAdd, MdClose, MdUpdate } from "react-icons/md";
import { ImSpinner9 } from "react-icons/im";
import { BsStars } from "react-icons/bs";
import { DateSelector } from "../../components/input/DateSelector" ;
import { useEffect, useState } from "react";
import { ImageSelector } from "../../components/input/imageSelector";
import { TagInput } from "../../components/input/TagInput";
import { uploadImage } from "../../utils/uploadImage";
import { axiosInstance } from "../../api/axiosinstance";
import { toast } from "react-toastify";
import axios from "axios";

interface MomentProps {
  createOn: string;
  id: string;
  isFavorite: boolean;
  imageUrl: string;
  story: string;
  title: string;
  userId: string;
  visitedDate: string;
  visitedLocation: string[];
}
interface AddEditTravelMomentsProps{
  type: string,
  onClose: ()=> void,
  getAllMoments: ()=> void
  momentInfo: MomentProps | null
}

export const AddEditTravelMoments = ({
  type,
  momentInfo,
  onClose, 
  getAllMoments
}:AddEditTravelMomentsProps) => {

const [title, setTitle] = useState<string>(momentInfo?.title || "")
const [memoryImg, setImgMempory] = useState<File | string | null>(momentInfo?.imageUrl ||"")
const [moment, setMoment] = useState<string>(momentInfo?.story ||"")
const [loadingGenerateIA, setLoadingGenerateIA] = useState<boolean>(false)
const [typeText, setTypeText] = useState<string>("")
const [iaTypeing, setIATypeing] = useState<boolean>(false)
const [visitedDate, setVisitedDate] = useState<Date>(momentInfo?.visitedDate ? new Date(momentInfo?.visitedDate) : new Date())
const [location, setLocation] = useState<string[]>(momentInfo?.visitedLocation || [])
const [error, setError] = useState<string | null>(null)

console.log(momentInfo)

// Adiciona um novo momento capturado
const addNewCapturedMoment = async () => {
  try {
    let imageUrl = "";
    
    if (memoryImg && typeof memoryImg !== 'string') {
  try {
    const imageUploadResponse = await uploadImage(memoryImg);
    console.log("Image Upload Response:", imageUploadResponse);
    
    // ✅ Busca por 'uploadFile' (formato que você sempre usou)
    if (imageUploadResponse?.uploadFile) {
      imageUrl = imageUploadResponse.uploadFile;
    } else if (imageUploadResponse?.imageUrl) {
      imageUrl = imageUploadResponse.imageUrl;
    } else if (typeof imageUploadResponse === 'string') {
      imageUrl = imageUploadResponse;
    }
    
  } catch (uploadError) {
    console.error("Erro no upload da imagem:", uploadError);
  }
}
    const requestData = {
      title,
      story: moment,
      imageUrl: imageUrl || null,
      visitedLocation: location,
      visitedDate: visitedDate.toISOString()
    };
    
    console.log("📤 Dados enviados:", requestData);
    
    const response = await axiosInstance.post('/add-registered-moment', requestData);
    
    if (response.data) {
      toast.success("Moment added successfully!");
      getAllMoments();
      onClose();
    }
    
  } catch (error) {
    console.error("❌ Error adding moment:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao adicionar momento";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }
}
// Atualiza um momento capturado existente
const updateCapturedMoment = async () => {
  const momentId = momentInfo?.id;
  try {
    let newImageUrl = ""; 

    let updateMomentData = {
      title,
      story: moment,
      imageUrl: memoryImg || "",
      visitedDate: visitedDate.toISOString(),
      visitedLocation: location,  // ← REMOVA os [ ] se tiver
    }
    
    if(memoryImg && typeof memoryImg !== 'string'){
      const imageUploadResponse = await uploadImage(memoryImg)
      newImageUrl = imageUploadResponse.uploadFile || "";
      
      updateMomentData = {
        ...updateMomentData,
        imageUrl: newImageUrl
      }
    }
    
    const response = await axiosInstance.put(`/edit-moments/${momentId}`, updateMomentData);

    if(response.data.moment){
      toast.success("Moment updated successfully")
      getAllMoments();
      onClose();
    }
    
  } catch (error) {
    if (axios.isAxiosError(error)){
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message)
      } else {
        console.log("An error occurred while updating the moment", error)
      }
    }
  }
}
  // Função para deletar a imagem do momento
const handleDeleteMomentImg = async () => {
  const deleteImgResponse = await axiosInstance.delete('/delete-upload', {
    params: { 
      imageUrl: 
      memoryImg 
    }
    })
    if(deleteImgResponse.data.success){
      const momentId = momentInfo?.id;
      const updateMomentData = {
        title,
        story: moment,
        visitedDate : visitedDate.toISOString(),
        visitedLocation: location,
        imageUrl: "" // Definindo imageUrl como string vazia
      }
      // Atualiza o momento para remover a imagem
    await axiosInstance.put(`/edit-moments/${momentId}`, updateMomentData)
    // Limpa o estado da imagem localmente
    }
     
      
  }
 // Função para lidar com o clique do botão de adicionar ou atualizar
const handleUpdateOrAddClick = () => {
    console.log('Input Data:',{title, moment, visitedDate, memoryImg , location})  

 if(!title){
  setError("Please enter the title")
   return
 }
 if(!moment){
   setError("Please enter the moment")
 return
 }
  setError("")
 if(type === 'edit'){
   updateCapturedMoment()
 }else{
   addNewCapturedMoment()}

 }
// Lida com a chamada da API com IA para gerar o Texto
const handleGenerateIA = async () => {
  if(loadingGenerateIA){
    return
  }

  try {
    setLoadingGenerateIA(true)
    const response = await axiosInstance.post('/ia', {text: moment});
      setMoment(response.data)
      typeTextIA(response.data)
 
}catch (error){
  toast.error("Text generate fail. Please try again later!")
  if(axios.isAxiosError(error)){
    if(error.response && error.response.data && error.response.data.message){
    setError(error.response.data.message)   
    }else{
      console.log("An error occurred while generating text with IA", error)
    }
   }
  } finally{
    setLoadingGenerateIA(false)
  }
 }
 // Função para simular a digitação do texto gerado pela IA
 const typeTextIA = (text:string)=>{
  setIATypeing(true)
  setTypeText(text[0])
  let i = 0;

  const interval = setInterval(()=>{
    setTypeText((prev)=> prev + text[i])
    i ++
    if(i === text.length -1) {
      clearInterval(interval)
      setIATypeing(false)
    }
 },30)
}


 // Função para limpar os campos do formulário
const handleMomentClear = () =>{
if(type === 'add'){
setTitle("")
setImgMempory(null)
setMoment("")
setVisitedDate(new Date())
setLocation([])
}
}
useEffect(()=>{
  handleMomentClear()
},[])

console.log("📍 Location no estado:", location);
console.log("🔍 Tipo do location:", Array.isArray(location) ? "Array" : "Não é array");
console.log("📤 Será enviado como:", location);  
  
return(
<section className="relative">
   <header className="flex items-center justify-between">
    <h2 className="text-xl font-medium text-slate-700">
      {type === 'add' ?  'Add Moment' : 'Update Story'}
      
    </h2>
    <div>
      <div className="flex items-center border-2 gap-3 bg-violet-50/50 rounded-l-lg">
       {type === 'add' ?
        <button className="btn-small" onClick={handleUpdateOrAddClick}>
          <MdAdd/> ADD MOMENT
        </button>
        :
        <button className="btn-small" onClick={handleUpdateOrAddClick}>
          <MdUpdate/> UPDATE MOMENT
        </button>
        }
        <button className="p-1 bg-violet-50 text-red-500 hover:bg-primary rounded-md" onClick={onClose}>
          <MdClose className="text-sl text-slate-400"/>
        </button>
      </div>
      {error && <p className="text-sm text-red-500 pt-2 text-right">{error}</p>}
    </div>
   </header>

   <main>
    <div className="flex-1 flex flex-col gap-2 pt-4">
      <label className="input-label">TITLE</label>
        <input type="text" 
        className="text/2xl text-slate-950 outline-none"
        placeholder="Write your memory here"
        value={title}
        onChange={({target})=>{
          setTitle(target.value)
        }}
        />


        <div className="my-3 ">
          <DateSelector
          date={visitedDate}
          setDate={setVisitedDate}
          />
        </div>

    
  <ImageSelector
  image={memoryImg || null}
  setImage={setImgMempory}
  onHandleDeleteMomentImg= {handleDeleteMomentImg}
  />
   
      <div className="flex flex-col gap-2 mt-4">
        <header className="flex justify-between">
        <label className="input-label">MOMENT</label>
        <button 
        disabled={!moment || iaTypeing}
        className={`border p-0.5 rounded-md text-xl 
                     ${moment && !iaTypeing ? 'bg-slate-50 border-slate-200/50 text-violet-500 hover:bg-primary hover:text-white' 
                    :
                    'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-50'} 
                    `}
        onClick={handleGenerateIA}>
         {loadingGenerateIA ? <ImSpinner9 className="animate-spin"/> : <BsStars />}
       
        
        </button>
        </header>

        <textarea className="text-sm text-slate-950 outline-none bg-slate-50 rounded border border-slate-200 p-3        hover:bg-slate-200"
                  disabled={loadingGenerateIA || iaTypeing}
                  placeholder="Your Moment"
                  value={typeText || moment}
                  rows={10}
                  onChange={({target})=>{
                  setMoment(target.value)
                  setTypeText("")
                  }}
                 />
      </div>
      <div className="pt-3">
        <label>VISITED LOCATIONS</label>
        <TagInput tags={location} setTag={setLocation}/>
      </div>
    </div>
   </main>
</section>
  )
 }
