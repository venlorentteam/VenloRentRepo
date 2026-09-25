import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { PageSetup, Header, SearchBar, SearchDisplayCard, ClickButton } from '../exports'
import { FiFilter } from 'react-icons/fi'
import { RiMessageLine } from 'react-icons/ri'
import { FaRegBell } from 'react-icons/fa'
import { FiSearch } from "react-icons/fi";
import { API_BASE } from '../config/api'
import './Search.css'

// Treat a request as expired when either backend status says so or the
// expiry timestamp has already passed.
const isRequestExpired = (item) =>
  item.status === "expired" ||
  (item.expiresAt && new Date(item.expiresAt) <= Date.now())

// Debounce delay in ms — prevents firing a request on every keystroke
const SEARCH_DEBOUNCE_MS = 400

// Price range options — values match the amount field in the Property schema (NGN)
const PRICE_RANGES = [
  { label: "Under ₦500k",    min: 0,         max: 500_000   },
  { label: "₦500k – ₦1M",   min: 500_000,   max: 1_000_000 },
  { label: "₦1M – ₦2M",     min: 1_000_000, max: 2_000_000 },
  { label: "Above ₦2M",     min: 2_000_001, max: undefined  },
]

// Location chips — these map to the location.state field on the Property schema
const LOCATION_OPTIONS = [
  "Lagos", "Abuja", "Port Harcourt", "Ibadan",
  "Enugu", "Kano", "Benin City",
]

// Property type chips — must match enum in Property schema exactly
const PROPERTY_TYPE_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "flat", label: "Flat" },
  { value: "self-contained", label: "Self-Contained" },
  { value: "duplex", label: "Duplex" },
  { value: "shop", label: "Shop" },
  { value: "office", label: "Office" },
  { value: "conference-room", label: "Conference Room" },
  { value: "studio", label: "Studio" },
]

// Listing type chips — must match enum in Property schema exactly
const LISTING_TYPE_OPTIONS = [
  { value: "rent", label: "For Rent" },
  { value: "sale", label: "For Sale" },
  { value: "shortlet", label: "Shortlet" },
]

// INITIAL FILTER STATE — used for resetting filters and as the initial state shape
const INITIAL_FILTERS = {
  priceRange: null,   // one of PRICE_RANGES or null
  location: "",     // free string matched against location.town / location.state
  propertyType: "",     // single value from PROPERTY_TYPE_OPTIONS
  listingType: "",     // single value from LISTING_TYPE_OPTIONS
}

// ==================================================================
//  HELPERS
// ==================================================================

// Formats a raw number as a ₦ string e.g. 1200000 → "₦1,200,000"
const formatPrice = (amount) =>
  amount != null ? `₦${Number(amount).toLocaleString("en-NG")}` : ""

// Derives the price period label from listing_type
const priceLabel = (listingType) =>
  listingType === "rent" ? "/yr"
  : listingType === "shortlet" ? "/night"
  : ""

// Maps a raw API item (_type: "listing" | "request") to the shape
const mapItemToCardProps = (item) => {
  if (item._type === "listing") {
    return {
      id: item._id,
      _type: "listing",
      // Owner fields — available because /search populates owner
      username: item.owner?.username  ? `@${item.owner.username}` : "",
      agentName: item.owner?.fullName  || item.owner?.username || "",
      imageUrl: item.owner?.avatar    || "",
      verified: item.owner?.kycStatus === "verified",
      // Listing fields
      title: item.title,
      price: `${formatPrice(item.amount)}${priceLabel(item.listing_type)}`,
      location: [item.location?.town, item.location?.state].filter(Boolean).join(", "),
      houseType: item.property_type,
      listingType: item.listing_type,
      bedrooms: item.bedrooms || "",
      // Use commentCount as the "orders" proxy until an orders collection exists.
      // Replace with item.orderCount once orders are tracked on the Property doc.
      orders: item.commentCount || 0,
      // likeCount doubles as a lightweight engagement signal for now
      likes: item.likeCount || 0,
      // Cover image — media is [{url, publicId,...}]; extract the first URL
      coverImage: item.media?.[0]?.url || "",
      isAd: item.moderationStatus === "boosted", // future boosted listings
    }
  }

  // _type === "request"
  return {
    id: item._id,
    _type: "request",
    username: item.requester?.username ? `@${item.requester.username}` : "",
    agentName: item.requester?.fullName || item.requester?.username || "",
    imageUrl: item.requester?.avatar  || "",
    verified: item.requester?.kycStatus === "verified",
    isAgent: item.requester?.role    === "agent",
    // Request-specific display fields
    description: item.description,
    category: item.category,
    budget: item.budget,
    location: [item.location?.town, item.location?.state].filter(Boolean).join(", "),
    responseCount: item.responseCount || 0,
    expired: isRequestExpired(item),
    daysLeft: item.expiresAt
      ? Math.max(0, Math.ceil((new Date(item.expiresAt) - Date.now()) / 86_400_000))
      : null,
    // SearchDisplayCard fields that don't apply to requests
    price: item.budget || "",
    houseType: item.category || "",
    orders: item.responseCount || 0,
    coverImage: "",
    isAd: false, //
  }
}

