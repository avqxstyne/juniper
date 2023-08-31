import { useSlate } from 'slate-react'
import toggleMark from './App'


const MarkButton = ({type}: any) => {
    const editor = useSlate()
    return (
        <button
            onMouseDown={event => {
                event.preventDefault();
                // @ts-ignore
                toggleMark(editor, type)
            }}
        >
            hehe
        </button>
    )

}

export default MarkButton