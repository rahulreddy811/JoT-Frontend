import { useState } from 'react'

import './form.css'
function Form({ formheading, buttonText, showEmail,register,handleSubmit,onSubmit,errors }) {
    const [game, setGame] = useState(false)
    const [guess,setGuess] = useState(false)
    const [generatednumber,setGenerated] = useState(null)
    const [output,setOutput] = useState("")

    function randomnumber(min, max) {
        min = Math.floor(min)
        max = Math.ceil(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function startgame() {
        setGame(true)
        setGenerated(randomnumber(1,999))
    }

    function gamelogic() {
        const nums1 = document.getElementById('num1').value
        const nums2 = document.getElementById('num2').value
        const nums3 = document.getElementById('num3').value
        const singlenum = nums1+nums2+nums3
        const guessednumber = Number(singlenum)

        if (!singlenum) {
            setOutput("Enter a number")
        }
        else if (generatednumber > singlenum) {
            setOutput("your guess is low,you were close try again") 
        }else if (generatednumber < singlenum) {
            setOutput("your guess is high,you were close try again")
        }else{
            setOutput("congratulations your guess is correct")
        }
    }
    
    function handleClicks(params) {
        gamelogic(),
        setGuess(true)
    }
    return (
        <>
            <div className="formcont">
                <div className="formleft">
                    {!game && (<div>
                        <div className="gameheadings">
                            <h2>Feeling Bored!</h2>
                            <p>Play guess the numbers</p>
                        </div>
                        <button onClick={startgame} id='gamebtn'>
                            Start Game
                        </button>
                    </div>
                        
                    )}

                    {game && (
                        <div className='gamecont'>
                            <h1>Guess the Number</h1>    
                            <div className='gamenums'>
                                <input type="number" maxLength="1" inputMode="numeric" id='num1'/>
                                <input type="number" maxLength="1" inputMode="numeric" id='num2'/>
                                <input type="number" maxLength="1" inputMode="numeric" id='num3' />
                            </div>
                            <button onClick={handleClicks}>Guess</button>
                            {
                                guess && (
                                    <div className='gameoutput'>
                                        <p>{output}</p>
                                    </div>
                                    
                                )
                            }
                        </div>
                    )}
                </div>
                <div className="formright">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1>{formheading}</h1>
                        {
                            showEmail && (
                                
                                <div>
                                    <input type="email" placeholder="Email" {...register("email")} />
                                    {errors.email && (<p>{errors.email.message}</p>)}</div>
                            )
                        }
                        <input type="text" placeholder="Username" {...register("username")} />
                        {errors.username && (<p>{errors.username.message}</p>)}
                        <input type="password" placeholder="Password" {...register("password")} />
                        {errors.password && (<p>{errors.password.message}</p>)}
                        <div className="buttoncont">
                            <button id='authbtn'>{buttonText}</button>
                        </div>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Form