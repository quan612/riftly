import axios from 'axios';
const { jwtVerify, createRemoteJWKSet } = require('jose');

// Stored Key:Value pair of {..., domainName:"", wallet: "", ...} to check if Wallet Address matches on login
const storedCredentials = [
  { domainName: "shadbolt.crypto", wallet: "0xeb4cF35B0de0Cd980BbF0abD927781b6c23f1cBB" },
  { domainName: "shadbolt.wallet", wallet: "0xeb4cF35B0de0Cd980BbF0abD927781b6c23f1cDD" },
]

/**
 * Confirms if domain has been transfered since registration
 * Loop through stored user credentials 
 * Check if User exists and then
 * String compares the stored wallet address to the address from login 
 * Returns Boolean
 * 
 * @param {object} authorization - JSON object from the frontend containing attempted UD login credentials.
 * @param {object} storedCredentials - array of key:value objects of {..., domainName:"", wallet: "", ...}
 */
const verifyNotTransfered = async (authorization, storedCredentials) => {

  storedCredentials.forEach((user) => {
    if (user.domainName === authorization.idToken.sub) {
      if (user.wallet !== authorization.idToken.wallet_address) {
        throw new Error('Domain has been transfered since Registration!');
      }
    }
  })

  return true
};

/**
 * Confirms if raw token is a valid token for the attempted login
 * Generates new JSON token given a raw token
 * String compares the new JSON nonce to the raw nonce 
 * Returns new JSON token
 * 
 * @param {string} jwks_uri - part of Unstoppable's OpenID configuration.
 * @param {string} id_token - Raw token string from the JSON object passed from the Frontend Login
 * @param {string} nonce - Nonce token string from the JSON object passed from the Frontend Login
 * @param {string} client_id - Uauth login parameters from the frontend.
 * @param {string} issuer - Part of Unstoppable's OpenID configuration.
 */
const verifyIdToken = async (jwks_uri, id_token, nonce, client_id, issuer) => {
  const { payload } = await jwtVerify(
    id_token,
    createRemoteJWKSet(new URL(jwks_uri)),
    { audience: client_id, issuer }
  );

  const idToken = payload;

  idToken.__raw = id_token;

  if (nonce !== idToken.nonce) {
    throw new Error('Invalid login credentials!');
  }

  return idToken;
};

/**
 * Confirm POST request from frontend is a valid request from UD login flow and not an invalid request from external source.
 * Gets the openid-configuration JSON from Unstoppable's endpoint and parses for jwks URI and issuer
 * Gets raw token and nonce from the POST request, the UAuth frontend configs, and the openID config and generates a new JSON object
 * Confirms DomainName matches from POST request and new JSON object
 * Returns Boolean
 * 
 * @param {object} authorization - JSON object from the frontend containing attempted UD login credentials.
 * @param {string} client_id - Uauth login parameters from the frontend.
 */
const verifyUathLogin = async (authorization, client_id) => {
  try {
    const { data } = await axios(
      'https://auth.unstoppabledomains.com/.well-known/openid-configuration'
    );
    const { jwks_uri, issuer } = data;

    const verifyIdTokenResponse = await verifyIdToken(
      jwks_uri, // OpenID arg
      authorization.idToken.__raw, // raw token
      authorization.idToken.nonce, // raw nonce
      client_id, // uauth ClientID
      issuer // OpenID arg
    );

    const verifyIdTokenSub = verifyIdTokenResponse.sub;

    if (verifyIdTokenSub !== authorization.idToken.sub) {
      throw new Error('Mismatched Domains!');
    } else {
      // call verifyNotTransfered() if domain ownership transfer is a concern. Notable for social DAPPS
      //if (await verifyNotTransfered(authorization, storedCredentials)) {
      return true;
      //}
    }
  } catch (err) {
    throw new Error(err);
  }
}

export default verifyUathLogin