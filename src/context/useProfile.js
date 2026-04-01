import { useContext } from 'react';
import ProfileCtx from './ProfileContext';

export function useProfile() {
  const ctx = useContext(ProfileCtx);
  if (ctx === null) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
}
