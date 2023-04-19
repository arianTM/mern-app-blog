import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Navigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default function CreatePostPage() {
  const styles = { marginTop: "1rem" };
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const createNewPost = async (e) => {
    e.preventDefault();
    const myFormData = new FormData();
    myFormData.set("title", title);
    myFormData.set("summary", summary);
    myFormData.set("content", content);
    myFormData.set("image", files[0]);
    const res = await fetch("http://localhost:4000/create", {
      method: "POST",
      body: myFormData,
    });
    if (res.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => {
          setSummary(e.target.value);
        }}
      />
      <input
        type="file"
        name="image"
        accept="image/png"
        onChange={(e) => {
          setFiles(e.target.files);
        }}
      />
      <ReactQuill
        value={content}
        onChange={(newText) => {
          setContent(newText);
        }}
        modules={modules}
        formats={formats}
      />
      <button style={styles}>Create post</button>
    </form>
  );
}
