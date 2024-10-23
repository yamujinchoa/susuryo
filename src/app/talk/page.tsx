// src/app/talk/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  author: string;
  created_at: string;
}

export default function ListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("talk_posts")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      setPosts((data as Post[]) || []);
    }
  };

  const checkUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error checking user:", error.message);
      return false;
    }
    return user ? true : false;
  };

  const handleCreate = async () => {
    const isLoggedIn = await checkUser();
    if (isLoggedIn) {
      router.push("/talk/create");
    } else {
      alert("글을 작성하려면 로그인이 필요합니다.");
      router.push("/login"); // 로그인 페이지로 이동
    }
  };

  const handleDetail = (postId: number) => {
    router.push(`/talk/detail/${postId}`);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">크몽인 TALK - 질문과 답변/고충 상담</h2>

      {/* 글쓰기 버튼 */}
      <div className="text-end mb-4">
        <button onClick={handleCreate} className="btn btn-primary">
          글 작성
        </button>
      </div>

      {/* 게시글 목록 테이블 */}
      <div className="card">
        <div className="card-body">
          {posts.length > 0 ? (
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">번호</th>
                  <th scope="col" style={{ width: "60%" }}>
                    제목
                  </th>
                  <th scope="col">작성자</th>
                  <th scope="col">작성 날짜</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr
                    key={post.id}
                    onClick={() => handleDetail(post.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">게시글이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
