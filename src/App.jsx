import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import EditorPage from './Pages/EditorPage'
import { Toaster } from 'react-hot-toast'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/editor/:editorId',
      element: <EditorPage />,
    },
  ]);

  return (
    <>
    <div>
      <Toaster position='top-right'
      toastOptions={{
        success:{
          theme:{
            primary: '#4aed88'
          }
        }
      }}>
      </Toaster>
    </div>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
