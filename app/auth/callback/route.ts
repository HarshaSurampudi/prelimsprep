import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url);

  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If successful, redirect to the 'next' path or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's no code or an error occurred, redirect to an error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
