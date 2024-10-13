"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import React from "react";

export default function EditPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (id) fetchPostData(id);
  }, [id]);

  const fetchPostData = async (postId: string) => {
    const { data, error } = await supabase
      .from("promo_posts")
      .select("title, content, author, password")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post data:", error.message);
      return;
    }

    setTitle(data.title);
    setContent(data.content);
    setAuthor(data.author);
    setStoredPassword(data.password); // Store the password in state for validation
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput !== storedPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { error } = await supabase
      .from("promo_posts")
      .update({ title, content, author })
      .eq("id", id);

    if (error) {
      console.error("Error updating post:", error.message);
    } else {
      alert("게시글이 성공적으로 수정되었습니다.");
      router.push(`/promo-room/detail/${id}`);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="shadow-lg p-4 rounded"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">글 수정</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">작성자</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">제목</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">내용</label>
            <textarea
              className="form-control rounded"
              style={{ height: "200px", resize: "vertical" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-5 py-2"
            >
              글 수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
