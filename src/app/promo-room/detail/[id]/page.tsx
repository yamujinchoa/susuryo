// /promo-room/detail/[id]/pages.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // useCallback 추가
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import { User } from "@supabase/supabase-js"; // 추가: User 타입 import

type Post = {
  id: number;
  title: string;
  author: string;
  author_id: string; // 추가
  content: string;
  created_at: string;
  password: string;
  views: number;
  likes: number;
  shares: number;
};

export default function DetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 추가
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // 현재 사용자 정보 가져오기 함수 추가
  const fetchCurrentUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) console.error("Error fetching user:", error.message);
    setCurrentUser(user?.user);
  };

  const fetchPost = useCallback(async (postId: string) => {
    // useCallback으로 감싸기
    const { data, error } = await supabase
      .from("promo_posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      console.error("Error fetching post:", error.message);
    } else {
      setPost(data as Post);
      incrementViews(data.id, data.views); // post 데이터가 설정된 후 조회수 증가
    }
  }, []); // 의존성 배열 비워두기

  useEffect(() => {
    fetchCurrentUser(); // 사용자 정보 가져오기
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  const incrementViews = async (postId: string, currentViews: number) => {
    const { error } = await supabase
      .from("promo_posts")
      .update({ views: currentViews + 1 })
      .eq("id", postId);

    if (error) {
      console.error("Error updating views:", error.message);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    const { error } = await supabase
      .from("promo_posts")
      .update({ likes: post.likes + 1 })
      .eq("id", post.id);
    if (error) console.error("Error updating likes:", error.message);
    else setPost({ ...post, likes: post.likes + 1 });
  };

  const handleShare = async () => {
    if (!post) return;
    // 공유 로직 (예: navigator.share)
    const { error } = await supabase
      .from("promo_posts")
      .update({ shares: post.shares + 1 })
      .eq("id", post.id);
    if (error) console.error("Error updating shares:", error.message);
    else setPost({ ...post, shares: post.shares + 1 });
  };

  const handleDelete = async () => {
    if (!post) return;
    const { error } = await supabase
      .from("promo_posts")
      .delete()
      .eq("id", post.id);
    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      router.push("/promo-room");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      {post ? (
        <div
          className="card shadow-lg"
          style={{ maxWidth: "1320px", width: "100%" }}
        >
          <div className="card-body">
            <h2 className="card-title mb-3">{post.title}</h2>
            <h6 className="card-subtitle mb-2 text-muted">
              작성자: {post.author}
            </h6>
            <p>
              조회수: {post.views} | 좋아요: {post.likes} | 공유: {post.shares}
            </p>
            <hr />
            <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
              {post.content}
            </p>
            <p className="text-muted small mt-3">
              작성 날짜: {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div className="d-flex justify-content-end mt-4">
              {currentUser?.id === post.author_id && ( // 조건부 렌더링 추가
                <>
                  <button
                    onClick={() => router.push(`/promo-room/edit/${post.id}`)}
                    className="btn btn-warning me-2 rounded-pill px-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete()}
                    className="btn btn-danger rounded-pill px-4"
                  >
                    삭제
                  </button>
                </>
              )}
              <button
                onClick={handleLike}
                className="btn btn-primary me-2 rounded-pill px-4"
              >
                좋아요
              </button>
              <button
                onClick={handleShare}
                className="btn btn-info me-2 rounded-pill px-4"
              >
                공유하기
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
