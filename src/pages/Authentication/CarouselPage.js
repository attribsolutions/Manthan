import React, { useState } from "react";
import { Carousel, CarouselItem, CarouselIndicators } from "reactstrap";

import { GET_ERP_IMG } from "../../components/Common/CommonFunction";

const items = [
  {
    id: 1,
    // img: img1,
    // name: "Richard Drews",
    // designation: "Web Designer",
    description:
      "Established in 1950 is one of the leading manufacturers of Indian Sweets, Snacks and Savouries and Ready to Eat Products with presence in Retail, General Trade, Modern Trade and Export Markets"
  },
  {
    id: 2,
    // img: img2,
    // name: "Rosanna French",
    // designation: "Web Developer",
    description:
      "To become leaders in the Indian Dairy Industry, while retaining our Indian traditions and family values"
  },

];

const CarouselPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map(item => {
    return (
      <CarouselItem
        tag="div"
        key={item.id}
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
      >
        <div className="carousel-item active">
          <div className="testi-contain text-white">
            {/* <i className="bx bxs-quote-alt-left text-success display-6"></i> */}
            <h4 className="mt-4 fw-medium lh-base text-white">
              “{item.description}”
            </h4>
            <div className="mt-4 pt-3 pb-5">
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0">
                  {/* <img
                    src={item.img}
                    className="avatar-md img-fluid rounded-circle"
                    alt="..."
                  /> */}
                </div>
                <div className="flex-grow-1 ms-3 mb-4">
                  <h5 className="font-size-18 text-white">{item.name}</h5>
                  <p className="mb-0 text-white-50">{item.designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CarouselItem>
    );
  });

  return (
    <React.Fragment>
      <div className="col-xxl-9 col-lg-8 col-md-7">
        <div className="auth-bg pt-md-5 p-4 d-flex" style={{ backgroundImage: `url(${GET_ERP_IMG().BackgroundImage})` }}>
          <div className="bg-overlay bg-primary"></div>
          <ul className="bg-bubbles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="row justify-content-center align-items-center">
            <div className="col-xl-7">
              <div className="p-0 p-sm-4 px-xl-0">
                <div
                  id="reviewcarouselIndicators"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <CarouselIndicators
                    items={items}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                  />
                  <Carousel
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                  >
                    {slides}
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CarouselPage;




