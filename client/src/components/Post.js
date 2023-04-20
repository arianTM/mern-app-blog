import React from "react";

import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="post-box">
      <Link to={`/post/${_id}`}>
        <div className="post">
          <div className="image">
            <img src={`http://localhost:4000/${cover}`} alt={summary} />
          </div>
          <div className="texts">
            <h2>{title}</h2>
            <p className="info">
              <p className="author">{author.username}</p>
              <time>{format(new Date(createdAt), "MMM d, yyyy - HH:mm")}</time>
            </p>
            <p className="summary">{summary}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
