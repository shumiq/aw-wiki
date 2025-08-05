import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "tab-active" : "";
  return (
    <div class="navbar bg-base-300 shadow-lg">
      <div class="flex flex-1 items-center gap-2">
        <a href="/">
          <img src="/logo.png" alt="logo" class="m-2 w-[128px]" />
        </a>
        <div role="tablist" class="tabs tabs-border">
          <a role="tab" href="/" class={`tab ${active("/")}`}>
            Home
          </a>
          <a role="tab" href="/wiki" class={`tab ${active("/wiki")}`}>
            Wiki
          </a>
          <a role="tab" href="/compare" class={`tab ${active("/compare")}`}>
            Compare
          </a>
        </div>
      </div>
      <div class="flex-none"></div>
    </div>
  );
}
