"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight, Star } from "lucide-react";
import { Card, CardContent, Badge } from "@/components";
import { DifficultyBadge } from "./DifficultyBadge";
import Link from "next/link";

interface ProjectCardProps {
  project: any;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group h-full flex flex-col overflow-hidden border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300">
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={project.thumbnailUrl || `https://placehold.co/600x400/3b82f6/white?text=${project.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt={project.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute top-4 left-4">
              <DifficultyBadge level={project.difficultyLevel} />
            </div>

            {project.isTrending && (
              <div className="absolute top-4 right-4 bg-amber-400 text-black px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Star size={10} fill="black" />
                Trending
              </div>
            )}
          </div>

          <CardContent className="flex-1 p-6 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack?.slice(0, 3).map((tech: string) => (
                <span key={tech} className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  #{tech}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {project.title}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-blue-500" />
                  {project.timeEstimate || "2-4h"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-purple-500" />
                  {project.submissionCount || 0}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <ArrowRight size={16} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
