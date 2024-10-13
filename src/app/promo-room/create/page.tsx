"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase
      .from("promo_posts")
      .insert([{ title, content, author, password }]);

    if (error) {
      console.error("Error inserting post:", error.message);
    } else {
      router.push("/promo-room");
    }
  };

  return (
    <div className="container mt-5">
      <h2>글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">작성자</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">내용</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">비밀번호 (수정/삭제 시 필요)</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          글 작성
        </button>
      </form>
    </div>
  );
}
