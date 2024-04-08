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
  //First image url
  {
    url:
      "https://m.media-amazon.com/images/I/81PjadeEG4L._AC_UF1000,1000_QL80_.jpg"
  },
  {
    url:
      "https://m.media-amazon.com/images/I/81xtUuRY3ML._AC_UF1000,1000_QL80_.jpg"
  },
  //Second image url
  {
    url:
      "https://m.media-amazon.com/images/I/41XSxPwoL3L.jpg"
  },
  //Third image url
  {
    url:
      "https://upload.wikimedia.org/wikipedia/en/b/b5/Adujivitam.jpg"
  },

  //Fourth image url

  {
    url:
      "https://m.media-amazon.com/images/I/81vXvTYUPvL._AC_UF1000,1000_QL80_.jpg"
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
              <img src={imageUrl.url} alt="movie" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
export default Carouselc;