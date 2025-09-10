import { useEffect, useState } from "react";
import { axiosInstance } from "../../api/axiosinstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/input/Navbar";
import { CapturedMomentCard } from "../../components/Card/CapturedMomentCard";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdAddCircle } from "react-icons/io";
import Modal from 'react-modal';
import { AddEditTravelMoments } from "./AddEditTravelMoments";

interface UserProps {
  created_at: string;
  email: string;
  fullName: string;
  id: string;
  password: string;
  updated_at: string;
}

interface MomentProps {
  id: string;
  imageUrl: string;
  title: string;
  story: string;
  visitedDate: string;
  visiteLocation: string[];
  isFavorite: boolean;
}
interface ModalPrps{
  isShow: boolean,
  type: string,
  data: MomentProps | null
}

export const Home = () => {
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [allMoments, setAllMoments] = useState<MomentProps[]>([]);
  const [openAddEditModal, setOpenAddEditModal] = useState<ModalPrps>({
    isShow: false,
    type: 'add',
    data: null
  })
  
  const navigate = useNavigate();
 // Busca das informações de usuário
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    }
  };
   // Pegar momentos registrados do usuário
    const getAllCapturedMoments = async () => {
    try {
      const response = await axiosInstance.get('get-all-moments');

      if(response.data.memories) {
        setAllMoments(response.data.memories)
      }
    } catch (error){
      console.log("An unexpected error occurred. Please try again.", error)
    }
  }
  const upDateIsFavorit = async (moment: MomentProps) => {
    try {
     const response = await axiosInstance.put(`/favorite-moment/${moment.id}`, {
      isFavorite: !moment.isFavorite
     })
     if(response.data.moment){
      toast.success('Moment updated')
      getAllCapturedMoments()
     }

    }catch(error){
     if(axios.isAxiosError(error)){
      if(error.response && error.response.data && error.response.data.message){
        console.log(error.response.data.message)
      }
     }
    }
  }

  useEffect(() => {
    getUserInfo();
    getAllCapturedMoments();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <main className="container mx-auto py-10">
        <div className="flex gap-7">
          <section className="flex-1">
            {allMoments.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allMoments.map((moment) => (
                  <CapturedMomentCard
                    key={moment.id}
                    imageUrl={moment.imageUrl}
                    title={moment.title}
                    story={moment.story}
                    date={moment.visitedDate}
                    visitedLocation={moment.visiteLocation}
                    isFavorite={moment.isFavorite}
                    onFavoriteClick={() => upDateIsFavorit(moment)}
                  />
                ))}
              </div>
            ) : (
              <>Empty Moments</>
            )}
          </section>
          <aside className="w-[320px]" />
        </div>
      </main>
       <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={()=>{}}
        style={{
          overlay:{
            backgroundColor:"rgba(0,0,0,0.2)",
            zIndex:999,
          }
        }}
       ariaHideApp={false}
       className="model-box"
      >
      <AddEditTravelMoments/>
      </Modal>

 
     <button className="w-16 h-16 flex items-center justify-center rounded-full hover:bg-violet-700 ml-auto"
     onClick={()=>{
      setOpenAddEditModal({isShow: true, type:'add', data:null})}}
     >
      <IoMdAddCircle className="text-[62px] text-white bg-primary hover:text-violet-500 rounded-full hover:bg-white"/>

     </button>

     <ToastContainer />
    </>
  );
};
