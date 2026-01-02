import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

interface DecodedFirebaseToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

@Injectable()
export class AuthService {
  private projectId: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.projectId = this.configService.get<string>('FIREBASE_PROJECT_ID') || '';
  }

  /**
   * Verifica el token de Firebase usando la API pública de Google
   * No requiere Admin SDK ni private key
   */
  async verifyFirebaseToken(token: string): Promise<DecodedFirebaseToken> {
    try {
      // Verificar token usando la API pública de Google
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
      );

      if (!response.ok) {
        // Intentar con la API de Firebase
        const firebaseResponse = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.configService.get('NEXT_PUBLIC_FIREBASE_API_KEY')}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: token }),
          },
        );

        if (!firebaseResponse.ok) {
          throw new UnauthorizedException('Invalid Firebase token');
        }

        const firebaseData = await firebaseResponse.json();
        const user = firebaseData.users?.[0];

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        return {
          uid: user.localId,
          email: user.email,
          name: user.displayName,
          picture: user.photoUrl,
          email_verified: user.emailVerified,
        };
      }

      const data = await response.json();

      // Verificar que el token sea para nuestro proyecto
      if (data.aud !== this.projectId && !data.aud?.includes('firebase')) {
        throw new UnauthorizedException('Token not for this project');
      }

      return {
        uid: data.sub,
        email: data.email,
        name: data.name,
        picture: data.picture,
        email_verified: data.email_verified === 'true',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async loginOrRegister(firebaseToken: string) {
    const decoded = await this.verifyFirebaseToken(firebaseToken);

    let user = await this.prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          email: decoded.email!,
          name: decoded.name || decoded.email!.split('@')[0],
          photoUrl: decoded.picture || null,
        },
      });

      // Initialize progress: unlock Mission 1
      await this.prisma.missionProgress.create({
        data: {
          userId: user.id,
          missionId: 1,
          status: 'available',
        },
      });
    }

    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }
}
