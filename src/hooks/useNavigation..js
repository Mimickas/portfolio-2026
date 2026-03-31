import { useNavigate, useLocation } from "react-router-dom";

export default function useNavigation(resetRevealPath) {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    const dir =
      path === "/" && location.pathname !== "/" ? "down" : "up";

    if (resetRevealPath) {
        resetRevealPath(dir);
    }

    navigate(path);
  };

  return { goTo };
}