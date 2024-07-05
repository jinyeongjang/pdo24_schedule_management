// store/useStore.ts
import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface QtCheck {
    id: string;
    userId: string;
    title: string;
    description: string;
    wordCount: number;
    qtCount: number;
    date: string;
    createdAt: string;
}

interface Store {
    qtChecks: QtCheck[];
    addQtCheck: (qtCheck: QtCheck) => void;
}

const useStore = create<Store>((set) => ({
    qtChecks: [],
    addQtCheck: (qtCheck) =>
        set((state) => ({
            qtChecks: [...state.qtChecks, qtCheck],
        })),
}));

export default useStore;
