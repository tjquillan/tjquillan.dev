export function getNormalizedPathname(url: URL) {
  return url.pathname.replace(/\/+$/, "");
}

export function isActivePathname(currentPathname: string, pathname: string) {
  return (
    currentPathname === pathname || currentPathname.startsWith(`${pathname}/`)
  );
}
