import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const params = useParams();
  useEffect(() => {
    const { id } = params;
    fetch(`http://localhost:4000/post/${id}`).then((res) => {
      if (res.ok) {
        res.json().then((info) => {
          setPostInfo(info);
        });
      }
    });
  }, []);
  if (!postInfo) {
    return <></>;
  }
  return (
    <div className="post-page">
      <h1 className="post-title">{postInfo.title}</h1>
      <p className="post-author">
        By: <span>{postInfo.author.username}</span>
      </p>
      <div className="post-image">
        <img
          src={`http://localhost:4000/${postInfo.cover}`}
          alt={postInfo.summary}
        />
      </div>
      <p className="post-date">
        Published at:{" "}
        <time>
          {format(new Date(postInfo.createdAt), "MMM d, yyyy - HH:mm")}
        </time>
      </p>
      <p
        className="post-content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></p>
    </div>
  );
}
