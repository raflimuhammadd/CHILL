import {create} from "zustand";

const useModalStore = create((set) => ({
    // state
    isOpen: false,
    selectedItem: null,
    isMobile: false,
    // isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,

    openModal: (film) => set({isOpen: true, selectedItem: film}),
    closeModal: () => set({isOpen: false, selectedItem: null}),
    setIsMobile: (value) => set({isMobile: value}),
    handleBackdropClick: () => set({isOpen: false, selectedItem: null}),
}))

export default useModalStore