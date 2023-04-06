// General request to DB
async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_DB_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

// QUERIES

/************ USER ************/

export async function isNewUser(token, issuer) {
  const operationsDoc = `
    query isNewUser($issuer: String!) {
      users(where: { issuer: {_eq: $issuer} }) {
        id
        issuer
        email
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    'isNewUser',
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
}

export async function createNewUser(token, metadata) {
  const operationsDoc = `
    mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
      insert_users(objects: { issuer: $issuer, publicAddress: $publicAddress, email: $email }) {
        returning {
          id
          issuer
          email
        }
      }
    }
  `;

  const { issuer, publicAddress, email } = metadata;
  const response = await queryHasuraGQL(
    operationsDoc,
    'createNewUser',
    {
      issuer,
      publicAddress,
      email
    },
    token
  );

  return response;
}


/************ VIDEOS ************/

export async function findVideoByUser(token, userId, videoId) {
  const operationsDoc = `
    query findVideoByUser($userId: String!, $videoId: String!) {
      stats(where: { userId: {_eq: $userId}, videoId: {_eq: $videoId} }) {
        id
        userId
        videoId
        favourited
        watched
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    'findVideoByUser',
    {
      videoId,
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
    query watchedVideos($userId: String!) {
      stats(where: {
        watched: {_eq: true}, 
        userId: {_eq: $userId},
      }) {
        videoId
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    'watchedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}

export async function getFavouritedVideos(userId, token) {
  const operationsDoc = `
    query favouritedVideos($userId: String!) {
      stats(where: {
        userId: {_eq: $userId}, 
        favourited: {_eq: 1}
      }) {
        videoId
      }
    }
  `;

  const response = await queryHasuraGQL(
    operationsDoc,
    'favouritedVideos',
    {
      userId,
    },
    token
  );

  return response?.data?.stats;
}


/************ STATS ************/

export async function insertStats(
  token,
  { userId, videoId, favourited, watched }
) {
  const operationsDoc = `
    mutation insertStats($userId: String!, $videoId: String!, $favourited: Int!, $watched: Boolean!) {
      insert_stats_one(object: {
        userId: $userId, 
        videoId: $videoId,
        favourited: $favourited, 
        watched: $watched 
      }) {
        favourited
        userId
      }
    }
  `;

  return await queryHasuraGQL(
    operationsDoc,
    'insertStats',
    { userId, videoId, favourited, watched },
    token
  );
}

export async function updateStats(
  token,
  { userId, videoId, favourited, watched }
) {
  const operationsDoc = `
    mutation updateStats($userId: String!, $videoId: String!, $favourited: Int!, $watched: Boolean!) {
      update_stats(
        _set: { favourited: $favourited, watched: $watched }, 
        where: {
          userId: {_eq: $userId}, 
          videoId: {_eq: $videoId}
        }) {
          returning {
            userId
            videoId
            favourited
            watched
          }
        }
    }
  `;

  return await queryHasuraGQL(
    operationsDoc,
    'updateStats',
    { userId, videoId, favourited, watched },
    token
  );
}
