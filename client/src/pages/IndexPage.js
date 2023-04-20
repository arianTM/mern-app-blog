import React, { useEffect, useState } from "react";
import Post from "../components/Post.js";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/posts").then((res) => {
      if (res.ok) {
        res.json().then((posts) => {
          setPosts(posts);
        });
      }
    });
  }, []);
  return (
    <>
      {posts.length > 0 ? (
        posts.map((post, idx) => <Post key={idx} {...post} />)
      ) : (
        <></>
      )}
    </>
  );
}
