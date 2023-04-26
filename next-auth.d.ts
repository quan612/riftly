import "next-auth/jwt"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    // userRole?: "admin"
  }
}



declare module 'next-auth' {
  export interface Session {
    user: {
      wallet?: string
      twitter?: string
      discord?: string
      email?: string
      avatar?: string
      uathUser?: string
      userId?: string
    };
    expires: string;
    provider: string;
  }
}
