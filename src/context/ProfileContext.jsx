import { createContext, useState } from 'react';

const ProfileCtx = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('iq_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      university: '',
      major: '',
      gradYear: '',
      skills: [],
      experience: '',
      resumeFileName: '',
    };
  });

  const saveProfile = (data) => {
    const merged = { ...profile, ...data };
    setProfile(merged);
    localStorage.setItem('iq_profile', JSON.stringify(merged));
  };

  return (
    <ProfileCtx.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export default ProfileCtx;
