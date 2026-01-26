import React, { useState } from 'react'
import { PageSetup, Header, SearchBar, SearchDisplayCard, ClickButton } from '../exports'
import { FiFilter } from 'react-icons/fi'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import './Search.css'

function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState([
    {
      id: 1,
      username: "@dimma",
      verified: true,
      price: "₦850,000",
      location: "Lekki, Lagos",
      orders: 125,
      successRate: "92%",
      houseType: "Studio Apartment",
      imageUrl: "https://i.pravatar.cc/100?img=10",
      isAd: false,
    },
    {
      id: 2,
      username: "@propertyhub",
      verified: true,
      price: "₦1,500,000",
      location: "Ikoyi, Lagos",
      orders: 245,
      successRate: "98%",
      houseType: "3 Bedroom Duplex",
      imageUrl: "https://i.pravatar.cc/100?img=12",
      isAd: true,
    },
    {
      id: 3,
      username: "@abujahomes",
      verified: false,
      price: "₦600,000",
      location: "Wuse 2, Abuja",
      orders: 45,
      successRate: "85%",
      houseType: "2 Bedroom Apartment",
      imageUrl: "https://i.pravatar.cc/100?img=15",
      isAd: false,
    },
  ])

  const handleSearch = (query) => {
    setSearchQuery(query)
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Filter results based on query
      // In production, this would be an API call
      setIsLoading(false)
    }, 500)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleResultClick = (resultId) => {
    // Navigate to listing detail
    console.log('Clicked result:', resultId)
    // navigate(`/listing/${resultId}`)
  }

  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Search</h2>}
        icons={[
          { link: "/inbox", element: <RiMessageLine /> },
          { link: "/notifications", element: <FaRegBell /> }
        ]}
      />
      
      <div className="main-content">
        <div className="content">
          {/* Search Header */}
          <div className="search-header">
            <SearchBar 
              placeholder="Search for properties, locations, agents..."
              onSearch={handleSearch}
            />
            <ClickButton
              text="Filters"
              icon={<FiFilter />}
              variant="outline"
              size="medium"
              onClick={toggleFilters}
            />
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="search-filters">
              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <div className="filter-options">
                  <button className="filter-chip">Under ₦500k</button>
                  <button className="filter-chip">₦500k - ₦1M</button>
                  <button className="filter-chip">₦1M - ₦2M</button>
                  <button className="filter-chip">Above ₦2M</button>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="filter-options">
                  <button className="filter-chip">Lagos</button>
                  <button className="filter-chip">Abuja</button>
                  <button className="filter-chip">Port Harcourt</button>
                  <button className="filter-chip">Ibadan</button>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Property Type</label>
                <div className="filter-options">
                  <button className="filter-chip">Apartment</button>
                  <button className="filter-chip">Duplex</button>
                  <button className="filter-chip">Studio</button>
                  <button className="filter-chip">Bungalow</button>
                </div>
              </div>

              <div className="filter-actions">
                <ClickButton text="Clear All" variant="outline" size="small" />
                <ClickButton text="Apply Filters" variant="primary" size="small" />
              </div>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && (
            <div className="search-results-header">
              <p className="results-count">
                {results.length} properties found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
              <select className="sort-dropdown">
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          )}

          {/* Search Results */}
          {isLoading ? (
            // Loading State
            <div className="search-loading">
              <div className="skeleton skeleton-result"></div>
              <div className="skeleton skeleton-result"></div>
              <div className="skeleton skeleton-result"></div>
            </div>
          ) : results.length > 0 ? (
            // Results List
            <div className="search-results">
              {results.map((result) => (
                <SearchDisplayCard
                  key={result.id}
                  {...result}
                  onClick={() => handleResultClick(result.id)}
                />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="search-empty">
              <div className="empty-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try adjusting your search or filters</p>
              <ClickButton 
                text="Clear Filters" 
                variant="outline"
                onClick={() => setShowFilters(false)}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="search-tips">
            <h3>Search Tips</h3>
            <ul>
              <li>Use specific keywords like "2 bedroom", "Lekki", "duplex"</li>
              <li>Filter by price range for better results</li>
              <li>Verified agents have a checkmark badge</li>
            </ul>
          </div>
        </div>
      </div>
    </PageSetup>
  )
}

export default Search