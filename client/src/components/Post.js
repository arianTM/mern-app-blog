import React from "react";

export default function Post() {
  return (
    <div className="post">
      <div className="image">
        <img
          src="https://techcrunch.com/wp-content/uploads/2022/12/0x0-Charging_06.png?w=990&crop=1"
          alt="Tesla EV charging"
        />
      </div>
      <div className="texts">
        <h2>Tesla’s strategy to fuel EV sales? Keep cutting prices</h2>
        <p className="info">
          <a className="author">Dawid Paszko</a>
          <time>2023-01-06 16:45</time>
        </p>
        <p className="summary">
          Tesla may be a relative newcomer compared to legacy companies like GM
          and Ford, but it has adopted an age-old tactic in the industry: price
          wars.
        </p>
      </div>
    </div>
  );
}
