import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layout/AppLAyout";
import Project from "./pages/project/Project";
import About from "./pages/about/About";

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {index: true, element: <Project/>},
            {path: "about", element: <About />}
        ]
    }
])

export default router;