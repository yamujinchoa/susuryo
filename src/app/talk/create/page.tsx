"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

export default function CreatePage() {
  const [title, setTitle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지
  const router = useRouter();

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>내용을 입력하세요...</p>",
  });

  // 로그인된 사용자 정보 가져오기
  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // userinfo 테이블에서 user.id에 해당하는 username 가져오기
        const { data, error } = await supabase
          .from("userinfo")
          .select("username")
          .eq("id", user.id) // auth 테이블의 id와 userinfo 테이블의 id를 매칭
          .single(); // 단일 레코드만 반환

        if (error) {
          console.error("Error fetching username:", error);
          setAuthor(""); // 에러 시 기본값
        } else {
          setAuthor(data?.username || ""); // 가져온 username 설정
        }
      }
    };

    getUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // 로딩 상태 시작
    setErrorMessage(null); // 에러 메시지 초기화

    const content = editor?.getHTML(); // 에디터의 HTML 내용 가져오기

    if (title.length < 5 || !content || content.length < 10) {
      setErrorMessage(
        "제목은 최소 5자, 내용은 최소 10자 이상 입력해야 합니다."
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("talk_posts")
      .insert([{ title, content, author, password }]);

    if (error) {
      setErrorMessage("게시글 작성 중 오류가 발생했습니다.");
      console.error("Error inserting post:", error.message);
      setLoading(false);
    } else {
      router.push("/talk");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="shadow-lg p-4 rounded"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">글 작성</h2>
        {errorMessage && (
          <div className="alert alert-danger text-center">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">작성자</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled // 작성자 필드를 비활성화하여 수정 불가하게 설정
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
              minLength={5} // 최소 글자 수
            />
          </div>
          <div className="mb-3">
            <label className="form-label">내용</label>
            <EditorContent editor={editor} className="form-control rounded" />
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
              disabled={loading} // 로딩 중일 때 버튼 비활성화
            >
              {loading ? "작성 중..." : "글 작성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
