import Register from '../pages/Register.tsx'
import { Route, Routes } from "react-router-dom"
import{Index} from '../pages/App.tsx'
import Login from '../pages/Login.tsx'
import Dashboard from '../pages/Dashboard.tsx'





export const MainRoutesPublic = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={< Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </>
    )
}