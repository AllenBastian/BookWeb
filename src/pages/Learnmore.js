import React from 'react';

const teamMembers = [
  {
    name: 'Allen Bastian Joy',
    role: 'Founder & CEO',
    image: '/images/allen.jpg', // Update with actual image paths
    description: 'Alice is passionate about books and community building.',
  },
  {  
    name: 'Alina Mary Sam',
    role: 'Chief Technology Officer',
    image: '/images/ali.jpg', // Update with actual image paths
    description: 'Bob is the tech wizard making sure everything runs smoothly.',
  },
  {
    name: 'Hridya Syju',
    role: 'Developer',
    image: '/images/hridya.jpg',
    description: 'Hridya is the enthuasist techi.',
  },
  {
    name: 'Beneeta Bency',
    role: 'Manager',
    image: '/images/mwthe.jpg',
    description: 'Beneeta is a developer',
  },
  // Add more team members as needed
];

const LearnMore = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Meet Our Team</h1>
      </header>
      <div className="flex flex-wrap justify-center gap-8">
        {teamMembers.map((member, index) => (



          <div key={index} className="w-full md:w-1/3 p-4 text-center bg-white rounded-lg shadow-lg">
            <img src={member.image} alt={member.name} className="w-32 h-32 mx-auto rounded-full mb-4" />
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-gray-600 mb-2">{member.role}</p>
            <p className="text-lg">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;
