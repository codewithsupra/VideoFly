import jwt from 'jsonwebtoken';

import { magicAdmin } from '../../lib/magic-admin';
import { createNewUser, isNewUser } from '../../lib/db-hasura';
import setCookie from '../../lib/cookies';

export default async function login(req, res) {
  if (req.method === 'POST') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substr(7) : '';

      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET
      );

      const isNewUserRes = await isNewUser(token, metadata.issuer);
      console.log(isNewUserRes);
      //isNewUserRes && (await createNewUser(token, metadata));
      if (isNewUserRes) {
        const result = await createNewUser(token, metadata)
        console.log(result);
      }

      setCookie(token, res);
      res.send({ done: true });

    } catch (error) {
      console.error('Something went wrong when logging in on login API', error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
