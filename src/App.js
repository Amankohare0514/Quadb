import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
const apiEndpoint = 'https://api.tvmaze.com/search/shows?q=all';
const Container = ({ children }) => (
  <div className="max-w-screen-md mx-auto p-4">{children}</div>
);
const Header = () => <h1 className="text-4xl font-bold text-center mb-6">TV Shows</h1>;
const ShowListContainer = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{children}</div>
);

const ShowCard = ({ show }) => (
  <div className="border border-gray-300 p-4 rounded cursor-pointer transition-transform hover:scale-105">
    <Link to={`/show/${show.id}`}>
      <h2 className="text-xl font-bold mb-2">{show.name}</h2>
      <p className="text-gray-800">{show.status}</p>
      <p className="text-gray-500">{show.type}</p>
    </Link>
  </div>
);

const ShowDetailsContainer = ({ show }) => (
  <div className="max-w-screen-md mx-auto p-4">
    {show && (
      <>
      <div className='pt-24 bg-gray-100 px-8 py-8 pb-24'>
        <h2 className="text-3xl font-bold mb-4">{show.name}</h2>  
        <p dangerouslySetInnerHTML={{ __html: show.summary }}></p>
        </div>
      </>
    )}
  </div>
);

const App = () => {
  const [shows, setShows] = useState([]);
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Container><Header /><ShowListContainer>{shows.map((show) => <ShowCard key={show.show.id} show={show.show} />)}</ShowListContainer></Container>}
        />
        <Route
          path="/show/:id"
          element={<ShowDetails />}
        />
      </Routes>
    </Router>
  );
};

const ShowDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const data = await response.json();
        setShow(data);
      } catch (error) {
        console.error('Error fetching show details:', error);
      }
    };

    fetchShowDetails();
  }, [id]);
  return <ShowDetailsContainer show={show} />;
};

export default App;
