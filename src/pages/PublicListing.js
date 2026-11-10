import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE } from '../config/api'
import { useAuth } from '../context/AuthProvider'
import LandingPageHeader from '../components/Prelim/LandingPageHeader'
import { FiArrowLeft, FiCheck, FiHome, FiMapPin } from 'react-icons/fi'
import './PublicListing.css'

const setMeta = (attribute, key, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
  return element
}

const PublicListing = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const fetchListing = async () => {
      setIsLoading(true)
      setError('')
      try {
        const response = await axios.get(`${API_BASE}/public/listings/${encodeURIComponent(slug)}`)
        if (!cancelled) setProperty(response.data?.property || null)
      } catch (err) {
        if (!cancelled) setError(err?.response?.status === 404 ? 'This listing is no longer available.' : 'Unable to load this listing.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    if (slug) fetchListing()
    else {
      setError('Listing not found.')
      setIsLoading(false)
    }
    return () => { cancelled = true }
  }, [slug])

  const metadata = useMemo(() => {
    if (!property) return null
    const location = [property.location?.town, property.location?.state].filter(Boolean).join(', ')
    const type = property.listing_type === 'shortlet' ? 'Shortlet' : property.listing_type === 'sale' ? 'for Sale' : 'for Rent'
    const title = `${property.title} ${type} in ${location || 'Nigeria'} | VenloRent`
    const description = `${property.title} ${type} in ${location || 'Nigeria'}. View verified property details, photos, features, and agent information on VenloRent.`
    const url = `https://venlorent.com/listing/${property.publicSlug || slug}`
    return { location, title, description, url }
  }, [property, slug])

  useEffect(() => {
    if (!metadata) return undefined
    const previousTitle = document.title
    const canonical = document.head.querySelector('link[rel="canonical"]') || document.createElement('link')
    const previousCanonical = canonical.getAttribute('href')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', metadata.url)
    if (!canonical.parentNode) document.head.appendChild(canonical)
    document.title = metadata.title
    const managed = [
      setMeta('name', 'description', metadata.description),
      setMeta('property', 'og:title', metadata.title),
      setMeta('property', 'og:description', metadata.description),
      setMeta('property', 'og:url', metadata.url),
      setMeta('name', 'twitter:title', metadata.title),
      setMeta('name', 'twitter:description', metadata.description),
    ]
    const previousJsonLd = document.head.querySelector('script[data-public-listing-schema]')
    const jsonLd = document.createElement('script')
    jsonLd.type = 'application/ld+json'
    jsonLd.dataset.publicListingSchema = 'true'
    jsonLd.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metadata.title,
      description: metadata.description,
      url: metadata.url,
      isPartOf: { '@id': 'https://venlorent.com/#website' },
      about: {
        '@type': 'Offer',
        name: property.title,
        price: Number(property.amount || 0),
        priceCurrency: property.currency || 'NGN',
        availability: 'https://schema.org/InStock',
        url: metadata.url,
      },
    })
    document.head.appendChild(jsonLd)
    return () => {
      document.title = previousTitle
      if (previousCanonical) canonical.setAttribute('href', previousCanonical)
      else canonical.remove()
      managed.forEach((element) => element.remove())
      jsonLd.remove()
      if (previousJsonLd) document.head.appendChild(previousJsonLd)
    }
  }, [metadata, property])

  const formatAmount = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`
  const media = property?.media || []

  if (isLoading) return <><LandingPageHeader navigation={[]} btns={[]} /><main className="public-listing-state"><p>Loading listing...</p></main></>
  if (error || !property) return <main className="public-listing-state"><h1>Listing unavailable</h1><p>{error || 'This listing could not be found.'}</p><Link to="/">Return to VenloRent</Link></main>

  return (
    <main className="public-listing-page">
      <LandingPageHeader
        navigation={[
          { name: 'Features', href: '/#features' },
          { name: 'Listings', href: '/#listings' },
          { name: 'How It Works', href: '/#how' },
        ]}
      />
      <div className="public-listing-shell">
        <Link to="/" className="public-listing-back"><FiArrowLeft /> Back to VenloRent</Link>
      <article className="public-listing-card">
        <div className="public-listing-gallery">
          {media.length > 0 ? media.slice(0, 5).map((item, index) => {
            const url = typeof item === 'string' ? item : item?.url
            const isVideo = typeof item !== 'string' && item?.mimeType?.startsWith('video/')
            return isVideo ? <video key={url || index} src={url} controls className="public-listing-media" /> : <img key={url || index} src={url} alt={`${property.title} view ${index + 1}`} className="public-listing-media" />
          }) : <div className="public-listing-placeholder"><FiHome /></div>}
        </div>
        <div className="public-listing-body">
          <div className="public-listing-heading">
            <div>
              <p className="public-listing-eyebrow">Verified property listing</p>
              <h1>{property.title}</h1>
              <p className="public-listing-location"><FiMapPin /> {metadata.location || 'Nigeria'}</p>
            </div>
            <strong>{formatAmount(property.amount)}{property.listing_type === 'rent' && <small> / year</small>}{property.listing_type === 'shortlet' && <small> / night</small>}</strong>
          </div>
          <div className="public-listing-facts"><span>{property.property_type}</span>{property.bedrooms && <span>{property.bedrooms} bedrooms</span>}<span>{property.listing_type}</span></div>
          <p className="public-listing-description">{property.description}</p>
          {property.features?.length > 0 && <ul className="public-listing-features">{property.features.map((feature) => <li key={feature}><FiCheck /> {feature}</li>)}</ul>}
          <div className="public-listing-agent"><div><span>Listed by</span><strong>{property.owner?.fullName || property.owner?.username || 'Verified agent'}</strong></div><button type="button" onClick={() => navigate(user ? `/listing/${property._id}/order` : '/login')}>{user ? 'Reserve property' : 'Sign in to reserve'}</button></div>
        </div>
      </article>
      </div>
    </main>
  )
}

export default PublicListing
