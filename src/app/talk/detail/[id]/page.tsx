"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function DetailPage() {
  const [post, setPost] = useState<{
    title: string;
    author: string;
    content: string;
    created_at: string;
    password?: string;
  } | null>(null);
  const [comments, setComments] = useState<
    {
      id: string;
      author: string;
      content: string;
      created_at: string;
      password?: string;
    }[]
  >([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (id) {
      fetchPost(id);
      fetchComments(id);
    }
  }, [id]);

  // 게시글 데이터 불러오기
  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("talk_posts")
      .select("title, author, content, created_at, password")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error.message);
    } else {
      setPost(data);
    }
  };

  // 댓글 데이터 불러오기
  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("talk_comments")
      .select()
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error.message);
    } else {
      setComments(data || []);
    }
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === null) {
      return;
    }

    if (passwordInput === post?.password) {
      const { error } = await supabase.from("talk_posts").delete().eq("id", id);
      if (error) {
        console.error("Error deleting post:", error.message);
      } else {
        alert("게시글이 성공적으로 삭제되었습니다.");
        router.push("/talk");
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("talk_comments").insert([
      {
        post_id: id,
        author: commentAuthor,
        content: commentContent,
        password: commentPassword,
      },
    ]);

    if (error) {
      console.error("Error inserting comment:", error.message);
    } else {
      setCommentContent("");
      setCommentAuthor("");
      setCommentPassword("");
      fetchComments(id);
    }
  };

  // 댓글 수정 핸들러
  const handleCommentEdit = async (commentId: string) => {
    const newContent = prompt("새로운 댓글 내용을 입력하세요:");
    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === null || newContent === null) {
      return;
    }

    const { data: comment, error: fetchError } = await supabase
      .from("talk_comments")
      .select("id, password")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      console.error("Error fetching comment:", fetchError?.message);
      return;
    }

    if (passwordInput === comment.password) {
      const { error } = await supabase
        .from("talk_comments")
        .update({ content: newContent })
        .eq("id", commentId);

      if (error) {
        console.error("Error updating comment:", error.message);
      } else {
        alert("댓글이 성공적으로 수정되었습니다.");
        fetchComments(id);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId: string) => {
    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === null) {
      return;
    }

    const { data: comment, error: fetchError } = await supabase
      .from("talk_comments")
      .select("password")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      console.error("Error fetching comment:", fetchError?.message);
      return;
    }

    if (passwordInput === comment.password) {
      const { error } = await supabase
        .from("talk_comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error("Error deleting comment:", error.message);
      } else {
        alert("댓글이 성공적으로 삭제되었습니다.");
        fetchComments(id);
      }
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="container mt-5">
      {post ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              작성자: {post.author}
            </h6>
            <p className="card-text">{post.content}</p>
            <p className="text-muted">
              작성 날짜: {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="text-end">
              <button
                onClick={() => router.push(`/talk/edit/${id}`)}
                className="btn btn-warning me-2"
              >
                수정
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">게시글을 불러오는 중...</p>
      )}

      {/* 댓글 리스트 */}
      <div className="mt-4">
        <h5>댓글</h5>
        {comments.length > 0 ? (
          <ul className="list-group">
            {comments.map((comment) => (
              <li key={comment.id} className="list-group-item">
                <strong>{comment.author}</strong> (
                {new Date(comment.created_at).toLocaleDateString()}):
                <br />
                {comment.content}
                <div className="text-end mt-2">
                  <button
                    onClick={() => handleCommentEdit(comment.id)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    className="btn btn-sm btn-danger"
                  >
                    삭제
                  </button>
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
        <h5>댓글 작성</h5>
        <form onSubmit={handleCommentSubmit}>
          <div className="mb-3">
            <label className="form-label">작성자</label>
            <input
              type="text"
              className="form-control"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">댓글 내용</label>
            <textarea
              className="form-control"
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
              className="form-control"
              value={commentPassword}
              onChange={(e) => setCommentPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            댓글 작성
          </button>
        </form>
      </div>
    </div>
  );
}
