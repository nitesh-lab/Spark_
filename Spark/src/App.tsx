import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UseParent } from "./Context/ParentProvider"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProtectedLayout from "./Pages/ProtectedLayout";
import DashBoard from "./Pages/DashBoard";
import Admin from "./Pages/Admin";
import Profile from "./Pages/Profile";
import UpdateProfile from "./Pages/UpdateProfile";
import Information from "./Pages/Information";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Error from "./Pages/Error";
import Messenger from "./Pages/Messenger";
import Register from "./Pages/Register";



export default function App(){

      const {isDark}=UseParent();

  return (

    <>
    <div className={`${isDark ? "dark":""} relative`}>
      <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme={isDark ? "dark" : "light"}
            />

      <BrowserRouter>
                <Routes>
                        <Route path='/' element={
                            <ProtectedLayout>
                                <DashBoard/>
                            </ProtectedLayout>
                        } />

                        <Route path='messenger' element={<Messenger/>} />
                        <Route path='admin' element={<Admin />} />
                        <Route
                            path='/update-profile'
                            element={<UpdateProfile />}
                        />
                        <Route
                            path='/post/information'
                            element={<Information />}
                        />
                   

                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/profile/:data' element={<Profile />} />

                    <Route path='*' element={<Error />} />
                </Routes>
            </BrowserRouter>
            </div>
    </>
  )
}