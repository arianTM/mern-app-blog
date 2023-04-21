import React from "react";
import PostEditor from "../components/PostEditor.js";

export default function CreatePostPage() {
  return (
    <PostEditor
      buttonText="Create post"
      path="http://localhost:4000/post"
      method="POST"
      redirectPath="/"
    />
  );
}
