import './cards.css'
import { motion } from 'motion/react'
function Cards(props) {
    return(
        <div className="card">
            <h1>{props.heading}</h1>
            <p>{props.para}</p>
        </div>
    )
}

export default Cards