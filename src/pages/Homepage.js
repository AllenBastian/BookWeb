import React from 'react';
import Carouselc from '../components/Carousel'; 
import { User, Search, MessageCircle, BookOpen } from 'react-feather';

const Homepage = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold">BookWeb</h1>
        <p className="text-lg text-grey-600">Connect . Share . Read</p>
      </header>
      
      <section className="mb-8">
  <h2 className="text-2xl text-center text-gray-800 mb-4">About Us</h2>
  <p className="text-lg text-justify">
    Welcome to BookWeb, the premier platform fostering a vibrant reading community within your campus. 
    At BookWeb, we believe in the power of sharing knowledge through literature. Our mission is to provide a seamless and enriching experience for everyone, facilitating the exchange of ideas one book at a time. 
    We want to share the joy of reading and connecting with fellow book lovers. Together, let's explore the endless possibilities that lie behind every page.
  </p>
</section>
     

      <section className="pt-20 mb-8">
  <h2 className="text-2xl text-center text-gray-800 mb-8">How BookWeb Works</h2>
  <div className="flex flex-col gap-5 md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
    <div className="flex flex-col items-center justify-center text-center md:text-left md:w-96 p-6 bg-white rounded-xl shadow-lg h-96">
      <User className="text-3xl text-red-500 mb-2" size={50} />
      <h3 className="text-lg font-semibold mb-2">1. Login or Create Your Account</h3>
      <p className="text-lg">Login or create your account to start exploring our platform.</p>
    </div>

    <div className="flex flex-col items-center justify-center text-center md:text-left md:w-96 p-6 bg-white rounded-xl shadow-lg h-96">
      <Search className="text-3xl text-red-500 mb-2" size={50} />
      <h3 className="text-lg font-semibold mb-2">2. Search for and find your next dream book</h3>
      <p className="text-lg">Use our search feature to find the books you're interested in.</p>
    </div>

    <div className="flex flex-col items-center justify-center text-center md:text-left md:w-96 p-6 bg-white rounded-xl shadow-lg h-96">
      <MessageCircle className="text-3xl text-red-500 mb-2" size={50} />
      <h3 className="text-lg font-semibold mb-2">3. Connect with the book owner via WebChat</h3>
      <p className="text-lg">Chat with the book owner to arrange borrowing or lending.</p>
    </div>

    <div className="flex flex-col items-center justify-center text-center md:text-left md:w-96 p-6 bg-white rounded-xl shadow-lg h-96">
      <BookOpen className="text-3xl text-red-500 mb-2" size={50} />
      <h3 className="text-lg font-semibold mb-2">4. Get the book and enjoy your reading!</h3>
      <p className="text-lg">Once connected, get the book and start reading!</p>
    </div>
  </div>
</section>


      <section>
        <h2 className="text-2xl text-center pt-20">Contact Us</h2>
        <p className="text-lg text-center p-10">Have any questions or suggestions? Feel free to reach out to us at support.bookweb@gmail.com</p>
      </section>
    </div>
  );
};

export default Homepage;
