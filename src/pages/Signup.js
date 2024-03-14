import React, { useState } from 'react';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [semester, setSemester] = useState('');
  const [contact, setContact] = useState('');
  const [department, setDepartment] = useState('');

  const handleSignUp = () => {
    console.log('Signing up with:', { name, college, semester, contact, department });
    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-1/2 ">
        <img src="images/p2.jpg" alt="Image" className=" w-full h-auto" style={{ maxHeight: '78vh' }} />
      </div>
      <div className="bg-white p-7 rounded-md shadow-md " >
        <h2 className="text-2xl font-semibold mb-4">Welcome to BOOKWEB!</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="College"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button onClick={handleSignUp} className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500">Sign Up</button>
      </div>
    </div>
  );
};

export default SignUpForm;
