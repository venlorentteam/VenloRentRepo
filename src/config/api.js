const productionApi = 'https://newprojectbackend-5axx.onrender.com'

export const API_BASE = process.env.REACT_APP_API_BASE || (
  process.env.NODE_ENV === 'production' ? productionApi : 'http://localhost:4000'
)
