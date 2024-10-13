"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

type Post = {
  id: number;
  title: string;
  author: string;
  content: string;
  created_at: string;
  password: string;
};

export default function DetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { id } = useParams() as { id: string };

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id]);

  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("promo_posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error.message);
    } else {
      setPost(data as Post);
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const passwordInput = prompt("비밀번호를 입력하세요:");

    if (passwordInput === null) {
      return;
    }

    if (passwordInput === post.password) {
      const { error } = await supabase
        .from("promo_posts")
        .delete()
        .eq("id", post.id);
      if (error) {
        console.error("Error deleting post:", error.message);
      } else {
        alert("게시글이 성공적으로 삭제되었습니다.");
        router.push("/promo-room");
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
                onClick={() => router.push(`/promo-room/edit/${post.id}`)}
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
    </div>
  );
}
