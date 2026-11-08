import './landingpage.css'
import { motion, scale, stagger } from 'motion/react'
import plus from "../assets/plus.png"
import notification from "../assets/notification.gif"
import chat from "../assets/chat.gif"
import { useEffect, useRef, useState } from "react";
import notenobag from "../assets/notenobag.gif"
import Feedcard from '../components/feedcard'
import { Link } from 'react-router-dom'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import close from '../assets/close.png'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom';
import api from '../api'
import Feednavbar from '../components/feednavbar'
import { useContext } from 'react'
import { ThemeContext } from '../context/themeprovider'
import { ChatIcon, GearSixIcon, PlusIcon } from '@phosphor-icons/react'
import { PlusCircleIcon } from "@phosphor-icons/react";
import { Overlay } from 'vaul'
import { XIcon } from "@phosphor-icons/react";
import CharacterCount from '@tiptap/extension-character-count'

const parentcont = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.5
        }
    }
}

const heroitems = {
    hidden: {
        opacity: 0,
        scale: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 1
        }
    }
}


function LandingPage() {
    const feedref = useRef(null)
    const [toggle, setToggle] = useState(false)
    const uploadref = useRef()
    const [image, setImage] = useState(null)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { theme } = useContext(ThemeContext)

    const MAX_LENGTH = 1000
    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({
            placeholder: "Write your thoughts"
        }),
       CharacterCount.configure({
            limit: MAX_LENGTH
        })
    ],
    })

    if (!editor) {
        return null
    }

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        const urlImage = URL.createObjectURL(file)
        setImage(urlImage)
    }

    function postClickchanges(params) {
        setImage(null)
        setToggle(!toggle)
    }

  
    async function post_notes() {
        const content = editor.getHTML()
        const type = "public"
        try {
            const res = await api.post("/notes", {
                "type": type,
                "note": content
            })
            const data = await res.data
            console.log(data);
            console.log(data.message);
            toast.success(data.message)
            navigate('/Landing')
        } catch (error) {
            const message = error.response?.data?.message || "Failed to Preserve note,Try again"
            console.error(error)
            toast.error(message)
        }
    }

   useEffect(() => {
    if (!toggle) return;

    const scrollY = window.scrollY;

    document.documentElement.classList.add("overlay-open");
    document.body.classList.add("overlay-open");

    document.body.style.top = `-${scrollY}px`;

    return () => {
        document.documentElement.classList.remove("overlay-open");
        document.body.classList.remove("overlay-open");

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        window.scrollTo(0, scrollY);
    };
}, [toggle]);

    function postclickhandler(params) {
        post_notes()
        setToggle(false)
    }

    return (
        <>
            <div className={`outerfeed ${theme}`}>
                <Feednavbar></Feednavbar>
                <div className="feedsection">
                    <div className={`selections ${theme}`}>
                        <PlusIcon size={30} weight='bold' id='add' onClick={() => setToggle(true)}></PlusIcon>
                        <ChatIcon size={30} weight='bold' id='chat'></ChatIcon>
                        <GearSixIcon size={30} weight='bold' id='setting'></GearSixIcon>
                    </div>
                    <div className='Feed'>
                        <Feedcard></Feedcard>
                    </div>
                    
                    {
                        toggle && (
                            <div className="overlay">
                                <div className='closediv'>
                                    <XIcon id='close' size={50} onClick={()=>{setToggle(false)}}></XIcon>
                                </div>
                                <div className="Postbox">
                                    <div className="write">
                                       <EditorContent editor={editor} ></EditorContent>
                                    </div>
                                     <div className='imagepost'>
                                        <PlusIcon size={400} color='rgba(6, 0, 0, 0.65)' id='addicon'></PlusIcon>
                                        <p>Add images to your thoughts</p>
                                     </div>
                                     <div className='Post'>
                                        <button onClick={postclickhandler}>Post</button>
                                     </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default LandingPage