import './feednavbar.css'
import sampleprofile from '../assets/sampleprofile.png'
import logo from "../assets/logo.svg";
import { easeOut, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from "../api"

function getThemetime(params) {
    const time = new Date().getHours()

    if (time >= 5 && time < 11) {
        return "morning"
    } else if (time >= 11 && time < 17) {
        return "afternoon"
    } else if (time >= 17 && time < 20) {
        return "evening"
    } else {
        return "night"
    }

}
function Feednavbar() {
    const [clicked, setClicked] = useState(false)
    const navigate = useNavigate()
    const [theme, setTheme] = useState(getThemetime)
    const [profileimage,setProfileImage] = useState(null)

    useEffect(() => {
        const interval = setInterval(() => {
            setTheme(getThemetime)
        }, 60000)
        return () => clearInterval(interval)
    })

    //get profileimage
    async function getprofile(params) {
        try {
            const res = await api.get('/api/profile/short',{
                responseType:'blob'
            })
            const imageUrl = URL.createObjectURL(res.data)
            setProfileImage(imageUrl)
        } catch (error) {
            console.log("image Retrievel:",error.response?.data);
        }
    }

    useEffect(()=>{
        getprofile()
    },[])

    return (
        <>
            <div className={`navbardiv ${theme}`}>
                <motion.img
                    initial={{
                        x: 0, y: 0
                    }}
                    animate={{
                        x: clicked ? 20 : 0,
                        y: clicked ? -20 : 0,
                        opacity: clicked ? 0 : 1,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: easeOut
                    }}
                    onClick={() => setClicked(true)}
                    onAnimationComplete={() => {
                        if (clicked) {
                            navigate('/')
                        }
                    }}
                    src={logo} alt="logo" id='paperplane' />
                <h2>Jot</h2>
                <Link to="/profile">
                    <img src={profileimage} alt="profilepicture" id='profile' />
                </Link>
            </div>
        </>
    )
}

export default Feednavbar