import React from "react"
import "./NumberPyramid.css"

function NumberPyramid(props) {
    return (
        props.pyramid.map((tier, t) => {
            return (
                <div key={'tier-'+t} className='tier'>
                    {
                    tier.map(val => {
                        return (
                            <div className='pyramidValue'>{val}</div>
                        )
                    })}
                </div>
            )
        })
    )
}

export default NumberPyramid