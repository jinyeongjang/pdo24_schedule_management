import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const code = req.query.code as string;

    const response = await fetch(`https://kauth.kakao.com/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
            redirect_uri: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI_PROD! : process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
            code,
            grant_type: 'authorization_code',
        }),
    });

    const data = await response.json();

    if (data.error) {
        return res.status(400).json({ error: data.error });
    }

    const { access_token } = data;

    const { error } = await supabase.auth.signInWithIdToken({
        provider: 'kakao',
        token: {
            access_token,
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.redirect('/');
}
