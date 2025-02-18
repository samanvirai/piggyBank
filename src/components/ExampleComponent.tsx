import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_DATA = gql`
  query GetData {
    data {
      id
      name
    }
  }
`;

const ExampleComponent: React.FC = () => {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.data.map((item: any) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default ExampleComponent; 