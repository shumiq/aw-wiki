import { useNavigate } from "@solidjs/router";

export default function NotFound() {
  const navigate = useNavigate();
  navigate("/");
}
