import { useEffect, useState } from "react";
import "./Home.css";
const API = import.meta.env.VITE_API_URL;

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  fuel: string;
  price: string;
  Publishdate: string;
}

const Home = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rowperpage, setrowperpage] = useState(5);
  const [currentpage, setcurrentpage] = useState(0);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    fuel: "",
    price: "",
    Publishdate: "",
  });

  /// ferch cars from database ane function ke koi api call kari tye setcars kare je thi badhi api ma res.json no karrvu pade

  const fetchCars = () => {
    fetch(
      `${API}/api/cars?page=${currentpage}&limit=${rowperpage}&search=${search}`,
    )
      .then((res) => res.json())
      .then((data) => {
        setCars(data.cars);
        setTotalCars(data.total);
      })
      .catch((err) => console.error(err));
  };

  //update car data in page

  useEffect(() => {
    fetchCars();
  }, [currentpage, rowperpage, search]);

  // create car
  const handleSubmit = async () => {
    try {
      await fetch(`${API}/api/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({
        name: "",
        brand: "",
        model: "",
        fuel: "",
        price: "",
        Publishdate: "",
      }); //form ni badhi field ne kori karva
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  //delete

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/api/cars/${id}`, { method: "DELETE" });
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  //updatee

  const handleUpdate = async (id: string) => {
    try {
      await fetch(`${API}/api/cars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({
        name: "",
        brand: "",
        model: "",
        fuel: "",
        price: "",
        Publishdate: "",
      });
      setEditingId(null);
      fetchCars();
    } catch (err) {
      console.error(err);
    }
  };

  //edit
  const handleEdit = (car: Car) => {
    setFormData({
      name: car.name,
      brand: car.brand,
      model: car.model,
      fuel: car.fuel,
      price: car.price,
      Publishdate: car.Publishdate,
    });
    setEditingId(car._id);
  };

  //pagination

  const starting = currentpage * rowperpage;
  const ending = Math.min(starting + rowperpage, totalCars);

  return (
    <div className="home-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, brand, model, or fuel..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setcurrentpage(0);
          }}
          className="search-input"
        />
      </div>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="">Car Name</label>
          <input
            type="text"
            placeholder="Car Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Car Brand</label>
          <input
            type="text"
            placeholder="Car Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Model</label>
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) =>
              setFormData({ ...formData, model: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Fuel Type</label>
          <select
            value={formData.fuel}
            onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
          >
            {/* <option value="">Select Fuel Type</option> */}
            <option value="Diesel">Diesel</option>
            <option value="Petrol">Petrol</option>            
            <option value="EV">EV</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="">Price</label>
          <input
            type="text"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="">Launch Date</label>
          <input
            type="date"
            value={formData.Publishdate}
            onChange={(e) =>
              setFormData({ ...formData, Publishdate: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <button
          className="submit-btn"
          onClick={() => (editingId ? handleUpdate(editingId) : handleSubmit())}
        >
          {editingId ? "Update" : "Submit"}
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Car Name</th>
              <th>Car Brand</th>
              <th>Model</th>
              <th>Fuel Type</th>
              <th>Price</th>
              <th>Launch Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id}>
                <td>{car.name}</td>
                <td>{car.brand}</td>
                <td>{car.model}</td>
                <td>{car.fuel}</td>
                <td>{car.price}</td>
                <td>{car.Publishdate}</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(car)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(car._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7}>
                <span>Rows per page:</span>
                <input
                  type="number"
                  value={rowperpage}
                  onChange={(e) => {
                    setrowperpage(Number(e.target.value));
                    setcurrentpage(0);
                  }}
                  max={totalCars}
                />
                <span>
                  {starting + 1}-{ending} of {totalCars}
                </span>
                <button
                  onClick={() => setcurrentpage(currentpage - 1)}
                  disabled={currentpage === 0}
                >
                  Previous
                </button>
                <button
                  onClick={() => setcurrentpage(currentpage + 1)}
                  disabled={ending >= totalCars}
                >
                  Next
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Home;
