import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

import { getUser } from '@/lib/db/queries';
import { login as loginService } from '../../services/login.service';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

// Mở rộng type User để hỗ trợ thêm các trường chúng ta cần
interface CustomUser extends User {
  accessToken?: string;
  tokenType?: string;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  session: {
    // Sử dụng strategy là "jwt" để dễ quản lý, nhưng với maxAge ngắn để tránh cache lâu
    strategy: "jwt",
    maxAge: 60 * 60, // 1 giờ thay vì 30 ngày mặc định
  },
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        try {
          console.log('Calling login API with:', email);
          // Luôn gọi API đăng nhập mới
          const loginResponse = await loginService(email, password);
          console.log('Login API response:', loginResponse);
          
          // Kiểm tra nếu loginResponse có token
          if (loginResponse && loginResponse.access_token) {
            try {
              // Giải mã JWT token để lấy thông tin người dùng
              const decodedToken = jwtDecode(loginResponse.access_token);
              console.log('Decoded token:', decodedToken);
              
              // Tạo user object từ token và email
              const user: CustomUser = {
                id: typeof decodedToken.sub === 'string' ? decodedToken.sub : email,
                email: email,
                name: email.split('@')[0] || null,
                // Thêm các trường accessToken và tokenType
                accessToken: loginResponse.access_token,
                tokenType: loginResponse.token_type
              };
              
              return user;
            } catch (decodeError) {
              console.error('Failed to decode JWT:', decodeError);
              
              // Nếu không giải mã được token, vẫn trả về user với thông tin tối thiểu
              const user: CustomUser = {
                id: email,
                email: email,
                name: email.split('@')[0] || null,
                accessToken: loginResponse.access_token,
                tokenType: loginResponse.token_type
              };
              
              return user;
            }
          }
          
          // Nếu không có token, trả về null
          console.error('No access_token in response');
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Thêm timestamp để đảm bảo token luôn được refresh
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        // Lưu token từ API response vào JWT
        token.accessToken = customUser.accessToken;
        token.tokenType = customUser.tokenType;
        // Thêm timestamp để đánh dấu thời gian tạo token
        token.createdAt = Date.now();
      }

      // Kiểm tra xem token có cần refresh không
      const shouldRefreshTime = Math.floor((Date.now() - (token.createdAt as number || 0)) / 1000);
      // Nếu token đã tồn tại quá 30 phút, đánh dấu cần refresh
      if (shouldRefreshTime > 30 * 60) {
        token.needsRefresh = true;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Thêm các thông tin từ token vào session
        (session as any).accessToken = token.accessToken;
        (session as any).tokenType = token.tokenType;
        // Thêm thông tin về timestamp
        (session as any).createdAt = token.createdAt;
        (session as any).needsRefresh = token.needsRefresh;
      }

      return session;
    },
  },
});
