import React from 'react'
import '../css/masterContainer.css'

const Header: React.FC<{ text: string }> = (props) => {
    return (
        <div className= 'header'>
            <span>{props.text}</span>
        </div>
    )
}

export default Header