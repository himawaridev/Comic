"use client";

import Script from "next/script";
import { Chrome, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void; ux_mode: "popup" }) => void;
          renderButton: (element: HTMLElement, options: { type: "standard"; shape: "rectangular"; theme: "outline"; text: "continue_with"; size: "large"; width: number }) => void;
        };
      };
    };
  }
}

export default function GoogleSignInButton({ clientId, returnTo, onError }: { clientId: string; returnTo: string; onError: (message: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialize = useCallback(() => {
    if (!window.google || !containerRef.current || renderedRef.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: "popup",
      callback: async ({ credential }) => {
        if (!credential) return onError("Google khong tra ve thong tin dang nhap.");
        setLoading(true);
        onError("");
        try {
          const response = await fetch("/api/auth/google/credential", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ credential }),
          });
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.error || "Khong the dang nhap bang Google");
          router.push(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/profile");
          router.refresh();
        } catch (error) {
          onError(error instanceof Error ? error.message : "Khong the dang nhap bang Google");
        } finally {
          setLoading(false);
        }
      },
    });
    containerRef.current.replaceChildren();
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      shape: "rectangular",
      theme: "outline",
      text: "continue_with",
      size: "large",
      width: Math.min(360, Math.max(240, containerRef.current.clientWidth)),
    });
    renderedRef.current = true;
  }, [clientId, onError, returnTo, router]);

  return (
    <div className="google-identity-shell" aria-busy={loading}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initialize} />
      <div ref={containerRef} className="google-identity-button"><span><Chrome size={19} /> Dang tai Google...</span></div>
      {loading ? <span className="google-identity-loading"><LoaderCircle size={17} /> Dang xac minh...</span> : null}
    </div>
  );
}
