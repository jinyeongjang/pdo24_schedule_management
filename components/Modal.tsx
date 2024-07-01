import { Rnd } from 'react-rnd';

interface App {
    id: number;
    iconClass: string;
    title: string;
    component: React.FC;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    app: App | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, app }) => {
    if (!isOpen || !app) return null;

    const Component = app.component;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Rnd
                default={{
                    x: 100,
                    y: 100,
                    width: 400,
                    height: 300,
                }}
                minWidth={300}
                minHeight={200}
                bounds="window"
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl drop-shadow-2xl border border-gray-300 dark:border-gray-700"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{app.title}</h2>
                    <button onClick={onClose} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700">
                        X
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <Component />
                </div>
            </Rnd>
        </div>
    );
};

export default Modal;
