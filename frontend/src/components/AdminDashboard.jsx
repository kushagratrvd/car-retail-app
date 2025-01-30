import { useContext, useState } from "react"
import { CarsContext } from "../context/CarsContext.jsx"

export default function AdminDashboard() {
  const { cars, loading, error, addCar, deleteCar } = useContext(CarsContext)
  const [newCar, setNewCar] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  })

  // Initialize cars as an empty array if undefined
  const carsList = Array.isArray(cars) ? cars : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addCar(newCar)
      setNewCar({ name: "", description: "", price: "", image: "" })
    } catch (error) {
      console.error("Error adding car:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCar(id)
    } catch (error) {
      console.error("Error deleting car:", error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Add Car Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={newCar.name}
            onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description:</label>
          <textarea
            value={newCar.description}
            onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Price:</label>
          <input
            type="number"
            value={newCar.price}
            onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Image URL:</label>
          <input
            type="url"
            value={newCar.image}
            onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Car
        </button>
      </form>

      {/* Cars List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carsList.map((car) => (
          <div key={car._id} className="border p-4 rounded">
            <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-full h-48 object-cover mb-2" />
            <h3 className="font-bold">{car.name}</h3>
            <p>{car.description}</p>
            <p className="font-bold mt-2">${car.price}</p>
            <button onClick={() => handleDelete(car._id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

