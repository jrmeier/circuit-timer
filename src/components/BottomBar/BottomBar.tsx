// import React from 'react'
import * as React from "react";

import './BottomBar.css'
import { Link } from 'wouter'

export function BottomBar() {

    return (
        <div className='bottom-bar'>
            <Link to={'/sessions'}>
            <div className='bar-item'>
                Sessions
            </div>
            </Link>
            {/* </Link> */}
            <div className='bar-item'>
            <Link to={'/'}>
                Timer
            </Link>
            </div>
        </div>
    )

}