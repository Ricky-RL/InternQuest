import { createContext, useContext, useState, useEffect } from 'react';

const ProfileCtx = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: '',
    university: '',
    major: '',
    gradYear: '',
    skills: [],
    experience: '',
    resumeFileName: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('iq_profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const saveProfile = (data) => {
    setProfile(data);
    localStorage.setItem('iq_profile', JSON.stringify(data));
  };

  return (
    <ProfileCtx.Provider value={{ profile, saveProfile }}>
      {children}
    </ProfileCtx.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileCtx);
}

export function matchScore(job, profile) {
  if (!profile.skills.length) return null;
  const userSkills = profile.skills.map(s => s.toLowerCase());
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const matches = jobSkills.filter(s => userSkills.includes(s)).length;
  if (jobSkills.length === 0) return null;
  return Math.round((matches / jobSkills.length) * 100);
}

export default ProfileCtx;
