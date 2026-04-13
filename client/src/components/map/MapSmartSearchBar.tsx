"use client";

import { Mic, Search, Square, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { focusRing } from "@/lib/ui";
import { cn } from "@/lib/utils";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: { [index: number]: { [index: number]: { transcript: string } } };
};

type MapSmartSearchBarStrings = {
  placeholder: string;
  inputAria: string;
  submitAria: string;
  clearAria: string;
  voiceAria: string;
  voiceStopAria: string;
  voiceUnsupported: string;
  voiceListening: string;
};

type MapSmartSearchBarProps = {
  className?: string;
  locale: "bn" | "en";
  strings: MapSmartSearchBarStrings;
  onSearch: (query: string) => void;
};

function getSpeechRecognitionCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function MapSmartSearchBar({
  className,
  locale,
  strings,
  onSearch,
}: MapSmartSearchBarProps) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const recRef = useRef<SpeechRec | null>(null);

  const stopListening = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    recRef.current = null;
    setListening(false);
  }, []);

  const startListening = useCallback(() => {
    setVoiceNote(null);
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setVoiceNote(strings.voiceUnsupported);
      return;
    }
    stopListening();
    const r = new Ctor();
    r.lang = locale === "bn" ? "bn-BD" : "en-US";
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (e) => {
      const t = e.results[0][0].transcript.trim();
      setValue(t);
      if (t) onSearch(t);
    };
    r.onerror = () => {
      setVoiceNote(strings.voiceUnsupported);
      setListening(false);
      recRef.current = null;
    };
    r.onend = () => {
      setListening(false);
      recRef.current = null;
    };
    recRef.current = r;
    try {
      r.start();
      setListening(true);
    } catch {
      setVoiceNote(strings.voiceUnsupported);
      setListening(false);
      recRef.current = null;
    }
  }, [locale, onSearch, stopListening, strings.voiceUnsupported]);

  const submit = useCallback(() => {
    const q = value.trim();
    if (q) onSearch(q);
  }, [value, onSearch]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={strings.placeholder}
            aria-label={strings.inputAria}
            autoComplete="off"
            className={cn(
              "w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm",
              "placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/25",
              "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500",
            )}
          />
          {value ? (
            <button
              type="button"
              aria-label={strings.clearAria}
              onClick={() => setValue("")}
                           className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10",
                focusRing,
              )}
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          aria-label={listening ? strings.voiceStopAria : strings.voiceAria}
          aria-pressed={listening}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors",
            listening
              ? "border-amber-500 bg-amber-500 text-white dark:bg-amber-600"
              : "border-slate-200 bg-white text-amber-700 hover:bg-amber-50 dark:border-slate-600 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-amber-950/40",
            focusRing,
          )}
        >
          {listening ? (
            <Square className="size-4 fill-current" aria-hidden />
          ) : (
            <Mic className="size-5" aria-hidden />
          )}
        </button>
        <button
          type="button"
          onClick={submit}
          aria-label={strings.submitAria}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500",
            focusRing,
          )}
        >
          <Search className="size-5" aria-hidden />
        </button>
      </div>
      {listening ? (
        <p className="text-xs font-medium text-amber-800 dark:text-amber-200/90" role="status">
          {strings.voiceListening}
        </p>
      ) : null}
      {voiceNote && !listening ? (
        <p className="text-xs text-amber-800 dark:text-amber-200/90" role="status">
          {voiceNote}
        </p>
      ) : null}
    </div>
  );
}
