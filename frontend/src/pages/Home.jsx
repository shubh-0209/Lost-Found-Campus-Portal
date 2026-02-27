import React from "react";
import { Link } from "react-router-dom";
import ".././home.css"; 

function Home() {
  return (
    <div className="home">

      <section className="hero">
        <h1>Lost Something on Campus?</h1>
        <p>
          Report lost items, find what you've misplaced, and help others
          reconnect with their belongings.
        </p>

        <div className="hero-buttons">
          <Link to="/browse" className="primary-btn">
            Browse Items
          </Link>

          <Link to="/report" className="secondary-btn">
            Report Item
          </Link>
        </div>
      </section>

      <section className="how-it-works">
  <h2>How It Works</h2>

  <div className="steps">
    <div className="step">
      <div className="step-number">1</div>
      <h3>Report an Item</h3>
      <p>
        Submit details about a lost or found item including description,
        location, and date.
      </p>
    </div>

    <div className="step">
      <div className="step-number">2</div>
      <h3>Browse Listings</h3>
      <p>
        Search through reported items to find matches based on location
        or description.
      </p>
    </div>

    <div className="step">
      <div className="step-number">3</div>
      <h3>Connect & Recover</h3>
      <p>
        Contact the person who reported the item and safely recover
        your belongings.
      </p>
    </div>
  </div>
</section>

    </div>
  );
}

export default Home;
