// src/app/talk/create/page.tsx
// src/components/CreatePage.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import ErrorBoundary from "@lexical/react/LexicalErrorBoundary";

export default function CreatePage() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 성공 메시지
  const [showPreview, setShowPreview] = useState<boolean>(false); // 미리보기 상태
  const router = useRouter();

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
    setSuccessMessage(null); // 성공 메시지 초기화

    if (title.length < 5 || content.length < 10) {
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
      setSuccessMessage("게시글이 성공적으로 작성되었습니다!");
      setLoading(false);
      setTimeout(() => {
        router.push("/talk");
      }, 2000); // 2초 후에 페이지 이동
    }
  };

  const theme = {
    // 필요한 스타일을 정의합니다.
    paragraph: "editor-paragraph",
  };

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // 편집기의 현재 상태를 읽어 필요한 로직을 구현합니다.
      const contentJson = editorState.toJSON();
      setContent(JSON.stringify(contentJson));
    });
  }

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
        {successMessage && (
          <div className="alert alert-success text-center">
            {successMessage}
          </div>
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
            <small className="text-muted">최소 5자 이상 입력해주세요.</small>
          </div>
          <div className="mb-3">
            <label className="form-label">내용</label>
            <LexicalComposer
              initialConfig={{
                namespace: "MyEditor",
                theme,
                onError: (error: Error) => console.error(error),
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="form-control rounded"
                    style={{ height: "200px", resize: "vertical" }}
                  />
                }
                placeholder={<div>내용을 입력하세요...</div>}
                ErrorBoundary={ErrorBoundary}
              />
              <HistoryPlugin />
              <OnChangePlugin onChange={onChange} />
            </LexicalComposer>
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
          <div className="text-center mb-3">
            <button
              type="button"
              className="btn btn-secondary rounded-pill px-4 py-2 me-2"
              onClick={() => router.push("/talk")}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-5 py-2"
              disabled={loading} // 로딩 중일 때 버튼 비활성화
            >
              {loading ? "작성 중..." : "글 작성"}
            </button>
            <button
              type="button"
              className="btn btn-info rounded-pill px-4 py-2 ms-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "미리보기 닫기" : "미리보기"}
            </button>
          </div>
        </form>
        {showPreview && (
          <div className="preview border rounded p-3 mt-4">
            <h3 className="text-center">미리보기</h3>
            <h4 className="mt-3">{title}</h4>
            <p>{content}</p>
            <small className="text-muted">작성자: {author}</small>
          </div>
        )}
      </div>
    </div>
  );
}
