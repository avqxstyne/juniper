import TextEditor from './react-components/TextEditor';

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate
} from 'react-router-dom'

import { v4 as uuidV4 } from 'uuid'

import './styles/App.scss'
import './styles/reset.scss'


const App = () => {
	return (
		<Router>
			<Routes>
				<Route path='/'>
					<Navigate to={`/documents/${uuidV4()}`} replace={true} />
				</Route>

				<Route path='/documents/:id' element={<TextEditor />}/>
					
			</Routes>
		</Router>
	)
}


export default App


