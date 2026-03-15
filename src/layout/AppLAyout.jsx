import { Outlet } from "react-router-dom"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import GridLayout from "./gridlayout/GridLayout"

export default function AppLayout() {
  return (
    // "page-wrapper" est le contexte positionné pour tous les GridItems
    <div className="page-wrapper">
      <GridLayout />
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}