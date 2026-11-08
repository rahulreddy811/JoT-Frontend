import { createContext, useEffect, useState } from "react"

export const ThemeContext = createContext(null)

function getTheme(){
    const hours = new Date().getHours()

    if (hours >= 5 && hours < 11) {
        return "morning"
    }else if (hours >=11 && hours < 17) {
        return "afternoon"
    }else if (hours >= 17 && hours < 21) {
        return "evening"
    }else{
        return "night"
    }
}

export function ThemeProvider({children}) {
   const [theme,setTheme] = useState(getTheme)

   useEffect(()=>{
    const updatetheme = ()=>{
        setTheme(getTheme())
    }

    updatetheme()

    const interval = setInterval(updatetheme,60*1000)

    return ()=>{clearInterval(interval)}
   },[])

   return(
    <ThemeContext.Provider value={{theme}}>
        {children}
    </ThemeContext.Provider>
   )
}

export default ThemeProvider