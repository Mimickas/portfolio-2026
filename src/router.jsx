import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLAyout";
import Project from "./pages/project/Project";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {index: true, element: <Project/>},
            {path: "about", element: <About />},
            {path: "contact", element: <Contact /> }
        ]
    }
])

export default router;