"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";

export default function CreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const [authorId, setAuthorId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Set author_id from user.id
        setAuthorId(user.id);

        const { data, error } = await supabase
          .from("userinfo")
          .select("username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching username:", error);
          setAuthor("");
        } else {
          setAuthor(data?.username || "");
        }
      }
    };

    getUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase
      .from("promo_posts")
      .insert([{ title, content, author, author_id: authorId, password }]);

    if (error) {
      console.error("Error inserting post:", error.message);
    } else {
      router.push("/promo-room");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="shadow-lg p-4 rounded"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">글 작성</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-3">
            <label className="form-label">비밀번호 (수정/삭제 시 필요)</label>
            <input
              type="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-5 py-2"
            >
              글 작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
