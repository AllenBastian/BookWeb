import React from 'react';
import Carouselc from '../components/Carousel'; 
import { User, Search, MessageCircle, BookOpen } from 'react-feather';

const Homepage = ()=>{

    return(
      <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold">BookWeb</h1>
        <p className="text-lg text-grey-600">Connect . Share . Read</p>
      </header>
      
      <section className="mb-8">
        <h2 className="text-2xl text-center text-gray-800 mb-4">About Us</h2>
        <p className="text-lg">Welcome to BookWeb, the premier platform fostering a vibrant reading community within your campus. 
        At BookWeb, we believe in the power of sharing knowledge through literature. Our mission is to provide a seamless and enriching experience for everyone, facilitating the exchange of ideas one book at a time. 
        We want to share the joy of reading and connecting with fellow book lovers. Together, let's explore the endless possibilities that lie behind every page.</p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl text-center font-bold mb-4">Top Trending Books</h2>
        <Carouselc/>
      </section>


   

<section className="pt-20 mb-8">
    <h2 className="text-2xl text-center text-gray-800 mb-8">How BookWeb Works</h2>
    <div className="flex justify-center  mb-8 p-10 ">
        <div className="flex items-center flex-col items-center mr-4">
            <User className="text-3xl text-red-500 mr-2" />
            <h3 className="text-x1 text-center text-500 p-5">1.  Login or Create Your Account</h3>
        </div>
        <div className="flex items-center flex-col items-center mr-4">
            <Search className="text-3xl text-red-500 mr-2" />
            <h3 className="text-x1 text-center text-500 p-5">2.  Search for and find your next dream book</h3>
        </div>
        <div className="flex items-center flex-col items-center mr-4">
            <MessageCircle className="text-3xl text-red-500 mr-2" />
            <h3 className="text-x1 text-center text-500 p-5">3.  Connect with the book owner via WebChat</h3>
        </div>
        <div className="flex items-center flex-col items-center ">
            <BookOpen className="text-3xl text-red-500 mr-2" />
            <h3 className="text-x1 text-center text-500 p-5">4.  Get the book and enjoy your reading!</h3>
        </div>
    </div>
</section>
      
      <section>
        <h2 className="text-2xl text-center pt-20">Contact Us</h2>
        <p className="text-lg text-center p-10">Have any questions or suggestions? Feel free to reach out to us at support.bookweb@gmail.com</p>
      </section>
    </div>
    )
}

export default Homepage;