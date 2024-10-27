"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { User } from "@supabase/supabase-js"; // Supabase의 User 타입을 가져옵니다.

export default function DetailPage() {
  const [post, setPost] = useState<{
    title: string;
    author: string;
    author_id: string;
    content: string;
    created_at: string;
    password?: string;
  } | null>(null);
  const [comments, setComments] = useState<
    {
      id: string;
      author: string;
      author_id: string;
      content: string;
      created_at: string;
      password?: string;
    }[]
  >([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null); // User 타입 사용
  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    fetchCurrentUser();
    if (id) {
      fetchPost(id);
      fetchComments(id);
    }
  }, [id]);

  // 현재 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error.message);
    }
    console.log("Current user:", user?.user); // 추가
    console.log("User ID:", user?.user?.id); // 추가
    setCurrentUser(user?.user);
  };

  // 게시글 데이터 가져오기
  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("talk_posts")
      .select("title, author, author_id, content, created_at, password")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("게시글을 가져오는 중 오류 발생:", error.message);
    } else {
      console.log("Post data:", data); // 추가
      console.log("Post author_id:", data.author_id); // 추가
      setPost(data);
    }
  };

  // 댓글 데이터 가져오기
  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("talk_comments")
      .select("id, author, author_id, content, created_at, password")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("댓글을 가져오는 중 오류 발생:", error.message);
    } else {
      setComments(data || []);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (currentUser?.id !== post?.author_id) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === post?.password) {
      const { error } = await supabase.from("talk_posts").delete().eq("id", id);
      if (error) {
        console.error("게시글 삭제 중 오류 발생:", error.message);
      } else {
        alert("게시글이 성공적으로 삭제되었습니다.");
        router.push("/talk");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("talk_comments").insert([
      {
        post_id: id,
        author: commentAuthor,
        author_id: currentUser.id,
        content: commentContent,
        password: commentPassword,
      },
    ]);

    if (error) {
      console.error("댓글 작성 중 오류 발생:", error.message);
    } else {
      setCommentContent("");
      setCommentAuthor("");
      setCommentPassword("");
      fetchComments(id);
    }
  };

  // 댓글 수정
  const handleCommentEdit = async (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (currentUser?.id !== comment?.author_id) {
      alert("수정 권한이 없습니다.");
      return;
    }

    const newContent = prompt("새로운 댓글 내용을 입력하세요:");
    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === comment?.password) {
      const { error } = await supabase
        .from("talk_comments")
        .update({ content: newContent })
        .eq("id", commentId);

      if (error) {
        console.error("댓글 수정 중 오류 발생:", error.message);
      } else {
        alert("댓글이 성공적으로 수정되었습니다.");
        fetchComments(id);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (currentUser?.id !== comment?.author_id) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === comment?.password) {
      const { error } = await supabase
        .from("talk_comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("댓글 삭제 중 오류 발생:", error.message);
      } else {
        alert("댓글이 성공적으로 삭제되었습니다.");
        fetchComments(id);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log("Rendering buttons:", {
      currentUserId: currentUser?.id,
      postAuthorId: post?.author_id,
      isMatch: currentUser?.id === post?.author_id,
    });
  }, [currentUser?.id, post?.author_id]);

  return (
    <div className="container mt-5">
      {post ? (
        <div className="card shadow-sm rounded">
          <div className="card-body">
            <h3 className="card-title mb-3">{post.title}</h3>
            <h6 className="card-subtitle mb-2 text-muted">
              작성자: {post.author}
            </h6>
            <hr />
            <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
              {post.content}
            </p>
            <p className="text-muted small">
              작성 날짜: {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="d-flex justify-content-end mt-3">
              {currentUser?.id === post?.author_id && (
                <>
                  <button
                    onClick={() => router.push(`/talk/edit/${id}`)}
                    className="btn btn-warning rounded-pill me-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger rounded-pill"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">게시글을 불러오는 중...</p>
      )}

      {/* 댓글 섹션 */}
      <div className="mt-5">
        <h4>댓글</h4>
        {comments.length > 0 ? (
          <ul className="list-group list-group-flush">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="list-group-item border rounded mb-2 shadow-sm"
              >
                <strong>{comment.author}</strong>
                <span className="text-muted small ms-2">
                  ({new Date(comment.created_at).toLocaleDateString()})
                </span>
                <p className="mb-2">{comment.content}</p>
                <div className="d-flex justify-content-end">
                  {currentUser?.id === comment.author_id && (
                    <>
                      <button
                        onClick={() => handleCommentEdit(comment.id)}
                        className="btn btn-sm btn-warning rounded-pill me-2"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="btn btn-sm btn-danger rounded-pill"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">아직 댓글이 없습니다.</p>
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <div className="mt-4">
        <h4>댓글 작성</h4>
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-3">
            <label className="form-label">작성자</label>
            <input
              type="text"
              className="form-control rounded-pill"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">댓글 내용</label>
            <textarea
              className="form-control rounded"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={2}
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">비밀번호 (수정/삭제 시 필요)</label>
            <input
              type="password"
              className="form-control rounded-pill"
              value={commentPassword}
              onChange={(e) => setCommentPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary rounded-pill">
            댓글 작성
          </button>
        </form>
      </div>
    </div>
  );
}
