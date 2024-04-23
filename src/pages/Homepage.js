import React from 'react';
import Carouselc from '../components/Carousel'; 

const Homepage = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-14"> {/* Added mb-12 for margin-bottom */}
        <h1 className="text-5xl font-bold mb-15">BOOKWEB</h1> {/* Added mb-4 for margin-bottom */}
        <p className="text-lg text-gray-600">Connect . Share . Read</p>
      </header>
      
      <section className="mb-8">
        <h2 className="text-2xl text-center text-gray-800 mb-4">About Us</h2>
        <p className="text-lg">Welcome to BookWeb, the premier platform fostering a vibrant reading community within your campus. 
        At BookWeb, we believe in the power of sharing knowledge through literature. Our mission is to provide a seamless and enriching experience for everyone,Facilitating the exchange of ideas as, one book at a time.
        Let's explore the endless possibilities found within each page, sharing the joy of reading and connecting with fellow book lovers..</p>
      </section>
      
      <section className="mb-7">
        <h2 className="text-2xl text-center font-bold mb-5">Top Trending Books</h2>
        <Carouselc/>
      </section>

      <section className="pt-20 mb-8">
  <h2 className="text-2xl text-center text-gray-800 mb-8">How BookWeb Works</h2>
  <div className="flex justify-center">
    <div className="max-w-md"> {/* Adjust max-width based on your design */}
      <h3 className="text-x1 text-gray-500 mb-2">1. Login or Create Your Account</h3>
      <h3 className="text-x1 text-gray-500 mb-2">2. Search for and find your next dream book</h3>
      <h3 className="text-x1 text-gray-500 mb-2">3. Connect with the book owner via WebChat</h3>
      <h3 className="text-x1 text-gray-500 mb-2">4. Get the book and enjoy your reading!</h3>
    </div>
  </div>
</section>

      
      <section>
        <h2 className="text-2xl text-center pt-20">Contact Us</h2>
        <p className="text-lg text-center">
          Have any questions or suggestions? Feel free to reach out to us at support.bookweb@gmail.com
        </p>
      </section>
    </div>
  );
}

export default Homepage;
