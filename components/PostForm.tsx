"use client";

import { useActionState, useRef, useState } from "react";
import { createPost, type PostFormState } from "@/app/actions";
import { CONTENT_MAX, NICKNAME_MAX } from "@/lib/validate";

const initialState: PostFormState = { status: "idle", message: "" };

export default function PostForm() {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: PostFormState, formData: FormData) => {
      const result = await createPost(prev, formData);
      // 성공 시 내용만 비우고 닉네임은 유지
      if (result.status === "success") {
        setContent("");
        contentRef.current?.focus();
      }
      return result;
    },
    initialState,
  );

  const nicknameLen = [...nickname].length;
  const contentLen = [...content].length;

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <label htmlFor="nickname" className="font-medium">
            닉네임
          </label>
          <span className={nicknameLen > NICKNAME_MAX ? "text-red-500" : "text-zinc-400"}>
            {nicknameLen}/{NICKNAME_MAX}
          </span>
        </div>
        <input
          id="nickname"
          name="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={NICKNAME_MAX}
          required
          autoComplete="nickname"
          placeholder="예: 홍길동"
          className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <label htmlFor="content" className="font-medium">
            오늘 배운 한 줄
          </label>
          <span className={contentLen > CONTENT_MAX ? "text-red-500" : "text-zinc-400"}>
            {contentLen}/{CONTENT_MAX}
          </span>
        </div>
        <textarea
          id="content"
          name="content"
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={CONTENT_MAX}
          required
          rows={2}
          placeholder="예: useActionState로 폼 상태를 관리할 수 있다"
          className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p
          aria-live="polite"
          className={`text-sm ${
            state.status === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {state.status === "success" && "✓ "}
          {state.status === "error" && "✗ "}
          {state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "저장 중…" : "기록하기"}
        </button>
      </div>
    </form>
  );
}
