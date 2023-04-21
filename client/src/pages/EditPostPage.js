import React, { useEffect, useState } from "react";
import PostEditor from "../components/PostEditor.js";
import { useParams } from "react-router-dom";

export default function EditPostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((res) =>
      res.json().then((postInfo) => {
        setPostInfo(postInfo);
      })
    );
  }, []);
  return postInfo ? (
    <PostEditor
      buttonText="Edit post"
      path={`http://localhost:4000/post/${id}`}
      redirectPath={`/post/${id}`}
      method="PUT"
      postInfo={postInfo}
    />
  ) : (
    <></>
  );
}
