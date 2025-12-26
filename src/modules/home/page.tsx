"use client";
import React from "react";
import { Button, Card, CardContent, Badge } from "@/components";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProjectState } from "../projects/context";
import {
  Rocket,
  Target,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  Code2,
  BrainCircuit,
  MessagesSquare,
} from "lucide-react";
import { motion } from "framer-motion";

export const HomePage = () => {
  const { featuredProjects } = useProjectState();
  const router = useRouter();

  const stats = [
    {
      label: "Active Learners",
      value: "10,000+",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Projects Built",
      value: "25,000+",
      icon: Code2,
      color: "text-purple-600",
    },
    {
      label: "Success Rate",
      value: "94%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "AI Interactions",
      value: "1M+",
      icon: BrainCircuit,
      color: "text-orange-600",
    },
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Frontend Developer",
      content:
        "The project-based approach here completely changed how I learn. No more tutorial hell!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
      name: "Sarah Chen",
      role: "Fullstack Engineer",
      content:
        "The AI guide is like having a senior dev sitting right next to me. Invaluable feedback.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      name: "Michael Ross",
      role: "Backend Student",
      content:
        "Completed my first full-stack app in 2 weeks. The milestones keep you focused.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1 dark:bg-gray-800 dark:text-gray-300"
            >
              🚀 Version 2.0 is here with AI Guidance
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Escape Tutorial Hell with <br />
              <span className="text-blue-600 dark:text-blue-400">
                Project-Based Learning
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Master software engineering by building real-world projects. Get
              AI-powered guidance, community feedback, and structured learning
              paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 text-lg"
                onClick={() => router.push("/projects")}
              >
                Browse Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg"
                onClick={() => router.push("/paths")}
              >
                View Learning Paths
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`flex justify-center mb-2 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why choose DevResource?</h2>
          <p className="text-gray-600">
            Everything you need to go from beginner to pro.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 border-none bg-blue-50/50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Guided Milestones</h3>
            <p className="text-gray-600 leading-relaxed">
              Projects are broken down into manageable milestones with clear
              objectives and validation criteria.
            </p>
          </Card>
          <Card className="p-8 border-none bg-purple-50/50">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Personal Mentor</h3>
            <p className="text-gray-600 leading-relaxed">
              Stuck on a bug? Our context-aware AI understands your project and
              provides hints without giving away the answer.
            </p>
          </Card>
          <Card className="p-8 border-none bg-green-50/50">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
              <MessagesSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Community Reviews</h3>
            <p className="text-gray-600 leading-relaxed">
              Submit your solutions and get feedback from other developers.
              Learn by reviewing others' work too.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Projects Carousel (Simple Grid) */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
              <p className="text-gray-400">
                Hand-picked challenges to boost your skills.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
            >
              See all projects <Rocket size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects?.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id || index}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full">
                  <div className="aspect-video bg-gray-700 relative overflow-hidden">
                    <img
                      src={`https://placehold.co/600x400/1f2937/white?text=${project.title}`}
                      alt={project.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-black/50 backdrop-blur-md border-none text-white capitalize"
                      >
                        {project.difficultyLevel.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-900/50 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 hover:bg-gray-700 text-white"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Loved by Developers Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-700 rounded-full blur-3xl opacity-50" />

        <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to start building?</h2>
          <p className="text-blue-100 text-xl mb-10">
            Join thousands of developers escaping tutorial hell and building
            real careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 h-12 px-10 text-lg"
              onClick={() => router.push("/signup")}
            >
              Sign Up Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-400 text-white hover:bg-blue-700 h-12 px-10 text-lg"
            >
              Explore Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Rocket size={24} />
            <span>DevResource</span>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm">
            <Link
              href="/projects"
              className="hover:text-blue-600 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/paths"
              className="hover:text-blue-600 transition-colors"
            >
              Paths
            </Link>
            <Link
              href="/community"
              className="hover:text-blue-600 transition-colors"
            >
              Community
            </Link>
            <Link
              href="/about"
              className="hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 DevResource Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
