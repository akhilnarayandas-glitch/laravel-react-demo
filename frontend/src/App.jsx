import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const columns = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'year', label: 'Year' },
  { key: 'price', label: 'Price' },
  { key: 'fuel_type', label: 'Fuel Type' },
  { key: 'mileage', label: 'Mileage' },
]

function App() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [fuelFilter, setFuelFilter] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    fetch(`${API_URL}/cars`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return res.json()
      })
      .then((data) => setCars(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const brands = useMemo(
    () => [...new Set(cars.map((car) => car.brand))].sort(),
    [cars],
  )
  const fuelTypes = useMemo(
    () => [...new Set(cars.map((car) => car.fuel_type))].sort(),
    [cars],
  )

  const visibleCars = useMemo(() => {
    const term = search.trim().toLowerCase()

    let result = cars.filter((car) => {
      const matchesSearch =
        !term ||
        car.brand.toLowerCase().includes(term) ||
        car.model.toLowerCase().includes(term) ||
        car.fuel_type.toLowerCase().includes(term)
      const matchesBrand = !brandFilter || car.brand === brandFilter
      const matchesFuel = !fuelFilter || car.fuel_type === fuelFilter
      return matchesSearch && matchesBrand && matchesFuel
    })

    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (a[sortKey] < b[sortKey]) return -1 * dir
      if (a[sortKey] > b[sortKey]) return 1 * dir
      return 0
    })

    return result
  }, [cars, search, brandFilter, fuelFilter, sortKey, sortDir])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="page">
      <h1>Car Listings</h1>

      <div className="controls">
        <input
          type="text"
          className="search"
          placeholder="Search brand, model, fuel type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)}>
          <option value="">All Fuel Types</option>
          {fuelTypes.map((fuel) => (
            <option key={fuel} value={fuel}>
              {fuel}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading cars...</p>}
      {error && <p className="error">Failed to load cars: {error}</p>}

      {!loading && !error && (
        <>
          <table className="cars-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} onClick={() => toggleSort(col.key)}>
                    {col.label}
                    {sortKey === col.key && (sortDir === 'asc' ? ' ▲' : ' ▼')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleCars.map((car) => (
                <tr key={car.id}>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>${Number(car.price).toLocaleString()}</td>
                  <td>{car.fuel_type}</td>
                  <td>{Number(car.mileage).toLocaleString()} mi</td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleCars.length === 0 && <p>No cars match your filters.</p>}

          <p className="count">
            Showing {visibleCars.length} of {cars.length} cars
          </p>
        </>
      )}
    </div>
  )
}

export default App
