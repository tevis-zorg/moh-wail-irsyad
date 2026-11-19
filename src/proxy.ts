import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_LOGIN_PATH = "/admin/login";

function redirectWithCookies(response: NextResponse, destination: URL) {
  const redirectResponse = NextResponse.redirect(destination);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  for (const header of ["Cache-Control", "Expires", "Pragma"]) {
    const value = response.headers.get(header);
    if (value) {
      redirectResponse.headers.set(header, value);
    }
  }

  return redirectResponse;
}

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Admin authentication is unavailable." },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  let claims: Awaited<ReturnType<typeof supabase.auth.getClaims>>["data"]["claims"];
  try {
    const result = await supabase.auth.getClaims();
    claims = result.error ? null : result.data.claims;
  } catch {
    claims = null;
  }

  const appMetadata = claims?.app_metadata as { role?: unknown } | undefined;
  const isAdmin = appMetadata?.role === "admin";
  const isLoginRoute = request.nextUrl.pathname.replace(/\/+$/, "") === ADMIN_LOGIN_PATH;

  response.headers.set("Cache-Control", "private, no-store");

  if (isLoginRoute) {
    if (isAdmin) {
      return redirectWithCookies(response, new URL("/admin", request.url));
    }

    return response;
  }

  if (!isAdmin) {
    return redirectWithCookies(response, new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
