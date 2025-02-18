import React, { useState } from 'react';
import piggyBankLogo from '../assets/piggyBankIcon.png';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const SIGNUP = gql`
  mutation SignUp(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      email: $email
      password: $password
    ) {
      token
    }
  }
`;

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');

  const [signUp, { loading, error }] = useMutation(SIGNUP);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await signUp({
        variables: {
          email,
          firstName,
          lastName,
          phoneNumber: "", // Add phoneNumber state if needed
          password,
        },
      });
      
      // Store the token in localStorage
      localStorage.setItem('token', data.signUp.token);
      
      // Use React Router's navigate instead of window.location
      navigate('/home');
      
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center py-16 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/signin" className="flex items-center gap-2">
          <img src={piggyBankLogo} alt="PiggyBank Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold font-lora">PiggyBank</h1>
        </Link>
      </div>
      
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 font-lora">Create your account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-regular font-roboto text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-regular font-roboto text-black mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-regular font-roboto text-black mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dateOfBirth" className="block text-sm font-regular font-roboto text-black mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-regular font-roboto text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#F3B000] font-roboto font-medium text-[13px] text-black py-2 rounded-sm hover:bg-yellow-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 