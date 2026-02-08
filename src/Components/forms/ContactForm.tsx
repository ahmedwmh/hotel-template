"use client";

import { useState } from "react";

export type ContactLabels = {
  yourName: string;
  enterEmail: string;
  selectSubject: string;
  writeMessage: string;
  sendMessage: string;
  getInTouch: string;
  messageSent: string;
  callUsNow?: string;
  sendEmail?: string;
  ourLocation?: string;
  subjectBooking?: string;
  subjectInfo?: string;
  subjectOther?: string;
};

type ContactFormProps = {
  labels: ContactLabels;
  formHeading: string;
};

export function ContactForm({ labels, formHeading }: ContactFormProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Optional: POST to /api/contact when you add the route
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    setSubmitting(false);
  }

  return (
    <div className="bg-[#1e1e1e] p-6 sm:p-8 lg:p-10 2xl:p-14">
      <h2 className="font-Garamond text-xl sm:text-2xl md:text-[28px] leading-tight text-white font-semibold text-center">
        {formHeading || labels.getInTouch}
      </h2>
      {sent ? (
        <p className="mt-8 text-center text-[#C9A24D] font-Lora">
          {labels.messageSent}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-2 mt-8"
        >
          <input
            type="text"
            name="name"
            required
            className="w-full h-12 md:h-14 lg:h-[59px] px-4 border border-zinc-500 text-zinc-200 outline-none bg-transparent placeholder:text-zinc-500 focus:border-[#C9A24D] focus:ring-0"
            placeholder={labels.yourName}
          />
          <input
            type="email"
            name="email"
            required
            className="w-full h-12 md:h-14 lg:h-[59px] px-4 border border-zinc-500 text-zinc-200 outline-none bg-transparent placeholder:text-zinc-500 focus:border-[#C9A24D] focus:ring-0 mt-4"
            placeholder={labels.enterEmail}
          />
          <select
            name="subject"
            className="w-full h-12 md:h-14 lg:h-[59px] px-4 border border-zinc-500 text-zinc-200 outline-none bg-[#1e1e1e] focus:border-[#C9A24D] focus:ring-0 mt-4"
            required
          >
            <option value="" className="bg-[#1e1e1e] text-zinc-500">
              {labels.selectSubject}
            </option>
            <option value="booking" className="bg-[#1e1e1e]">
              {labels.subjectBooking ?? "Booking"}
            </option>
            <option value="info" className="bg-[#1e1e1e]">
              {labels.subjectInfo ?? "General inquiry"}
            </option>
            <option value="other" className="bg-[#1e1e1e]">
              {labels.subjectOther ?? "Other"}
            </option>
          </select>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full min-h-[120px] px-4 py-3 border border-zinc-500 text-zinc-200 outline-none bg-transparent placeholder:text-zinc-500 resize-none focus:border-[#C9A24D] focus:ring-0 mt-4"
            placeholder={labels.writeMessage}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#C9A24D] text-white text-center h-12 2xl:h-14 mt-5 font-medium hover:bg-[#272727] transition-colors disabled:opacity-70"
          >
            {submitting ? "..." : labels.sendMessage}
          </button>
        </form>
      )}
    </div>
  );
}
