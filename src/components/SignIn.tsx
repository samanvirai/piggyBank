import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import piggyBankLogo from '../assets/piggyBankIcon.png';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [login, { loading, error }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(''); // Clear any previous error
    try {
      const { data } = await login({
        variables: {
          email,
          password,
        },
      });
      // Store the token in localStorage
      localStorage.setItem('token', data.login.token);
      // Navigate to home page
      navigate('/home');
    } catch (err) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center py-16 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <img src={piggyBankLogo} alt="PiggyBank Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-semibold font-lora">PiggyBank</h1>
      </div>
      
      <div className="w-full max-w-md p-8 border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-semibold font-lora text-center mb-6">Sign in to account</h2>
        
        {loginError && (
          <div className="mb-4 text-red-600 text-sm text-center">
            {loginError}
          </div>
        )}
        
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
            className="w-full bg-[#F3B000] text-black py-2 rounded-sm hover:bg-yellow-600 mb-6 font-roboto font-medium"
          >
            Sign In
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-black mb-4 font-roboto font-regular text-[13px]">Don't have an account?</p>
          <Link
            to="/signup"
            className="w-full inline-block bg-black font-roboto font-medium text-white py-2 rounded-sm hover:bg-gray-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 