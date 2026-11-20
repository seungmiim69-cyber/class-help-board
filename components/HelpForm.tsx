"use client";

import { useActionState, useRef, useState } from "react";
import { createHelpRequest, type HelpFormState } from "@/app/actions";
import { CATEGORIES, MESSAGE_MAX, STUDENT_INFO_MAX } from "@/lib/validate";

const initialState: HelpFormState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-lg outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20";

export default function HelpForm() {
  const [studentInfo, setStudentInfo] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const messageRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState(
    async (prev: HelpFormState, formData: FormData) => {
      const result = await createHelpRequest(prev, formData);
      // 성공 시 유형·내용만 비우고 학번·이름은 유지
      if (result.status === "success") {
        setCategory("");
        setMessage("");
      }
      return result;
    },
    initialState,
  );

  const studentInfoLen = [...studentInfo].length;
  const messageLen = [...message].length;

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-xl font-bold text-slate-800">✋ 도움 요청하기</h2>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="student_info" className="font-semibold text-slate-700">
            학번·이름 (또는 좌석)
          </label>
          <span className={`text-sm ${studentInfoLen > STUDENT_INFO_MAX ? "text-red-500" : "text-slate-400"}`}>
            {studentInfoLen}/{STUDENT_INFO_MAX}
          </span>
        </div>
        <input
          id="student_info"
          name="student_info"
          value={studentInfo}
          onChange={(e) => setStudentInfo(e.target.value)}
          maxLength={STUDENT_INFO_MAX}
          required
          autoComplete="off"
          placeholder="예: 20315 김민준 / 3분단 2번째"
          className={inputClass}
        />
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold text-slate-700">문제 유형</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CATEGORIES.map((c) => (
            <label
              key={c}
              className="cursor-pointer rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 has-checked:border-sky-500 has-checked:bg-sky-50 has-checked:text-sky-800 has-focus-visible:ring-4 has-focus-visible:ring-sky-500/30"
            >
              <input
                type="radio"
                name="category"
                value={c}
                checked={category === c}
                onChange={() => {
                  setCategory(c);
                  messageRef.current?.focus();
                }}
                required
                className="sr-only"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="message" className="font-semibold text-slate-700">
            상세 내용
          </label>
          <span className={`text-sm ${messageLen > MESSAGE_MAX ? "text-red-500" : "text-slate-400"}`}>
            {messageLen}/{MESSAGE_MAX}
          </span>
        </div>
        <input
          id="message"
          name="message"
          ref={messageRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={MESSAGE_MAX}
          required
          autoComplete="off"
          placeholder="예: 크롬북 화면이 멈췄어요"
          className={inputClass}
        />
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-sky-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-sky-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "요청 보내는 중…" : "도움 요청하기"}
        </button>
        {state.message && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-xl px-4 py-3 text-center font-medium ${
              state.status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
