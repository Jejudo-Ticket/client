import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/fund',
  withCredentials: true,
})

export const fetchFundings = async (progress, fundType = null) => {
  const params = { progress }
  if (fundType && fundType !== '전체') {
    params.fundType = fundType
  }
  const res = await api.get('/list', { params })
  return res.data
}
