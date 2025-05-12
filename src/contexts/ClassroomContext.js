import { createContext, useContext } from 'react';

export const ClassroomContext = createContext(null);

// Context를 쉽게 사용하기 위한 커스텀 훅
export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within a ClassroomContextProvider');
  }
  return context;
};
