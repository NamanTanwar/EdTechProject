import React from 'react';
import HighlightText from '../Homepage/HighlightText';

const Quote=()=>{

    return (
        <div>
        We are passionate about revolutionizing the way we learn. Our innovation paltform <HighlightText text={"combines technology"}/> <span className="text-brown-500">
        {" "}
        expertise
        </span>
        , and community to create an
        <span className="text-brown-500">
        {" "}
        unparallel educational experience.
        </span>

        </div>
    )
}

export default Quote;