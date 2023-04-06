import cookie from 'cookie';

const MAX_AGE = 7 * 24 * 60 * 60;

export function setCookie(token, res) {
  const setCookie = cookie.serialize('token', token, {
    maxAge: MAX_AGE, 
    expires: new Date(Date.now() + MAX_AGE * 1000), 
    path: '/'
  });
  res.setHeader('Set-Cookie', setCookie);
}

export function removeCookie(res) {
  const removedCookie = cookie.serialize('token', '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', removedCookie);
}
