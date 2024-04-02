

const Homepage = ()=>{

  
    return(
      <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold">BookWeb</h1>
        <p className="text-lg text-gray-600">Connect . Share . Read</p>
      </header>
      
      <section className="mb-8">
        <h2 className="text-2xl text-center text-gray-800 mb-4">About Us</h2>
        <p className="text-lg">Welcome to BookWeb, the premier platform fostering a vibrant reading community within your campus. 
        At BookWeb, we believe in the power of sharing knowledge through literature. Our mission is to provide a seamless and enriching experience for everyone, facilitating the exchange of ideas one book at a time. 
        We want to share the joy of reading and connecting with fellow book lovers. Together, let's explore the endless possibilities that lie behind every page.</p>
      </section>
      
      <section className=" pt-10">
        <h2 className="text-3xl text-center font-bold mb-8">Top Trending Books</h2>
        <ul>
          <li className="text-lg">1.The Seven Husbands of Evelyn Hugo</li>
          <li className="text-lg">2.The Song of Achilles</li>
          <li className="text-lg">3.The Midnight Library</li>
          {/* Add more books as needed */}
        </ul>
      </section>

      <section className="pt-20 mb-8">
        <h2 className="text-2xl text-center text-gray-800 mb-8">How BookWeb Works</h2>
        <h3 className="text-x1 text-center text-gray-500">1.  Login or Create Your Account</h3>
        <h3 className="text-x1 text-center text-gray-500">2.  Search for and find your next dream book</h3>
        <h3 className="text-x1 text-center text-gray-500">3.  Connect with the book owner via WebChat</h3>
        <h3 className="text-x1 text-center text-gray-500">4.  Get the book and enjoy your reading!</h3>
      </section>
      
      
      <section>
        <h2 className="text-2xl text-center pt-20">Contact Us</h2>
        <p className="text-lg">Have any questions or suggestions? Feel free to reach out to us at support.bookweb@gmail.com</p>
      </section>
    </div>
    )
}

export default Homepage;