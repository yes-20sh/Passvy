export interface FirebaseDecodedToken {
  email?: string;
  name?: string;
  uid: string;
}

export interface FirebaseAuthClient {
  verifyIdToken(idToken: string): Promise<FirebaseDecodedToken>;
}
