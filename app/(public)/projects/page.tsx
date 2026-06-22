import ProjectsClient from "@/components/ProjectsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Projects",
  description: "Explore ELBANO's portfolio of premium roofing projects across Kerala and beyond. From Mediterranean villas to modern homes, see how Elbano transforms structures with quality craftsmanship.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Our Projects | ELBANO",
    description: "Explore ELBANO's portfolio of premium roofing projects across Kerala. See how Elbano transforms structures with quality craftsmanship.",
    url: "https://elbanoindia.com/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
