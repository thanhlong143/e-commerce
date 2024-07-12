import React from "react";
import banner from "../assets/banner.png";

const Banner = () => {
    return (
        <div className="w-full">
            <img
                src={banner}
                className="h-[400px] w-full object-cover"
                alt="banner" />
        </div>
    )
}

export default Banner;