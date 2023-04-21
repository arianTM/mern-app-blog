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

export default function PostEditor({
  buttonText,
  path,
  method,
  redirectPath,
  postInfo,
}) {
  const styles = { marginTop: "1rem" };
  const [title, setTitle] = useState(postInfo?.title || "");
  const [summary, setSummary] = useState(postInfo?.summary || "");
  const [content, setContent] = useState(postInfo?.content || "");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const submitPost = async (e) => {
    e.preventDefault();
    const myFormData = new FormData();
    myFormData.set("title", title);
    myFormData.set("summary", summary);
    myFormData.set("content", content);
    if (files?.[0]) {
      myFormData.set("image", files?.[0]);
    }
    const res = await fetch(path, {
      method,
      body: myFormData,
      credentials: "include",
    });
    if (res?.ok) {
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={redirectPath} />;
  }

  return (
    <form onSubmit={submitPost}>
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
      <button style={styles}>{buttonText}</button>
    </form>
  );
}
