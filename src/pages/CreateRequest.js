import React, { useState } from 'react'
import "./CreateRequest.css";
import { FaRegEdit } from "react-icons/fa"
import { FaNairaSign, FaAngleRight } from "react-icons/fa6"
import { TfiMenuAlt } from "react-icons/tfi"
import { GrLocation } from "react-icons/gr"

function CreateRequest() {
    const [category, setCategory] = useState(true)
    const [location, setLocation] = useState()
    // const [tag, setTag] = useState()
    const [amount, setAmount] = useState()
  
    const openCategory = () => {
      setCategory(prev => !prev)
    }

    const openLocation = () => {
      setLocation(prev => !prev)
    }
    const openAmount = () => {
      setAmount(prev => !prev)
    }

    // State for storing selected values
    const [selectedCategory, setSelectedCategory] = useState('')
    
      // Options data
    const categoryOptions = [
      { value: 'apartment', label: 'Apartment' },
      { value: 'flat', label: 'Flat' },
      { value: 'self-con', label: 'Self-Con' },
      { value: 'duplex', label: 'Duplex' },
      { value: 'shop', label: 'Shop' },
      {value: 'conference-room', label: 'Conference Room' },
  
    ]
  
    // Handler for single selection (Categories & Location)
    const handleSelectCategory = (value) => {
      setSelectedCategory(value)
    }
  return (
    <>
      <div className="post-main-container">
        <div className="caption-input-container">
          <FaRegEdit className="text-icon"/>
          <textarea type="text" name="list" placeholder="Post a request of what you're looking for..." className="caption-input"></textarea>
        </div>
      </div>
      {/* <hr /> */}
      <div className="post-features-container">
        {/* Category selection */}
        <div className={`wrapper ${category ? "active" : ""}`}>
          <div className="item" onClick={openCategory}> {/*Property List category selector*/}
            <div className="left">
              <TfiMenuAlt className="feature-icon"/>
              <p>Category (optional)</p>
            </div>
            <FaAngleRight className={`feature-icon ${category ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${category ? "show-feature" : ""}`}>
            <div className="content-feature">
              <div className="label-select-container">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectCategory(option.value)}
                    className={`label-button ${selectedCategory === option.value ? 'selected' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
     
        {/* Loaction input */}
        <div className={`wrapper ${location ? "active" : ""}`}>
          <div className="item" onClick={openLocation}>
            <div className="left">
              <GrLocation className="feature-icon"/>
              <p>Location (optional)</p>
            </div>
            <FaAngleRight className={`feature-icon ${location ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${location ? "show-feature" : ""}`}>
            <div className="content-feature">
              <input type="text" name="location" className="location-input" placeholder="Street, Town/City, State/Province" />
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className={`wrapper ${amount ? "active" : ""}`}>
          <div className="item" onClick={openAmount}>
            <div className="left">
              <FaNairaSign className="feature-icon"/>
              <p>Add budget (optional)</p>
            </div>
            <FaAngleRight className={`feature-icon ${amount ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${amount ? "show-feature" : ""}`}>
            <div className="content-feature">
              <input type="number" name="amount" className="location-input" placeholder="0.00" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateRequest
