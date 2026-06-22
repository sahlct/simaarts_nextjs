import ProjectsClient from "@/components/ProjectsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects | Elbano",
  description: "Explore our portfolio of premium roofing projects across the globe. From Mediterranean villas to modern desert homes, see how Elbano transforms structures.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
