import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import admin from 'firebase-admin';
import serviceAccount from './passvy-4ca45-b64d04571479.json';

@Injectable()
export class FirebaseConfigService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseConfigService.name);
  public app!: admin.app.App;

  onModuleInit() {
    const existingApp = admin.apps[0];
    if (existingApp) {
      this.app = existingApp;
      return;
    }

    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
          projectId: serviceAccount.project_id,
        }),
      });
      this.logger.log('Firebase Admin SDK successfully initialized.');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Firebase Admin SDK',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  getAuth(): admin.auth.Auth {
    if (!this.app) {
      throw new Error('Firebase app not initialized');
    }
    return admin.auth(this.app);
  }
}

export { admin };
