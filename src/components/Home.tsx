import { gql, useQuery } from '@apollo/client';
import React from 'react';

const METRICS = gql`
  query {
    giftCounts {
      giftsReceived
      giftsSent
    }
  }
`;

const Home: React.FC = () => {
  const { data, loading, error } = useQuery(METRICS, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading gift counts</div>;

  const sentGifts = data.giftCounts.giftsSent || 0;
  const receivedGifts = data.giftCounts.giftsReceived || 0;

  return (
    <div className="p-12">
      <h1 className="text-[30px] font-semibold mb-14 font-lora">Your Gifting</h1>
      <div className="flex space-x-4">
        <div className="flex flex-col items-start justify-center w-40 h-24 bg-gray-100 rounded-xl px-5">
          <span className="text-2xl font-bold font-roboto">{sentGifts}</span>
          <span className="text-s font-regular font-roboto mt-1">Gifts sent</span>
        </div>
        <div className="flex flex-col items-start justify-center w-40 h-24 bg-gray-100 rounded-xl px-5">
          <span className="text-2xl font-bold font-roboto">{receivedGifts}</span>
          <span className="text-s font-regular font-roboto mt-1">Gifts received</span>
        </div>
      </div>
    </div>
  );
};

export default Home; 