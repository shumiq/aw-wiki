import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Nav } from "~/components/Nav";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <div class="bg-base-200 flex h-screen flex-col items-center justify-center overflow-auto">
            <Nav />
            <div class="bg-base-100 container flex-1 overflow-auto shadow-lg">
              <Suspense>{props.children}</Suspense>
            </div>
          </div>
          {/* <TranslationProvider /> */}
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
