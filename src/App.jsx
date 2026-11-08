import NavbarLand from "./components/navbarland";
import logo from "./assets/logo.svg";
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import PageTransition from './pagetransition'
import Homepage from "./pages/homepage";
import Loginpage from "./pages/login";
import Signuppage from "./pages/signup";
import LandingPage from './pages/landingpage';
import ProfilePage from './pages/profilepage';
import BunkerForm from './components/bunkerform';
import { Toaster } from "sonner"
import ExplorePage from './pages/explore';
import LinkPage from './pages/linkuppage';

function App() {
  const location = useLocation();
  const hidenavbaron = ['/landing',"/profile","/"];
  const hidenavbar = hidenavbaron.includes(location.pathname.toLowerCase());
  console.log(location.pathname);
  return (
    <>
      <Toaster
        position="top-right"
        offset="80px"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#ffffff"
          },
          classNames: {
            success: "toast-success",
            error: "toast-error"
          }
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Homepage />
              </PageTransition>
            }
          />

          <Route
            path="/login"
            element={
              <PageTransition>
                <Loginpage />
              </PageTransition>
            }
          />

          <Route
            path="/explore"
            element={
              <PageTransition>
                <ExplorePage/>
              </PageTransition>
            }
          />

          <Route
            path="/signup"
            element={
              <PageTransition>
                <Signuppage />
              </PageTransition>
            }
          />
          
          <Route
          path='/landing'
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
          />

          <Route
          path='/profile'
          element ={
            <PageTransition>
              <ProfilePage/>
            </PageTransition>
          }
          />

          <Route
          path='/Link'
          element ={
            <PageTransition>
              <LinkPage/>
            </PageTransition>
          }
          />

          <Route
          path='/bunkerform'
          element ={
            <PageTransition>
              <BunkerForm></BunkerForm>
            </PageTransition>
          }
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App