import React from "react";
import Carousel from "react-multi-carousel";                          
import "react-multi-carousel/lib/styles.css";
import "../pages/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 5,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 767, min: 300 },
    items: 2,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const sliderImageUrl = [
  {
    // Example Open Library Covers API URL
    url: "https://covers.openlibrary.org/b/ISBN/978-0-141-34565-9-L.jpg" // Replace ISBN and value with actual book information
  },
  {
    url: "https://covers.openlibrary.org/b/ISBN/1-55597-164-4-L.jpg" // Example cover URL
  },
  {
    url: "https://covers.openlibrary.org/b/ISBN/978-1-77338-012-4-L.jpg" // Example cover URL
  },
  {
    url: "https://covers.openlibrary.org/b/978-0-141-34565-9-L.jpg" // Example cover URL
  },
  {
    url: "https://covers.openlibrary.org/b/ISBN/978-2-89377-571-5-L.jpg" // Example cover URL
  }
];

const Carouselc = () => {
  return (
    <div className="parent">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {sliderImageUrl.map((imageUrl, index) => {
          return (
            <div className="slider" key={index}>
              <img src={imageUrl.url} alt="book cover" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Carouselc;
