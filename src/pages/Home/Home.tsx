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
import { ViewTravelMoment } from "./ViewTravelMoment";
import { DateFilter } from "../../components/input/DateFilter";
import type { DateRange } from "react-day-picker";
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

interface UserProps {
  created_at: string;
  email: string;
  fullName: string;
  id: string;
  password: string;
  updated_at: string;
}
interface ModalPrps{
  isShow: boolean,
  type: string,
  data: MomentProps | null
}

export const Home = () => {
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [allMoments, setAllMoments] = useState<MomentProps[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [openAddEditModal, setOpenAddEditModal] = useState<ModalPrps>({
    isShow: false,
    type: 'add',
    data: null
  })

  const [openViewModal, setOpenViewModal ] = useState<ModalPrps>({
    isShow: false,
    type: 'view',
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
  // Função para favoritar um momento
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
   //Função de Delete de um momento
  const handleDeleteMoment = async ( data: MomentProps | null) =>{
     const momentId  = data?.id;
     console.log("Deleting moment with ID:", momentId);

      try{
      const response = await axiosInstance.delete(`delete-moment/${momentId}`);

      if(response.data){ 
        toast.error(response.data.message);
        setOpenViewModal((prevState)=>({...prevState, isShow: false}))
        getAllCapturedMoments();} 
    }catch(error){
      console.log("An unexpected error occurred. Please try again.", error)     
         }
  }

// Função para filtrar momentos por data selecionada
const filterMomentsByDate = async (newSelected: DateRange | undefined) => {
  try {
    const startDate = newSelected?.from ? new Date(newSelected?.from).getTime().toString() : null;
    const endDate = newSelected?.to ? new Date(newSelected?.to).getTime().toString() : null;
    if (startDate && endDate) {
      const response = await axiosInstance.put('registered-moment/filter', {
        startDate,
        endDate
      });

      if (response.data.moment) {
        setAllMoments(response.data.moment);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error.response.data.message);
      }
    }
  }
};

// Função para lidar com a seleção de dias no filtro de datas
const handleDaysSelected = (newSelected: DateRange | undefined) => {
  setDateRange(newSelected);
  filterMomentsByDate(newSelected);
};

// Função para abrir o modal de visualização do momento
const handleViewStory = (moment: MomentProps) => {
  setOpenViewModal({ isShow: true, type: 'view', data: moment });
};

// useEffect para carregar as informações do usuário e os momentos registrados ao montar o componente
useEffect(() => {
  getUserInfo();
  getAllCapturedMoments();
}, []);

  // Renderização do componente Home
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
                    visitedLocation={moment.visitedLocation}
                    isFavorite={moment.isFavorite}
                    onHandleViewStory={() => handleViewStory(moment)}
                    onFavoriteClick={() => upDateIsFavorit(moment)}
                  />
                ))}
              </div>
            ) : (
              <>Empty Moments</>
            )}
          </section>
          <DateFilter  
          dateRage={dateRange}
          OnHandleDaySelected={handleDaysSelected}
          />
        </div>
      </main>

        {/* { Add & edit captured Moment } */}
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
      <AddEditTravelMoments
      type={openAddEditModal.type}
      momentInfo={openViewModal.data}
      onClose={()=>{
        setOpenAddEditModal({isShow: false, type:'add', data:null})
      }}
      getAllMoments={()=>getAllCapturedMoments()}
      />
      </Modal>
       
         {/* { View captured Moment } */}
       <Modal
        isOpen={openViewModal.isShow}
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

      <ViewTravelMoment
       momentInfo={openViewModal.data!}
       onClose={()=> { 
          setOpenViewModal((prevState)=>({...prevState, isShow: false}))
          }}
          onEditClick={()=>{
          setOpenViewModal((prevState)=>({...prevState, isShow: false}))
          setOpenAddEditModal((prevState)=>({...prevState, isShow: true, type:'edit', data: openViewModal.data}))
          }}
          onDeleteClick={() => handleDeleteMoment(openViewModal.data)}
       

      />
      </Modal>

 
     <button className="fixed bottom-6 right-6 w-16 h-16 flex items-center justify-center rounded-full  hover:bg-violet-700 ml-auto"
     onClick={()=>{
      setOpenAddEditModal({isShow: true, type:'add', data:null})}}
     >
      <IoMdAddCircle className="text-[62px] text-white bg-primary hover:text-violet-500 rounded-full hover:bg-white"/>

     </button>

     <ToastContainer />
    </>
  );
};

  //here -6min 8
