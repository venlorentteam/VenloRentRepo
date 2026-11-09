import { useEffect } from 'react'

export const DEFAULT_PAGE_TITLE = 'VenloRent | Verified Property Rentals and Homes in Nigeria'

const usePageTitle = (title) => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | VenloRent` : DEFAULT_PAGE_TITLE

    return () => {
      document.title = previousTitle || DEFAULT_PAGE_TITLE
    }
  }, [title])
}

export { usePageTitle }
export default usePageTitle
