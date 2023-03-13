import React from "react";
import MetaTags from "react-meta-tags";
import Slider from "react-slick";

//Import Countdown
import Countdown from "react-countdown";

//import images
import bg1 from "../../assets/images/bg-1.jpg";
import bg2 from "../../assets/images/bg-2.jpg";
import bg3 from "../../assets/images/bg-3.jpg";
// import images
import logo from "../../assets/images/logo-sm.svg";

const PagesComingsoon = () => {
  const comingSoonImage = [
    {
      id: 1,
      img: bg1,
      name: "Margaret Lampley",
    },
    {
      id: 2,
      img: bg2,
      name: "Margaret Lampley",
    },
    {
      id: 3,
      img: bg3,
      name: "Margaret Lampley",
    },
  ];

  const comingSoonDetails = comingSoonImage.map((item, key) => {
    return (
      <div className="swiper-slide" key={item.id}>
        <div
          className="slide-bg"
          style={{ backgroundImage: `url(${item.img})` }}
        ></div>
      </div>
    );
  });

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>;
    } else {
      return (
        <React.Fragment>
          <div className="counter-number mt-5">
            <div className="coming-box">
              <div className="count-title">Days</div>
              <div className="count-num">{days}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Hours</div>
              <div className="count-num">{hours}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Minutes</div>
              <div className="count-num">{minutes}</div>
            </div>{" "}
            <div className="coming-box">
              <div className="count-title">Seconds</div>
              <div className="count-num">{seconds}</div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };

  var slidesettings = {
    dots: true,
    speed: 300,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    dotsClass: "swiper-container preview-thumbsnav",
    customPaging: function (i) {
      return (
        <div className="swiper-slide">
          <img
            src={process.env.PUBLIC_URL + "/images/bg-" + (i + 1) + ".jpg"}
            alt=""
            className=" avatar-sm nav-img rounded-circle"
          />
        </div>
      );
    },
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>Coming Soon | Minia - React Admin & Dashboard Template</title>
      </MetaTags>
      <div className="preview-img">
        <div className="swiper-container preview-thumb">
          <div className="swiper-wrapper">
            <Slider {...slidesettings}>{comingSoonDetails}</Slider>
          </div>
        </div>
      </div>
      <div className="coming-content min-vh-100 py-4 px-3 py-sm-5">
        <div className="bg-overlay bg-primary"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center py-4 py-sm-5">
                <div className="mb-5">
                  <a href="index.html">
                    <img src={logo} alt="logo" height="30" className="me-1" />
                    <span className="logo-txt text-white font-size-22">
                      Minia
                    </span>
                  </a>
                </div>
                <h3 className="text-white mt-5">
                  Let's get started with Minia
                </h3>
                <p className="text-white-50 font-size-16">
                  Donec pede justo fringilla vel aliquet nec vulputate eget
                  arcu. In enim justo, rhoncus ut imperdiet a venenatis vitae,
                  justo felis
                </p>

                <Countdown date="2021/12/31" renderer={renderer} />

                <form className="app-search mt-5 mx-auto">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email address"
                    />
                    <button className="btn btn-primary" type="button">
                      <i className="bx bx-paper-plane align-middle"></i>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PagesComingsoon;
