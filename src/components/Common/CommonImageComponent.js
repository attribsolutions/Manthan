import React, { Component } from "react"
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Modal,
} from "reactstrap"



class Slidewithcaption extends Component {

    constructor(props) {
        debugger
        super(props)
        this.items = props.Images
        this.state = { activeIndex: 0 }
        this.next = this.next.bind(this)
        this.previous = this.previous.bind(this)
        this.goToIndex = this.goToIndex.bind(this)
        this.onExiting = this.onExiting.bind(this)
        this.onExited = this.onExited.bind(this)
    }

    onExiting() {
        this.animating = true
    }

    onExited() {
        this.animating = false
    }

    next() {


        if (this.animating) return
        const nextIndex =
            this.state.activeIndex === this.items.length - 1
                ? 0
                : this.state.activeIndex + 1
        this.setState({ activeIndex: nextIndex })
    }

    previous() {

        if (this.animating) return
        const nextIndex =
            this.state.activeIndex === 0
                ? this.items.length - 1
                : this.state.activeIndex - 1
        this.setState({ activeIndex: nextIndex })
    }

    goToIndex(newIndex) {
        if (this.animating) return
        this.setState({ activeIndex: newIndex })
    }

    render() {

        const { activeIndex } = this.state

        const slides = this.items.map((item, key) => {
            debugger
            return (
                // <CarouselItem
                //     onExiting={this.onExiting}
                //     onExited={this.onExited}
                //     key={key}
                // >
                //     <img
                //         src={item}
                //         className="k img-fluid"
                //     />
                // </CarouselItem>

                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={key}
                >
                    <img
                        src={item.Image} // Replace with the actual image source
                        className="k img-fluid"
                        style={{ width: "600px", height: "600px" }}
                        // Set the dimensions
                        alt="Image Description" // Add a meaningful alt attribute for accessibility
                    />
                </CarouselItem>





            )
        })

        return (
            <React.Fragment>

                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous}
                >
                    <CarouselIndicators
                        items={this.items}
                        activeIndex={activeIndex}
                        onClickHandler={this.goToIndex}
                    />
                    {slides}
                    <CarouselControl
                        direction="prev"
                        directionText="Previous"
                        onClickHandler={this.previous}
                    />
                    <CarouselControl
                        direction="next"
                        directionText="Next"
                        onClickHandler={this.next}
                    />
                </Carousel>



            </React.Fragment >
        )
    }
}

export default Slidewithcaption
