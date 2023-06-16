import { serialize } from "cookie";
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse | undefined {
  const response = NextResponse.next();

  const clientPathUrl: Function = (clientUrl: string): boolean =>
    request.nextUrl.pathname.startsWith(clientUrl);

  const clientHasLogged: Function = (): boolean =>
    request.cookies.get("clientLogged")!.value == "false" ? false : true;

  const isClientCookieEmpty: Function = (): boolean =>
    request.cookies.get("clientLogged") == undefined;

  if (clientPathUrl("/login")) {
    if (isClientCookieEmpty()) {
      response.cookies.set("clientLogged", "false");
      response.cookies.set("userdata", "");
    } else {
      if (clientHasLogged())
        return NextResponse.redirect(new URL("/home", request.url));
    }
    // console.log(response.cookies.getAll());
  } else if (
    clientPathUrl("/toko") ||
    clientPathUrl("/admin") ||
    clientPathUrl("/history") ||
    clientPathUrl("cart") ||
    clientPathUrl("profile")
  ) {
    if (!clientHasLogged()) {
      return NextResponse.rewrite(
        `${request.nextUrl.protocol}//${request.nextUrl.host}/401`,
        {
          status: 401,
        }
      );
    }
  } else if (clientPathUrl("/logout")) {
    response.cookies.delete("clientLogged");
    response.cookies.delete("userdata");
    return NextResponse.redirect(
      new URL(`${request.nextUrl.protocol}//${request.nextUrl.host}/login`),
      {
        status: 302,
        headers: response.headers,
      }
    );
  }

  return response;
}
