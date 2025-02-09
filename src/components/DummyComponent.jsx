import { useEffect, useState } from "react";

const DummyComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dummy") // Flask backend URL
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log("Resppppppppp",response);
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Dummy API Response</h2>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : data ? (
        <pre className="bg-gray-100 p-2 rounded-md">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DummyComponent;
