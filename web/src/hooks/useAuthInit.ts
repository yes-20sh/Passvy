'use client';

import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GetSettingsDocument } from '@/gql/graphql';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import { useAppSelector } from '@/store/hooks/useAppSelector';
import { login, logout } from '@/store/slices/authSlice';

export const useAuthInit = () => {
  const client = useApolloClient();
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isInitialized) return;

    const verifySession = async () => {
      try {
        const { data } = await client.query({
          query: GetSettingsDocument,
          fetchPolicy: 'network-only',
          errorPolicy: 'none',
        });

        if (data?.getSettings?.data) {
          dispatch(
            login({
              email: data.getSettings.data.email ?? '',
              fullName: data.getSettings.data.fullName ?? '',
              mobileNumber: data.getSettings.data.mobileNumber ?? '',
            }),
          );
        } else {
          dispatch(logout());
        }
      } catch {
        dispatch(logout());
      }
    };

    void verifySession();
  }, [client, dispatch, isInitialized]);
};
