import { verifyToken } from '../lib/utils';

export async function VerifyUser(context) {
  const token = context.req ? context.req.cookies?.token : null;
  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};
