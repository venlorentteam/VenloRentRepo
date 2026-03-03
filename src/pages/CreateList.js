import React, { useState } from 'react'
import "./CreateRequest.css";
import { FaRegEdit } from "react-icons/fa"
import { FaNairaSign, FaAngleRight } from "react-icons/fa6"
import { TfiMenuAlt } from "react-icons/tfi"
import { IoImageOutline } from "react-icons/io5"
import { GrLocation } from "react-icons/gr"
// import { TbTags } from "react-icons/tb"
import { IoCloudUploadOutline } from "react-icons/io5"

function CreateList(){
  const [category, setCategory] = useState(false)
  const [media, setMedia] = useState(true)
  const [location, setLocation] = useState()
  // const [tag, setTag] = useState()
  const [amount, setAmount] = useState()

  const openCategory = () => {
    setCategory(prev => !prev)
  }
  const openMedia = () => {
    setMedia(prev => !prev)
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

  return(
    <>
      <div className="post-main-container">
        <div className="caption-input-container">
          <FaRegEdit className="text-icon"/>
          <textarea type="text" name="list" placeholder="Add a caption" className="caption-input"></textarea>
        </div>
      </div>
      {/* <hr /> */}
      <div className="post-features-container">
        {/* Category selection */}
        <div className={`wrapper ${category ? "active" : ""}`}>
          <div className="item" onClick={openCategory}> {/*Property List category selector*/}
            <div className="left">
              <TfiMenuAlt className="feature-icon"/>
              <p>Category</p>
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
        {/* Media upload */}
        <div className={`wrapper ${media ? "active" : ""}`}>
          <div className="item" onClick={openMedia}>{/*Property List Media attatchment selector*/}
            <div className="left">
              <IoImageOutline className="feature-icon" />
              <p>Add media</p>
            </div>
            <FaAngleRight className={`feature-icon ${media ? "rotate" : ""}`} />
          </div>
          <div className={`empty-container ${media ? "show-feature" : ""}`} style={{cursor: "pointer"}}>
            <div className="content-feature">
              <IoCloudUploadOutline className="upload-icon"/>
              <h2>Upload your image</h2>{/**/}
              <p>Please select supported files</p>
            </div>
          </div>
        </div>

        {/* Additional description */}
          <div className=" wrapper active">
            <div className="caption-input-container">
              <textarea type="text" style={{textAlign: "left"}} name="list" placeholder="Additional description of property (optional)" className="caption-input"></textarea>
            </div>
          </div>
        {/* Loaction input */}
        <div className={`wrapper ${location ? "active" : ""}`}>
          <div className="item" onClick={openLocation}>
            <div className="left">
              <GrLocation className="feature-icon"/>
              <p>Location</p>
            </div>
            <FaAngleRight className={`feature-icon ${location ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${location ? "show-feature" : ""}`}>
            <div className="content-feature">
              <input type="text" name="location" className="location-input" placeholder="Street, Town/City, State/Province" />
            </div>
          </div>
        </div>

        {/* Tags Input */}
        {/* <div className={`wrapper ${tag ? "active" : ""}`}>
          <div className="item" onClick={openTag}>
            <div className="left">
              <TbTags className="feature-icon"/>
              <p>Tags</p>
            </div>
            <FaAngleRight className={`feature-icon ${tag ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${tag ? "show-feature" : ""}`}>
            <div className="content-feature">
              
            </div>
          </div>
        </div> */}

        {/* Amount Input */}
        <div className={`wrapper ${amount ? "active" : ""}`}>
          <div className="item" onClick={openAmount}>
            <div className="left">
              <FaNairaSign className="feature-icon"/>
              <p>Add amount</p>
            </div>
            <FaAngleRight className={`feature-icon ${amount ? "rotate" : ""}`}/>
          </div>
          <div className={`empty-container ${amount ? "show-feature" : ""}`}>
            <div className="content-feature">
              <input type="number" 
                name="amount" 
                className="location-input" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateList
