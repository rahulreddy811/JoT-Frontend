import { useNavigate } from 'react-router-dom'
import './navbarland.css'
import { easeOut, motion } from "motion/react"

function NavbarLand({ settab }) {
    const navigate = useNavigate()

    return(
        <>
        <div className='navbarouter'>
            <motion.div className='navbarinside'>

                <motion.h3
                whileHover={{
                    y:-3,
                    scale:1
                }}
                whileTap={{
                    y:-3,
                    scale:0.1
                }}
                transition={{
                    duration:0.5,
                    ease:easeOut
                }}
                onClick={()=>{
                    settab("signup");
                }}
                >Signup</motion.h3>

                <motion.h3
                whileHover={{
                    y:-3,
                    scale:1
                }}
                whileTap={{
                    y:-3,
                    scale:0.1
                }}
                transition={{
                    duration:0.5,
                    ease:easeOut
                }}
                onClick={()=>{
                    settab("login");
                }}
                >Login</motion.h3>

                <motion.h3
                whileHover={{
                    y:-3,
                    scale:1
                }}
                whileTap={{
                    y:-3,
                    scale:0.1
                }}
                transition={{
                    duration:0.5,
                    ease:easeOut
                }}
                onClick={()=>{
                    settab("explore");
                }}
                >Explore</motion.h3>
                
            </motion.div>
        </div>
        </>
    )
}

export default NavbarLand