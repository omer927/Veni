import { useState } from 'react'
import './App.css'
const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  // Variables to track state
  const [currCat, setCurrCat] = useState(null);
  const [loading, setLoading] = useState(false); // Changed default from null to false
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const catNames = [
  "Luna", "Oliver", "Leo", "Milo", "Bella", 
  "Charlie", "Max", "Lily", "Lucy", "Simba",
  "Chloe", "Jasper", "Olive", "Ziggy", "Willow", 
  "Mochi", "Loki", "Daisy", "Pepper", "Bean"
];


  const fetchRandomCat = async () => {
  setLoading(true);
  let foundValidCat = false;
  let attempts = 0;

  // Loop until we find a cat or hit a safety limit
  while (!foundValidCat && attempts < 10) {
    try {
      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?has_breeds=1&api_key=${ACCESS_KEY}`
      );
      const data = await response.json();
      const catData = data[0];

      const breedName = catData.breeds[0]?.name;
      const weightRange = catData.breeds[0]?.weight?.imperial;
      const origin = catData.breeds[0]?.origin;
      const lifeSpan = catData.breeds[0]?.life_span;

      // Check if any attribute is in the ban list
      const isBanned = banList.includes(breedName) || 
                       banList.includes(weightRange) || 
                       banList.includes(origin) || 
                       banList.includes(lifeSpan);

      if (!isBanned) {
        // We found a good one! Add a custom name and update state
        const catWithCustomName = { 
          ...catData, 
          customName: catNames[Math.floor(Math.random() * catNames.length)] 
        };
        
        setCurrCat(catWithCustomName);
        addToHistory(catWithCustomName);
        foundValidCat = true;
      }
    } catch (error) {
      console.error("Error:", error);
      break; // Exit on error
    }
    attempts++;
  }
  setLoading(false);
};

  const addToHistory = (newCat) => {
    setHistory((prevHistory) => {
      if (prevHistory.some(cat => cat.id === newCat.id)) {
        return prevHistory;
      }
      return [newCat, ...prevHistory];
    });
  };

  const addToBanList = (attribute) => {
    if (attribute && !banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  const removeFromBanList = (attributeToRemove) => {
    setBanList(banList.filter(item => item !== attributeToRemove));
  };

  return (
    <div className="app-container">
      
      {/* Column 1: History Log */}
      <div className="history-section">
        <h3>⏳ History Log</h3>
        <br/>
        <p className="section-subtitle">What have you discovered so far?</p>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty-text">No cats viewed yet.</p>
          ) : (
            history.map((cat, index) => (
              <div key={cat.id || index} className="history-item">
                <img src={cat.url} alt="History Thumbnail" />
                <p>A {cat.breeds[0]?.name || "Unknown Breed"} cat from the {cat.breeds[0]?.origin || "Unknown Origin"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Column 2: Main Discover Area */}
      <div className="discover-section">
        <h1>🐾 Veni Vici! Cat Explorer 🐾</h1>
        <p className="main-subtitle">Discover new cats, ban what you don't want to see!</p>

        {currCat ? (
          <div className="cat-card">
            {/* Name displays dynamically at the very top of the image display frame */}
            <h2 className="cat-breed-title">{currCat.customName}</h2>
            
            <div className="cat-image-container">
              <img src={currCat.url} alt="Random Cat" />
            </div>

            {/* Displaying 4 matching attributes as active interactive elements */}
            <div className="attributes-container">
              <button onClick={() => addToBanList(currCat.breeds[0]?.name)} className="attr-btn breed-tag">
                🏷️ Breed: {currCat.breeds[0]?.name || "Unknown"}
              </button>
              <button onClick={() => addToBanList(currCat.breeds[0]?.weight?.imperial)} className="attr-btn weight-tag">
                ⚖️ Weight: {currCat.breeds[0]?.weight?.imperial || "Unknown"} lbs
              </button>
              <button onClick={() => addToBanList(currCat.breeds[0]?.origin)} className="attr-btn origin-tag">
                📍 Origin: {currCat.breeds[0]?.origin || "Unknown"}
              </button>
              <button onClick={() => addToBanList(currCat.breeds[0]?.life_span)} className="attr-btn life-tag">
                ⏳ Life: {currCat.breeds[0]?.life_span || "Unknown"} years
              </button>
            </div>
          </div>
        ) : (
          <div className="welcome-card">
            <p>Click the button below to start your discovery journey!</p>
          </div>
        )}

        <button onClick={fetchRandomCat} disabled={loading} className="discover-btn">
          {loading ? "Searching..." : "🔄 Discover New Cat!"}
        </button>
      </div>

      {/* Column 3: Ban List View */}
      <div className="ban-list-section">
        <h3>🚫 Banned Attributes</h3>
        <br/>
        <p className="section-subtitle">Click an attribute to remove it</p>
        <div className="ban-list-container">
          {banList.length === 0 ? (
            <p className="empty-text">No attributes banned yet.</p>
          ) : (
            banList.map((item, index) => (
              <button key={index} onClick={() => removeFromBanList(item)} className="banned-item-btn">
                ❌ {item}
              </button>
            ))
          )}
        </div>
      </div>

    </div>
  )
}

export default App
