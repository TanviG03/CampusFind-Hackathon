import React, { createContext, useContext, useMemo, useState } from 'react';
import { initialItems } from '../data/items';
import { CampusItem } from '../types';

type NewReport = Omit<CampusItem, 'id' | 'owner' | 'createdByMe'>;

type CampusFindContextValue = {
  items: CampusItem[];
  userName: string;
  setUserName: (name: string) => void;
  addReport: (report: NewReport) => CampusItem;
  markResolved: (itemId: string, resolutionStatus: 'Recovered' | 'Returned') => void;
};

const CampusFindContext = createContext<CampusFindContextValue | undefined>(undefined);

export function CampusFindProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState(initialItems);
  const [userName, setUserName] = useState('Alex Morgan');

  const value = useMemo<CampusFindContextValue>(
    () => ({
      items,
      userName,
      setUserName,
      addReport: (report) => {
        const created: CampusItem = {
          ...report,
          id: `cf-${Date.now()}`,
          owner: userName,
          createdByMe: true,
        };
        setItems((current) => [created, ...current]);
        return created;
      },
      markResolved: (itemId, resolutionStatus) => {
        setItems((current) => current.map((item) => (
          item.id === itemId ? { ...item, resolved: true, resolutionStatus } : item
        )));
      },
    }),
    [items, userName],
  );

  return <CampusFindContext.Provider value={value}>{children}</CampusFindContext.Provider>;
}

export function useCampusFind() {
  const context = useContext(CampusFindContext);
  if (!context) {
    throw new Error('useCampusFind must be used within CampusFindProvider');
  }
  return context;
}
