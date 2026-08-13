export type ContentCredentialRow = {
  id: string;
  name: string;
  organization: string;
  type: string;
  products: number;
  repositories: number;
  alternateContentSources: number;
};

export const MOCK_CONTENT_CREDENTIALS: ContentCredentialRow[] = [
  {
    id: '1',
    name: 'RH CA',
    organization: 'Demo',
    type: 'Certificate',
    products: 0,
    repositories: 0,
    alternateContentSources: 0,
  },
];
