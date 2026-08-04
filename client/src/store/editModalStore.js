import {create} from "zustand";

const useEditModalStore = create((set) => ({
    isOpen: false,
    editingItem: null,
    openEditModal: (item) => set({isOpen: true, editingItem: item}),
    closeEditModal: () => set({isOpen: false, editingItem: null})
}));

export default useEditModalStore;