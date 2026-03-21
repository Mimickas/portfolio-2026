import { Outlet } from "react-router-dom"
import Header from "../components/header/Header"
import Footer from "../components/footer/Footer"
import GridLayout from "./gridlayout/GridLayout"
import { RevealProvider } from "../context/RevealContext"

export default function AppLayout() {
  return (
    <RevealProvider>
      <div className="page-wrapper">
        <GridLayout />
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RevealProvider>
  )
}