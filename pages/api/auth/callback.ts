import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.headers['access-token'] as string;
    const refreshToken = req.headers['refresh-token'] as string;

    if (!accessToken || !refreshToken) {
        return res.status(400).json({ error: 'Access token and refresh token are required' });
    }

    const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.redirect('/');
}
