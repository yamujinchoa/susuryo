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
      .from("promo_posts")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      setPosts((data as Post[]) || []);
    }
  };

  const handleCreate = () => {
    router.push("/promo-room/create");
  };

  const handleDetail = (postId: number) => {
    router.push(`/promo-room/detail/${postId}`);
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">크몽인 홍보방</h2>

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
                  <th scope="col">제목</th>
                  <th scope="col">작성자</th>
                  <th scope="col">작성 날짜</th>
                  <th scope="col" className="text-end">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr key={post.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDetail(post.id)}
                        className="btn btn-info btn-sm me-2"
                      >
                        보기
                      </button>
                    </td>
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
