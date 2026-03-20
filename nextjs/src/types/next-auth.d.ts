import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    isAdmin: boolean;
    isSeller: boolean;
    hasAd: boolean;
    account: string;
    sellerName: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      isSeller: boolean;
      hasAd: boolean;
      account: string;
      sellerName: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    isAdmin: boolean;
    isSeller: boolean;
    hasAd: boolean;
    account: string;
    sellerName: string;
  }
}
