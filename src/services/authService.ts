/**
 * AWS Cloud Watcher - Authentication Service
 * 
 * To integrate with AWS Cognito User Pools:
 * 1. Install AWS Amplify Auth or Cognito SDK:
 *    npm install aws-amplify
 * 2. Configure Cognito:
 *    import { Amplify } from 'aws-amplify';
 *    Amplify.configure({
 *      Auth: {
 *        Cognito: {
 *          userPoolId: 'us-east-1_xxxxxxxxx',
 *          userPoolClientId: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
 *        }
 *      }
 *    });
 * 3. Replace the login / register calls with Amplify Auth:
 *    import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';
 */

import { delay } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role?: string;
}

export const authService = {
  // Simulate logging in
  login: async (email: string, password: string): Promise<User> => {
    await delay(600); // simulate API call
    
    // AWS Cognito implementation reference:
    // try {
    //   const { isSignedIn, nextStep } = await signIn({ username: email, password });
    //   const userAttributes = await fetchUserAttributes();
    //   return { id: userAttributes.sub, email, name: userAttributes.name };
    // } catch (error) {
    //   throw new Error(error.message);
    // }

    // Mock validation
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const mockUser: User = {
      id: 'usr-92813',
      email: email,
      name: email.split('@')[0].toUpperCase(),
      company: 'CloudOps Solutions Ltd.',
      role: 'DevOps & FinOps Administrator',
    };

    localStorage.setItem('aws_watcher_user', JSON.stringify(mockUser));
    return mockUser;
  },

  // Simulate register
  register: async (email: string, password: string, name: string): Promise<User> => {
    await delay(800);

    // AWS Cognito implementation reference:
    // try {
    //   const { isSignUpComplete, userId } = await signUp({
    //     username: email,
    //     password,
    //     options: {
    //       userAttributes: { email, name }
    //     }
    //   });
    //   return { id: userId, email, name };
    // } catch (error) {
    //   throw new Error(error.message);
    // }

    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const mockUser: User = {
      id: 'usr-' + Math.floor(Math.random() * 100000),
      email: email,
      name: name || email.split('@')[0],
      company: 'Personal Account',
      role: 'Administrator',
    };

    localStorage.setItem('aws_watcher_user', JSON.stringify(mockUser));
    return mockUser;
  },

  // Get current user session from local cache
  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    
    // AWS Cognito implementation reference:
    // try {
    //   const user = await getCurrentUser();
    //   const attributes = await fetchUserAttributes();
    //   return { id: user.userId, email: attributes.email, name: attributes.name };
    // } catch {
    //   return null;
    // }

    const cachedUser = localStorage.getItem('aws_watcher_user');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(300);
    
    // AWS Cognito implementation reference:
    // await signOut();

    localStorage.removeItem('aws_watcher_user');
  }
};
