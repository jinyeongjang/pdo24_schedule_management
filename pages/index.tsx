import React from 'react';
import AppDrawer from '../components/AppDrawer';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
    const router = useRouter();

    const handleAppClick = (app: any) => {
        router.push(app.path);
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center mb-16">
            <AppDrawer onAppClick={handleAppClick} />
        </div>
    );
};

export default Home;
