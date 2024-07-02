import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const CheckSupabase = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('schedules').select('*');
            if (error) setError(error.message);
            else setData(data);
        };
        fetchData();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Supabase Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default CheckSupabase;
