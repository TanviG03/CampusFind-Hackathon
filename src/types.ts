export type ReportStatus = 'Lost' | 'Found';

export type CampusItem = {
  id: string;
  title: string;
  status: ReportStatus;
  category: string;
  location: string;
  date: string;
  imageUri?: string;
  description: string;
  owner: string;
  icon: string;
  accent: string;
  createdByMe: boolean;
  resolved?: boolean;
  resolutionStatus?: 'Recovered' | 'Returned';
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  ReportLost: undefined;
  ReportFound: undefined;
  ItemDetails: { itemId: string; justCreated?: boolean };
};

export type MainTabParamList = {
  Home: undefined;
  Browse: undefined;
  MyReports: undefined;
  Profile: undefined;
};
