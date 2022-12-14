// import React from 'react'
import * as React from "react";

import './BottomBar.css'
import { Link } from 'wouter'

export function BottomBar() {

    return (
        <div className='bottom-bar'>
            <Link to={'/circuit-timer/sessions'}>
            <div className='bar-item'>
                Sessions
            </div>
            </Link>
            {/* </Link> */}
            <Link to={'/circuit-timer/'}>
                <div className='bar-item'>
                    Timer
                </div>
            </Link>
        </div>
    )

}