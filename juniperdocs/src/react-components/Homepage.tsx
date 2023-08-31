import { useEffect, useState, useRef } from 'react'
import mySvg from '../assets/juniperfv.svg'
import { io } from 'socket.io-client';
import '../styles/Homepage.scss'

const Homepage = () => {

    const [socket, setSocket] = useState() as any;
    // @ts-ignore
    const input = document.getElementById("gay");

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

        socket.once('display-all', (data: any[]) => {
            for (let i = 0; i < data.length; i++) {            
                const displayContainer = document.getElementById("display-container");

                const newChild = document.createElement('div')
                newChild.classList.add("homepage-document-list-item")

                const subChildLink = document.createElement('a')
                subChildLink.href = `http://localhost:5173/documents/${data[i].id}`;  
                subChildLink.innerText = `${data[i].name}`

                newChild.appendChild(subChildLink)

                displayContainer?.appendChild(newChild)
            }
        })
    }, [input])

    return (
        <>
            <div className='homepage-navbar'>
                <img src={mySvg}></img>
                <h1>Juniper</h1>
                <button 
                    className='create-new-document-button'
                    onClick={() => {
                        window.open('/','_blank');
                    }}
                >Create new document</button>
                <input placeholder='search existing documents' id='gay'></input>
            </div>
            <div id='display-container'>

            </div>
        </>
    )
}

export default Homepage