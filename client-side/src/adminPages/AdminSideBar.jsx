import { ChevronRight, ChevronLeft } from "lucide-react"
import { useContext, createContext, useState } from "react"
import NavLogo from '../assets/images/ttlogo.png'
import { useNavigate } from "react-router-dom";
import Loader from '../Loader.jsx';
import toast from "react-hot-toast";
import { removeUserData } from "../service/StorageService.jsx";
import axios from 'axios';
import { LogIn, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setExpanded } from "../redux/ExpandedSlicer.jsx";

const SidebarContext = createContext()

export default function AdminSideBar({ children, user_data }) {

    const navigate=useNavigate(null);

  const currentAction=    useSelector((state)=>state.expanded)
  const [expanded, setExpandedAction] = useState(currentAction);
  const dispatch=useDispatch();

  const [makeLoading,setMakLoading]=useState(false);
  const apiUrl = import.meta.env.VITE_SERVER_API;

  const onLogInClicked=()=>{
    navigate('/user-login_register')
  }

  const toggleExpanded=()=>{
    dispatch(setExpanded());
    setExpandedAction(
      !expanded
    );
  }

  const onClickUser=()=>{
        dispatch(setExpanded());
    setExpandedAction(
      true
    );
  }

  const onLogOutClicked=async()=>{
    try {
      setMakLoading(true);
      const res=await axios.post(apiUrl+"/api/protect/session-log-out",{},{withCredentials:true});
      toast.success(res.data.message);
      removeUserData();
      setTimeout(()=>window.location.reload(),800);
      setMakLoading(false);
      navigate('/');
    } catch (error) {
      toast.error("Error logging out. Please try again.");
      setMakLoading(false);
    }
    
  }

  return (
    <aside className="min-h-screen">
      <nav className="flex flex-col min-h-screen bg-white border-r shadow-sm">
        {/* Logo and Toggle */}
        <div className="p-1 sm:p-4 pb-0 flex justify-between items-center">
          <img
            src={NavLogo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-36 sm:w-40" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={()=>toggleExpanded()}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Sidebar Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2 sm:px-3 mt-8">{children}</ul>
        </SidebarContext.Provider>


{/* Footer User Info */}

        {user_data?.status?(
          <div  className="border-t relative flex items-center py-2 px-1 sm:px-3 my-1
        font-medium rounded-md cursor-pointer transition-colors group">
          
          <div onClick={() => onClickUser()} className="cursor-pointer w-8 sm:w-10 h-8 sm:h-10 text-xs rounded-md sm:text-lg font-bold uppercase bg-gray-300 text-center flex items-center justify-center p-1">
            {user_data.name[0]+user_data.name[1]}
          </div>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-black">{user_data.name}</h4>
              <span className="text-xs text-gray-500">{user_data.email}</span>
            </div>
            <LogOut size={20} className="text-red-600 cursor-pointer" onClick={onLogOutClicked}/>
          </div>

          {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-gray-100 text-black capitalize font-medium w-fit text-sm
            invisible opacity-0 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {user_data.name}
        </div>
        )}
        </div>
        ):(
          
          <div className="border-t relative flex items-center py-2 px-1 sm:px-3 my-1
        font-medium rounded-md cursor-pointer transition-colors group">
          
          <div onClick={onLogInClicked} className="cursor-pointer w-8 sm:w-10 h-8 sm:h-10 text-xs rounded-md sm:text-lg font-bold uppercase text-center flex items-center justify-center p-1 text-green-600">
            <LogIn/>
          </div>
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-black cursor-pointer " onClick={onLogInClicked}>Login or Register</h4>
              <span className="text-xs text-gray-500">Admin only -|-</span>
            </div>
          </div>

          {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6 font-medium
            bg-gray-100 text-green-600 capitalize text-sm
            invisible opacity-0 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          Login
        </div>
      )}

        </div>
        )}
      </nav>
      <Loader loading={makeLoading}/>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)

  return (
    <li
      className={`
        relative flex items-center py-2 px-1 sm:px-3 my-1
        font-medium rounded-md cursor-pointer transition-colors group
        ${
          active
            ? "bg-gray-200 text-black"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-0 w-2 h-2 rounded bg-gray-400 ${
            expanded ? "" : "top-0"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`whitespace-nowrap
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-gray-100 text-black text-sm
            invisible opacity-0 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  )
}
