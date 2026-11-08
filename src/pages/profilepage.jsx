import './profilepage.css'
import sampleprofile from '../assets/sampleprofile.png'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ChatIcon, HeartIcon, ImageIcon } from '@phosphor-icons/react/dist/ssr'
import { LinkedinLogoIcon, NoteIcon, VaultIcon } from '@phosphor-icons/react'
import Bunker from '../components/bunker'
import { toast } from 'sonner'
import api from '../api'
import axios from 'axios'
function ProfilePage() {
    const [activetab, setActiveTab] = useState("images")
    const [images, setImages] = useState([
        sampleprofile, sampleprofile, sampleprofile,
    ])
    const [profile,setProfile] = useState(false)
    const [image,setImage] = useState(null)
    const [loading,setLoading] = useState(false)

    const [notes, setNotes] = useState([
        {
            username: "rahul",
            created_at: "10/2/2026",
            content: "Hello guys"
        },
        {
            username: "rahul",
            created_at: "10/2/2026",
            content: "Hello guys"
        },
        {
            username: "rahul",
            created_at: "10/2/2026",
            content: "Hello guys"
        }
    ])

    const currentUser = sessionStorage.getItem("username")
    const streaks = sessionStorage.getItem("streaks")

    const handleImage = (event) => {
        setImage(event.target.files[0] || null);
    };

    async function uploadprofile(params) {

        if(!image){
            toast.error("select a profile image")
            return
        }

        const formdata = new FormData()
        formdata.append("image",image)

        try {
            setLoading(true);
            const res = await api.post('/api/profile/image/upload',
                formdata
            )
            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.error || error.message)
        }finally{
            setLoading(false)
        }
        
    }

    async function getprofileimage(params) {
        try {
            const res = await api.get('/api/profile/image',{
                responseType:'blob'
            })
            const imageUrl = URL.createObjectURL(res.data)
            setProfile(imageUrl)
        } catch (error) {
            console.log("Image retrieval error:", error.response?.data);
        }
    }

    useEffect(()=>{
        getprofileimage()
    },[])

    return (
        <>

            <div className='profilebox'>
                <div className='outerbox'>
                    <img src={profile || sampleprofile} alt="profilep" />
                    <div className='username'><p>{currentUser}</p></div>
                    <div className='userdetails'>
                        <motion.div className='streaksclass' whileHover={{ y: -2 }}>
                            <div id='streakhead'>Contacts 👤</div>
                            <p>10</p>
                        </motion.div>
                        <motion.div className='pointsclass' whileHover={{ y: -2 }}>
                            <div id='points' >
                                <div>Streaks 🔥</div>
                                <p>{streaks}</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
                <div className="useritems">
                    <div className='itemsheader'>
                        <div id='item1' >
                            <ImageIcon size={30} onClick={() => setActiveTab("images")} ></ImageIcon>
                        </div>
                        <div id='item2'>
                            <NoteIcon size={30} onClick={() => setActiveTab("notes")}></NoteIcon>
                        </div>
                        <div id='item3'>
                            <VaultIcon size={30} onClick={() => setActiveTab("vault")}></VaultIcon>
                        </div>
                    </div>
                    <div className="itemsdisplay">
                        {
                            activetab === "images" && (
                                <div className="imagesdiv">
                                    {
                                        images.map((image, index) => (
                                            <motion.div id='image' key={index} whileHover={{ y: -2 }} whileTap={{ y: 1, scale: 1.1 }}>
                                                <img src={image} alt={`image ${index + 1}`} />
                                            </motion.div>
                                        )
                                        )
                                    }
                                </div>
                            )
                        }

                        {
                            activetab === "notes" && (
                                <div className="notescontainer">
                                    {
                                        notes.map((note, index) => (
                                            <div className="notesouter">
                                                <div className='note'>
                                                    <div id="noteheader">
                                                        <p>{note.username}</p>
                                                        <p>{note.created_at}</p>
                                                    </div>
                                                    <div id="notecontent">
                                                        <p>{note.content}</p>
                                                    </div>
                                                    <div id="notescred">
                                                        <div id='likeandcom'>
                                                            <HeartIcon size={30} id='like'></HeartIcon>
                                                            <p>10</p>
                                                            <ChatIcon size={30} id='comment'></ChatIcon>
                                                            <p>10</p>
                                                        </div>
                                                        
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>

                            )
                        }

                        {
                            activetab === "vault" && (
                                <div className="vaultbegin">
                                    <h1>Bunker</h1>
                                    <p>Your space. Your things. Your rules.</p>
                                    <button onClick={() => setActiveTab("bunker")}>Let's go</button>
                                </div>
                            )
                        }

                        {
                             activetab === "bunker" && (
                                <div>
                                    <input type="file" accept='image/*' onChange={handleImage}/>
                                    <button onClick={uploadprofile} disabled={loading}> {loading ? "Uploading..." : "Upload Image"}</button>
                                    
                                </div>
                                
                            )
                        }
                    </div>
                </div>
            </div>

        </>

    )
}

export default ProfilePage