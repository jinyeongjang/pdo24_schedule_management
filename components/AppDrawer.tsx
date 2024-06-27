import React from 'react';
import HTMLPage from './Page_Html';
import CSSPage from './Page_CSS';
import JavaScriptPage from './Page_JavaScript';
import { BorderBeam } from '@/components/magicui/border-beam.tsx';

interface App {
    id: number;
    iconClass: string;
    title: string;
    component: React.FC;
}

interface AppDrawerProps {
    onAppClick: (app: App) => void;
}

const apps: App[] = [
    { id: 1, iconClass: 'ci ci-html ci-2x', title: 'HTML', component: HTMLPage },
    { id: 2, iconClass: 'ci ci-css3 ci-2x', title: 'CSS', component: CSSPage },
    { id: 3, iconClass: 'ci ci-js ci-2x', title: 'JavaScript', component: JavaScriptPage },
];

const AppDrawer: React.FC<AppDrawerProps> = ({ onAppClick }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {apps.map((app, index) => (
                <button
                    key={app.id}
                    className={`p-4 bg-gray-200 dark:bg-gray-800 shadow-md rounded-xl flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl custom-hover-cursor ${
                        index === 0 ? 'relative' : ''
                    }`}
                    onClick={() => onAppClick(app)}
                >
                    {index === 0 && <BorderBeam />} {/* 첫 번째 버튼에만 BorderBeam 적용 */}
                    <i className={`${app.iconClass} text-gray-700 dark:text-white`}></i>
                    <p className="mt-2 text-md font-semibold text-gray-900 dark:text-white">{app.title}</p>
                </button>
            ))}
        </div>
    );
};

export default AppDrawer;