// ==================================================================
//  MAIN COMPONENT
// ==================================================================
function Search() {
  const navigate = useNavigate()
  // Query state 
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState("listing") // "listing" | "request" | "all"
  const [sort, setSort] = useState("relevance")
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  // Result state 
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false) // true after first search attempt

  // Debounce ref - holds the pending setTimeout id 
  const debounceRef = useRef(null)
  const abortRef = useRef(null)
  
  // Active filter count for the Filters button badge 
  const activeFilterCount = [
    filters.priceRange,
    filters.location,
    filters.propertyType,
    filters.listingType,
  ].filter(Boolean).length

  // Core fetch function
  const fetchResults = useCallback(async (query, currentFilters, currentSort, currentType) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (query.trim()) params.set("q", query.trim())
      params.set("type", currentType)
      params.set("sort", currentSort)

      if (currentFilters.location)        params.set("location",     currentFilters.location)
      if (currentFilters.propertyType)    params.set("propertyType", currentFilters.propertyType)
      if (currentFilters.listingType)     params.set("listingType",  currentFilters.listingType)
      if (currentFilters.priceRange?.min != null) params.set("minPrice", currentFilters.priceRange.min)
      if (currentFilters.priceRange?.max) params.set("maxPrice",     currentFilters.priceRange.max)

      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const res = await axios.get(`${API_BASE}/search?${params.toString()}`, {
        headers,
        signal: controller.signal,
      })

      if (res.data.success) {
        setResults((res.data.items || []).map(mapItemToCardProps))
        setTotal(res.data.total || 0)
      }
    } catch (err) {
      if (axios.isCancel(err) || err.code === 'ERR_CANCELED') return
      setError("Something went wrong. Please try again.")
      setResults([])
      setTotal(0)
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
        setHasSearched(true)
      }
    }
  }, [])

  // Debounced search trigger — fires when query, filters, sort, or type change
  useEffect(() => {
    // Clear any pending debounce timer
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // Don't fire an empty search on first mount — wait for user input
    if (!hasSearched && !searchQuery.trim() && activeFilterCount === 0) return

    debounceRef.current = setTimeout(() => {
      fetchResults(searchQuery, filters, sort, activeType)
    }, SEARCH_DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, filters, sort, activeType]) // eslint-disable-line react-hooks/exhaustive-deps


  // Called by SearchBar's onSearch callback
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Toggle a single-select filter chip (deselects if already selected)
  const toggleChip = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }))
  }

  // Toggle a price range chip (deselects if same range selected)
  const togglePriceRange = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }))
  }

  // Reset all filters to initial state
  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  // Open the order preview for listing results.
  const handleResultClick = (item) => {
    if (item._type === "listing") {
      navigate(`/listing/${item.id}/order`)
    }
  }

  
  //  RENDER
  return (
    <PageSetup>
      <Header
        pageTitle={<h2>Search</h2>}
        icons={[
          { link: "/inbox",         element: <RiMessageLine /> },
          { link: "/notifications", element: <FaRegBell />     },
        ]}
      />

      <div className="main-content">
        <div className="content">

          {/* Search bar + filter toggle */}
          <div className="search-header">
            <SearchBar
              placeholder="Search properties, requests, locations..."
              onSearch={handleSearch}
            />
            <ClickButton
              text={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
              icon={<FiFilter />}
              variant={activeFilterCount > 0 ? "primary" : "outline"}
              size="medium"
              onClick={() => setShowFilters((p) => !p)}
            />
          </div>

          {/* Type tabs: Listings / Requests / All */}
          <div className="search-type-tabs">
            {[
              { value: "listing", label: "Listings"  },
              { value: "request", label: "Requests"  },
              { value: "all",     label: "All"        },
            ].map((tab) => (
              <button
                key={tab.value}
                className={`search-type-tab ${activeType === tab.value ? "search-type-tab--active" : ""}`}
                onClick={() => setActiveType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter panel shown when toggled */}
          {showFilters && (
            <div className="search-filters">

              {/* Price range — only relevant for listing searches */}
              {activeType !== "request" && (
                <div className="filter-group">
                  <label className="filter-label">Price Range</label>
                  <div className="filter-options">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        className={`filter-chip ${filters.priceRange?.label === range.label ? "filter-chip--active" : ""}`}
                        onClick={() => togglePriceRange(range)}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="filter-options">
                  {LOCATION_OPTIONS.map((loc) => (
                    <button
                      key={loc}
                      className={`filter-chip ${filters.location === loc ? "filter-chip--active" : ""}`}
                      onClick={() => toggleChip("location", loc)}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property type — only relevant for listing searches */}
              {activeType !== "request" && (
                <div className="filter-group">
                  <label className="filter-label">Property Type</label>
                  <div className="filter-options">
                    {PROPERTY_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`filter-chip ${filters.propertyType === opt.value ? "filter-chip--active" : ""}`}
                        onClick={() => toggleChip("propertyType", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Listing type — only relevant for listing searches */}
              {activeType !== "request" && (
                <div className="filter-group">
                  <label className="filter-label">Listing Type</label>
                  <div className="filter-options">
                    {LISTING_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`filter-chip ${filters.listingType === opt.value ? "filter-chip--active" : ""}`}
                        onClick={() => toggleChip("listingType", opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="filter-actions">
                <ClickButton
                  text="Clear All"
                  variant="outline"
                  size="small"
                  onClick={clearFilters}
                />
                {/* Apply just closes the panel — results update reactively */}
                <ClickButton
                  text="Done"
                  variant="primary"
                  size="small"
                  onClick={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Results header — count + sort */}
          {hasSearched && !isLoading && !error && (
            <div className="search-results-header">
              <p className="results-count">
                {total} {total === 1 ? "result" : "results"}
                {searchQuery.trim() && ` for "${searchQuery.trim()}"`}
              </p>
              <select
                className="sort-dropdown"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="search-error">
              <p>{error}</p>
              <ClickButton
                text="Try Again"
                variant="primary"
                onClick={() => fetchResults(searchQuery, filters, sort, activeType)}
              />
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div className="search-loading">
              <div className="skeleton skeleton-result" />
              <div className="skeleton skeleton-result" />
              <div className="skeleton skeleton-result" />
            </div>
          )}

          {/* Results list */}
          {!isLoading && !error && hasSearched && results.length > 0 && (
            <div className="search-results">
              {results.map((result) => (
                <SearchDisplayCard
                  key={result.id}
                  {...result}
                  onClick={() => handleResultClick(result)}
                />
              ))}
            </div>
          )}

          {/* ── Empty state — only shown after a search attempt ────────────── */}
          {!isLoading && !error && hasSearched && results.length === 0 && (
            <div className="search-empty">
              <div className="empty-icon"><FiSearch /></div>
              <h3>No results found</h3>
              <p>
                {searchQuery.trim()
                  ? `Nothing matched "${searchQuery.trim()}". Try different keywords or adjust your filters.`
                  : "Try searching for a location, property type, or agent name."}
              </p>
              {activeFilterCount > 0 && (
                <ClickButton
                  text="Clear Filters"
                  variant="outline"
                  onClick={clearFilters}
                />
              )}
            </div>
          )}

          {/* ── Initial prompt — before any search ─────────────────────────── */}
          {!hasSearched && !isLoading && (
            <div className="search-prompt">
              <p>Search for properties, locations, or agents to get started</p>
            </div>
          )}

        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <div className="sidebar">
          <div className="search-tips">
            <h3>Search Tips</h3>
            <ul>
              <li>Use specific keywords like "2 bedroom", "Lekki", or "duplex"</li>
              <li>Filter by price range for better results</li>
              <li>Switch to <strong>Requests</strong> to browse what seekers are looking for</li>
              <li>Verified agents have a checkmark badge</li>
            </ul>
          </div>
        </div>
      </div>
    </PageSetup>
  )
}

export default Search
