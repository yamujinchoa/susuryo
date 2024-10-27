"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import React from "react";
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export default function CreatePage() {
  const [title, setTitle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지
  const router = useRouter();

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      FontFamily.configure({ types: ["textStyle"] }),
      Bold,
      Italic,
      Underline,
      Link,
      Highlight,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
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
    <div className="container mt-5 px-3">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="card shadow-sm p-4 rounded">
            <h2 className="mb-4 text-center">글 작성</h2>
            {errorMessage && (
              <div className="alert alert-danger text-center">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">작성자</label>
                <input
                  type="text"
                  className="form-control"
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
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={5} // 최소 글자 수
                />
              </div>
              <div className="mb-3">
                <label className="form-label">내용</label>
                <div
                  className="form-control p-0"
                  style={{ minHeight: "200px" }}
                >
                  <EditorContent editor={editor} />
                </div>
                {editor && (
                  <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                    <button
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className={editor.isActive("bold") ? "is-active" : ""}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                      }
                      className={editor.isActive("italic") ? "is-active" : ""}
                    >
                      Italic
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleUnderline().run()
                      }
                      className={
                        editor.isActive("underline") ? "is-active" : ""
                      }
                    >
                      Underline
                    </button>
                  </BubbleMenu>
                )}
                {editor && (
                  <FloatingMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                  >
                    <button
                      onClick={() =>
                        editor.chain().focus().setParagraph().run()
                      }
                    >
                      Paragraph
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                    >
                      H1
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                    >
                      H2
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                      }
                    >
                      Bullet List
                    </button>
                    <button
                      onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                      }
                    >
                      Ordered List
                    </button>
                  </FloatingMenu>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">
                  비밀번호 (수정/삭제 시 필요)
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2"
                  disabled={loading} // 로딩 중일 때 버튼 비활성화
                >
                  {loading ? "작성 중..." : "글 작성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
