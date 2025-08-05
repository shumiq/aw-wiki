import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <div class="hero flex h-full w-full items-center justify-center">
      <Title>AW Wiki - Home</Title>
      <div class="hero-content text-center">
        <div>
          <h1 class="text-5xl font-bold">Armored Warfare</h1>
          <h1 class="text-5xl font-bold">Unofficial Tank Wikipedia</h1>
          <a class="btn btn-primary mt-5" href="/wiki">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
