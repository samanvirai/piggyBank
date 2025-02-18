import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_SENT_GIFTS = gql`
  query SENT_GIFTS {
    sentGifts {
      id
      sentFromName
      sentFromEmail
      sentFromProfilePicture
      sentToName
      sentToEmail
      sentToProfilePicture
      stock
      stockUrl
      amount
      createdAt
    }
  }
`;

const GET_RECEIVED_GIFTS = gql`
  query RECEIVED_GIFTS {
    receivedGifts {
      id
      sentFromName
      sentFromEmail
      sentFromProfilePicture
      sentToName
      sentToEmail
      sentToProfilePicture
      stock
      stockUrl
      amount
      createdAt
    }
  }
`;

const GET_ALL_ASSETS = gql`
  query ALL_ASSETS {
    assets {
      id
      name
      ticker
    }
  }
`;

const SEND_GIFT = gql`
  mutation SendGift($email: String!, $amount: Int!, $assetId: String!) {
    sendGift(email: $email, amount: $amount, assetId: $assetId) {
      success
    }
  }
`;

const Gift: React.FC = () => {
  const { loading: sentLoading, error: sentError, data: sentData } = useQuery(GET_SENT_GIFTS, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  const { loading: receivedLoading, error: receivedError, data: receivedData } = useQuery(GET_RECEIVED_GIFTS, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  const { data: assetsData } = useQuery(GET_ALL_ASSETS);

  const [sendGift, { loading: sendingGift }] = useMutation(SEND_GIFT, {
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    },
    refetchQueries: [{
      query: GET_SENT_GIFTS,
      context: {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    }],
  });


  const [activeData, setActiveData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSendGiftModal, setShowSendGiftModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('sent');
  const [amount, setAmount] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  useEffect(() => {
    if (selectedTab === 'sent' && sentData?.sentGifts) {
      setActiveData(sentData.sentGifts);
    } else if (selectedTab === 'received' && receivedData?.fromGifts) {
      setActiveData(receivedData.fromGifts);
    }
  }, [selectedTab, sentData, receivedData]);

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const openSendGiftModal = () => {
    setShowSendGiftModal(true);
  };

  const closeSendGiftModal = () => {
    setShowSendGiftModal(false);
  };

  const handleSendGift = async () => {
    try {
      if (!recipientEmail || !amount || !selectedStock) {
        alert('Please fill in all fields');
        return;
      }

      await sendGift({
        variables: {
          email: recipientEmail,
          amount: parseInt(amount),
          assetId: selectedStock
        }
      });

      closeSendGiftModal();
      setAmount('');
      setSelectedStock('');
      setRecipientEmail('');
    } catch (error) {
      console.error('Error sending gift:', error);
      alert('Failed to send gift');
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    if (tab === 'sent') {
      setActiveData(sentData?.sentGifts ?? []);
    } else if (tab === 'received') {
      setActiveData(receivedData?.fromGifts ?? []);
    }
  };

  const convertGoogleDriveUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/40';
    const fileId = url.match(/\/d\/(.+?)\/view/)?.[1];
    return fileId 
      ? `https://drive.google.com/uc?export=view&id=${fileId}`
      : url;
  };

  if (sentLoading || receivedLoading) return <p>Loading...</p>;
  if (sentError || receivedError) return <p>Error: {sentError?.message || receivedError?.message}</p>;

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex justify-between mb-4 p-12 pb-4">
          <h1 className="text-[30px] font-semibold mb-10 font-lora">Activity</h1>
          <button
            className="h-10 px-8 bg-[#FFA500] text-black text-[13px] font-medium font-roboto rounded hover:bg-[#F59E0B]"
            onClick={openSendGiftModal}
          >
            Send Gift
          </button>
        </div>
        
        <div className="flex justify-between px-8">
          <div className="flex gap-8">
            <button
              className={`py-2 relative text-lg ${
                selectedTab === 'sent'
                  ? 'text-black font-medium font-roboto text-[16px] border-b-[3px] border-[#FFA500]' 
                  : 'text-gray-300 font-medium font-roboto text-[16px]'
              }`}
              onClick={() => handleTabClick('sent')}
            >
              Sent
            </button>
            <button
              className={`py-2 relative text-lg ${
                selectedTab === 'received'
                  ? 'text-black font-medium font-roboto text-[16px] border-b-[3px] border-[#FFA500]' 
                  : 'text-gray-300 font-medium font-roboto text-[16px]'
              }`}
              onClick={() => handleTabClick('received')}
            >
              Received
            </button>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-gray-200" />
      <div className="p-4">
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4 font-roboto text-[16px] font-normal">User</th>
              <th className="py-2 px-4 font-roboto text-[16px] font-normal">Amount</th>
              <th className="py-2 px-4 font-roboto text-[16px] font-normal">Worth</th>
              <th className="py-2 px-4 font-roboto text-[16px] font-normal">Date</th>
              <th className="py-2 px-4 font-roboto text-[16px] font-normal">Stock</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((item, index) => (
              <tr
                key={item.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(item)}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedTab === 'sent' 
                        ? convertGoogleDriveUrl(item.sentToProfilePicture)
                        : convertGoogleDriveUrl(item.sentFromProfilePicture)
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <div>
                      <div className="font-roboto font-medium">
                        {selectedTab === 'sent' ? item.sentToName : item.sentFromName}
                      </div>
                      <div className="text-gray-500 text-sm font-roboto">
                        {selectedTab === 'sent' ? item.sentToEmail : item.sentFromEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 font-roboto">${item.amount}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                    N/A
                  </span>
                </td>
                <td className="py-4 px-4 font-roboto">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="w-8 h-8">
                    {item.stock}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Details</h2>
            <p><strong>User:</strong> {selectedItem.user}</p>
            <p><strong>Amount:</strong> {selectedItem.amount}</p>
            <p><strong>Worth:</strong> {selectedItem.worth}</p>
            <p><strong>Date:</strong> {selectedItem.date}</p>
            <p><strong>Stock:</strong> {selectedItem.stock}</p>
            <button
              className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSendGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold font-lora text-center w-full">Send a Gift</h2>
              <button 
                onClick={closeSendGiftModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Recipient's email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount to send"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Stock</label>
                <select 
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                >
                  <option value="">Select a stock</option>
                  {assetsData?.assets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.ticker})
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="w-full py-3 mt-4 bg-[#FFA500] text-black font-medium rounded-lg hover:bg-[#F59E0B] transition-colors"
                onClick={handleSendGift}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gift; 