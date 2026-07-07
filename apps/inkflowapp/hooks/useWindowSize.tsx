import { useEffect, useState } from "react"

const useWindowSize = ()=>{
    const [windowSize, setWindowSize] = useState({
        width:0,
        height:0
    })

    useEffect(()=>{

        const getSize = ()=>{
            setWindowSize({
                width:window.innerWidth,
                height: window.innerHeight
            })
        }

        getSize();

        window.addEventListener("resize", getSize)

        return  ()=>{
            window.removeEventListener("resize", getSize)
        }
    },[])
    return windowSize
}

export default useWindowSize