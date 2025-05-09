'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';
import { login as loginService, register as registerService } from '../../services/login.service';

import { signIn, signOut } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    // Trước khi đăng nhập, đảm bảo đăng xuất phiên hiện tại
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // Bỏ qua lỗi đăng xuất nếu có
    }
    
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    try {
      console.log('Calling login service with:', validatedData.email);
      
      // Đăng nhập vào NextAuth với provider credentials
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        return { status: 'failed' };
      }
      
      console.log('Login successful');
      return { status: 'success' };
    } catch (error) {
      console.error('Login failed:', error);
      return { status: 'failed' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    // Đăng xuất phiên hiện tại trước khi đăng ký
    try {
      await signOut({ redirect: false });
    } catch (e) {
      // Bỏ qua lỗi đăng xuất nếu có
    }
    
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    try {
      // Gọi API đăng ký
      await registerService(
        validatedData.email,
        validatedData.password
      );
      
      // Đăng nhập sau khi đăng ký thành công
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        console.error('Sign in after registration error:', signInResult.error);
        return { status: 'failed' };
      }

      return { status: 'success' };
    } catch (error) {
      // Kiểm tra nếu người dùng đã tồn tại
      if (error instanceof Error && error.message.includes('already exists')) {
        return { status: 'user_exists' };
      }
      
      console.error('Registration failed:', error);
      return { status: 'failed' };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
