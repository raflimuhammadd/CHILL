import useModalStore from "../store/modalStore";
import { useEffect } from "react";

export function useDetailModal() {
  const store = useModalStore();
  const {setIsMobile} = store;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return store;
}