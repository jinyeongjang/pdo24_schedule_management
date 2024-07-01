import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { event, session } = req.body;

        switch (event) {
            case 'SIGNED_IN':
                // 세션 저장
                res.setHeader('Set-Cookie', [
                    `sb-access-token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
                    `sb-refresh-token=${session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
                ]);
                break;
            case 'SIGNED_OUT':
                // 세션 제거
                res.setHeader('Set-Cookie', [
                    'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
                    'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
                ]);
                break;
            default:
                break;
        }

        res.status(200).json({ message: 'Auth event handled' });
    } catch (error) {
        res.status(500).json({ error: 'Error handling auth event' });
    }
}
