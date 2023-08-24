import { useEffect, useState, useRef } from 'react'
import mySvg from '../assets/juniperfv.svg'
import { io } from 'socket.io-client';

const Homepage = () => {

    const [socket, setSocket] = useState() as any;
    // @ts-ignore
    const input = document.getElementById("gay")

    useEffect(() => {
        const s = io("http://localhost:8000");
            setSocket(s);
        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket == null) return

        socket.emit('get-all')

        socket.once('display-all', (ids: any[]) => {
            for (let i = 0; i < ids.length; i++) {            
                document.getElementById("display-container")?.appendChild(  document.createTextNode(`Document ${i}, ${ids[i]}. `))
            }
        })
    }, [input])

    return (
        <>
            <div className='homepage-navbar'>
                <img src={mySvg}></img>
                <h1>Juniper</h1>
                <button>Create new document</button>
                <input placeholder='search existing documents' id='gay'></input>
            </div>
            <div id='display-container'>

            </div>
        </>
    )
}

export default Homepage