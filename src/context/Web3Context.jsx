import React, { useState, useEffect } from 'react'
import { signIn, signOut } from 'next-auth/react'

import { ethers, utils } from 'ethers'
import axios from 'axios'
import Enums from 'enums'
import WalletConnectProvider from '@walletconnect/web3-provider'
import UAuth from '@uauth/js'

const { default: Resolution } = require('@unstoppabledomains/resolution')
const resolution = new Resolution()
const uauth = new UAuth({
  clientID: process.env.NEXT_PUBLIC_UNSTOPPABLE_CLIENT_ID,
  redirectUri: process.env.NEXT_PUBLIC_UNSTOPPABLE_REDIRECT_URI,
  scope: 'openid wallet',
})

export const Web3Context = React.createContext()
export function Web3Provider({ session, children }) {
  const [web3Error, setWeb3Error] = useState(null)

  let signMessageTimeout, adminSignTimeout

  useEffect(() => {
    removeLocalStorageWalletConnect()
    document.addEventListener('visibilitychange', function () {
      // if (window.visibilityState === "hidden") {
      localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
      //  }
    })

    return () => {
      if (signMessageTimeout) {
        clearTimeout(signMessageTimeout)
      }
      if (adminSignTimeout) clearTimeout(adminSignTimeout)
    }
  }, [])

  useEffect(async () => {
    if (session && window?.ethereum) {
      if (window?.ethereum) {
        subscribeProvider(window.ethereum)
      }
    }
  }, [session])

  const subscribeProvider = async (provider) => {
    provider.on('error', (e) => console.error('WS Error', e))
    provider.on('end', (e) => console.error('WS End', e))

    provider.on('accountsChanged', async (accounts) => {
      SignOut()
    })

    provider.on('chainChanged', async (chainId) => {
      SignOut()
    })

    provider.on('connect', (info) => {
      console.log('connect')
    })

    provider.on('disconnect', async (error) => {
      SignOut()
    })
  }

  const signInWithWallet = async (walletType, payload = null) => {
    if (!walletType) {
      throw new Error('Missing wallet type.')
    }

    if (payload) {
      //automatic sign in without sign message
      let { signature, address } = payload
      await signIn('web3-wallet', {
        redirect: true,
        signature,
        address,
        callbackUrl: `${window.location.origin}`,
      }).catch((error) => {
        throw new Error(error.message)
      })
      return
    }
    try {
      let addresses, providerInstance

      if (walletType === Enums.METAMASK) {
        providerInstance = new ethers.providers.Web3Provider(window.ethereum)
        addresses = await providerInstance.send('eth_requestAccounts', [])
        subscribeProvider(window.ethereum)
      } else if (walletType === Enums.WALLETCONNECT) {
        let provider = new WalletConnectProvider({
          infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
          qrcodeModalOptions: {
            mobileLinks: ['trust', 'metamask', 'coinbase', 'rainbow'],
            desktopLinks: ['encrypted ink'],
          },
        })
        await provider.enable()

        providerInstance = new ethers.providers.Web3Provider(provider)

        addresses = provider?.accounts
        subscribeProvider(provider)
      }

      if (addresses.length === 0) {
        throw new Error('Account is locked, or is not connected, or is in pending request.')
      }
      // const user = await axios
      //   .get(`${Enums.BASEPATH}/api/user`, {
      //     params: {
      //       address: addresses[0],
      //     },
      //   })
      //   .then((r) => r.data)

      // if (!user || user.isError) {
      //   throw new Error('User not found, please sign up.')
      // }

      const promise = new Promise((resolve, reject) => {
        let timeout = setTimeout(async function () {
          try {
            const signer = await providerInstance.getSigner()
            const signature = await signer.signMessage(`${Enums.USER_SIGN_MSG}`).catch((err) => {
              throw new Error('User rejects signing.')
            })

            if (signature && addresses[0] && signature) {
              signIn('web3-wallet', {
                redirect: true,
                signature,
                address: addresses[0],
                callbackUrl: `${window.location.origin}`,
              }).catch((error) => {
                reject(error.message)
              })
              clearTimeout(timeout)
              resolve()
            }
            clearTimeout(timeout)
            reject('Missing address or signature')
          } catch (e) {
            clearTimeout(timeout)
            reject(e)
          }
        }, 800)
      })

      return promise
    } catch (error) {
      if (error.message.indexOf('user rejected signing') !== -1) {
        throw new Error('User rejected signing')
      } else {
        console.log(error)
        throw error
      }
    }
  }

  const signUpWithWallet = async (walletType) => {
    if (!walletType) {
      throw new Error('Missing type of wallet when trying to setup wallet provider')
    }

    let addresses, providerInstance

    if (walletType === Enums.METAMASK) {
      providerInstance = new ethers.providers.Web3Provider(window.ethereum)
      addresses = await providerInstance.send('eth_requestAccounts', [])
    } else if (walletType === Enums.WALLETCONNECT) {
      let provider = new WalletConnectProvider({
        infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
        qrcodeModalOptions: {
          mobileLinks: ['trust'],
          desktopLinks: ['encrypted ink'],
        },
      })
      await provider.enable()

      providerInstance = new ethers.providers.Web3Provider(provider)
      addresses = provider.accounts
    }

    if (addresses.length === 0) {
      setWeb3Error('Account is locked, or is not connected, or is in pending request.')
      return
    }

    const promise = new Promise((resolve, reject) => {
      let timeout = setTimeout(async function () {
        try {
          let signer, signature

          signer = await providerInstance.getSigner()

          signature = await signer.signMessage(`${Enums.USER_SIGN_MSG}`).catch((err) => {
            console.log(1)
            throw new Error('User rejects signing.')
          })

          if (signature && addresses[0]) {
            resolve({ signature, address: addresses[0] }) // if the previous line didn't always throw
            // clearTimeout(timeout);
          }
          reject('Missing address or signature')
        } catch (e) {
          reject(e)
        }
      }, 500)
    })

    return promise
  }

  const SignOut = async () => {
    removeLocalStorageWalletConnect()
    removeLocalStorageUath()
    signOut()
  }

  const unstoppableLogin = async () => {
    const authorization = await uauth.loginWithPopup()
    // console.log(authorization);
    // let authorization = true;
    if (!authorization) {
      console.log('no auth')
      throw new Error('Missing authorization ')
    }
    console.log('has auth')
    // const user = await uauth.user()
    console.log(authorization)
    // // let uathUser = "quan612.wallet";
    // // let address = "0x9128c112f6bb0b2d888607ae6d36168930a37087";
    // // let message = "";
    // // let signature = "";

    await signIn('unstoppable-authenticate', {
      redirect: true,
      authorization,
      // authorization: JSON.stringify(authorization),
      callbackUrl: `${window.location.origin}`,
    })
  }

  return (
    <Web3Context.Provider
      value={{
        signInWithWallet,
        SignOut,
        signUpWithWallet,
        unstoppableLogin,
        web3Error,
        setWeb3Error,
        session,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

const removeLocalStorageWalletConnect = () => {
  const walletConnectCache = localStorage.getItem('walletconnect')
  if (walletConnectCache) {
    localStorage.removeItem('walletconnect')
  }
  const walletMobileCache = localStorage.getItem('WALLETCONNECT_DEEPLINK_CHOICE')
  if (walletMobileCache) {
    localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
  }
}

const removeLocalStorageUath = () => {
  const openidCache = localStorage.getItem('openidConfiguration:')
  if (openidCache) {
    localStorage.removeItem('openidConfiguration:')
  }
  const uathRequestCache = localStorage.getItem('request')
  if (uathRequestCache) {
    localStorage.removeItem('request')
  }
  const uathUserCache = localStorage.getItem('username')
  if (uathUserCache) {
    localStorage.removeItem('username')
  }
}
