import { useState } from 'react'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {

  //Variables to track:

  // holds the current cat data object from the API
  const [currCat, setCurrCat] = useState(null);
  // Tracks if the network is currently fetching data
  const [loading, setLoading] = useState(null);
  // holds banned attribuites
  const [banList, setBanList] = useState([]);
  // history
  const [history, setHistory] = useState([]);

//asynchronous function for button that creates new API 
  const fetchRandomCat = async () => {
    setLoading(true);
    try{
      // fetch a random cat with breed info attached
      const response = await fetch(`https://thecatapi.com{import.meta.env.VITE_APP_ACCESS_KEY}`);
      const data = await response.json();
      
      //The cat API return an array containing one object: [{url: '...', breeds: [...]}]
      if(data && data.length > 0){
        const catData = data[0];

        //Check ban list filter
        const breedName = catData.breeds[0]?.name;
        if (banList.includes(breedName)){
          //If the breed is banned, automatically fetch a 
        }
        //if it passes the ban list, save it to diplay it
        setCurrCat(catData);
      }
    } catch(error){
      console.error("Error fetching the dog data:", error);
    }
    setLoading(false);
  }

  return (
    <div className="app-container">
      {/* Main Discover Area */}
      <div className="discover-section" >
        <h1> 🐾 Veni Vici! Cat Explorer 🐾 </h1>
        <p>Discover new cats, ban what you don't want to see!</p>

        {/* Conditional Rendering: show data if currDog exists*/}
        {currCat ? (
          <div className="cat-card"> 
            {/* img displaying per API call */}
              <img 
                src={currCat.url}
                alt="Random Breed"
              />
            {/* Display 4 attributes as clickable buttons */}
            <div className="attributes-container"> 
              <button onClick={() => addToBanList(currCat.breeds[0]?.name)} className="attr-btn">
                Breed: {currCat.breeds[0]?.name || "Unknown"}
              </button>

              <button onClick={() => addToBanList(currCat.breeds[0]?.weight)} className="attr-btn">
                Breed: {currCat.breeds[0]?.weight || "Unknown"}
              </button>

              <button onClick={() => addToBanList(currCat.breeds[0]?.location)} className="attr-btn">
                Breed: {currCat.breeds[0]?.location || "Unknown"}
              </button>

              <button onClick={() => addToBanList(currCat.breeds[0]?.age)} className="attr-btn">
                Breed: {currCat.breeds[0]?.age || "Unknown"}
              </button>

            </div>
          </div>
        ):(
          <div> 
            <p> Click the button below to start your discovery journey!</p>
          </div>
        )}

        <button onClick={fetchRandomCat} disabled={loading} >🔄 Discover New Cat!</button>

        {/* Right Column: Ban List view */}
      </div>
    </div>
  )
}

export default App
