import React from 'react'
import '../css/masterContainer.css'
import Header from './Header'
import BodyContainer from './BodyContainer'

class MasterContainer extends React.Component {
    render() {
        return (
            <div className= 'master-container'>
                <Header text="HELEN LEARNS MATH"/>
                <BodyContainer />
            </div>
        )
    }
}

export default MasterContainer