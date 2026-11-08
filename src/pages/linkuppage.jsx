import './linkuppage.css'
import NavbarLand from '../components/navbarland'
import { useState } from 'react'
import Signuppage from './signup'
import Loginpage from './login'
import ExplorePage from './explore'
function LinkPage() {
    const [activetab,setActive] = useState("signup")
    return(
    <>
    <div className="outer">
        <NavbarLand settab={setActive}></NavbarLand>
        <div className="content">
            {
                activetab === "signup" && (
                    <Signuppage></Signuppage>
                )
            }
            {
                activetab === "login" && (
                    <Loginpage></Loginpage>
                )
            }
            {
                activetab === "explore" && (
                    <ExplorePage></ExplorePage>
                )
            }
        </div>
    </div>
    </>

)  
}

export default LinkPage