import "./homepage.css"
import { AnimatePresence, motion, scale, arc } from "motion/react"
import logo from "../assets/logo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Homepage(params) {
    const navigate = useNavigate()
    const [showbutton, setShowButton] = useState(true)
    const [flight, setFlight] = useState(false)
    return (
        <>

            <div className="herosection">
                <motion.div className="centerdiv">
                    <div className="headings">
                        <h1>JOT</h1>

                    </div>
                    <div className="subheading">
                        <p>Thoughts! Unfiltered</p>
                    </div>
                    <AnimatePresence onExitComplete={() => setFlight(true)} >
                        {

                            showbutton && (
                                <motion.div className="btndiv"
                                    onClick={() => setShowButton(false)}
                                    exit={
                                        {
                                            opacity: 0,
                                            scale: 0,
                                            y: 1
                                        }
                                    }
                                    transition={{ duration: 0.5 }}
                                >
                                    <button id="homepagebtn">Let's go</button>
                                </motion.div>
                            )

                        } </AnimatePresence>
                    <AnimatePresence >
                        {
                            flight && (
                                <motion.div className="flightclass"
                                initial={
                                    {
                                        x:0,
                                        y:0,
                                        opacity:1
                                    }
                                }
                                animate={
                                    {
                                        x:1000,
                                        y:-700,
                                        opacity:0
                                    }
                                }
                                transition={{
                                    duration:2,
                                    ease:"easeInOut"
                                }}
                                style={{ willChange: "transform, opacity" }}
                                onAnimationComplete={
                                    ()=>{
                                        navigate("/Link")
                                    }
                                }
                                    >
                                    <img src={logo} alt="logo" />
                                </motion.div>
                            )
                        }
                    </AnimatePresence>

                </motion.div>
            </div>

        </>

    )
}

export default Homepage