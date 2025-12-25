"use client";
import React, { useEffect, useState } from "react";
import { 
  Button, 
  Card, 
  CardContent, 
  Badge, 
  AxiosClient,
  CardHeader,
  CardTitle,
  TextInput
} from "@/components";
import { 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  MessageSquare, 
  Star, 
  ThumbsUp, 
  Github, 
  ExternalLink,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Send,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../auth/context";

export const SubmissionReviewPage = () => {
  const params = useParams();
  const submissionId = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();
  
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        // Simulate fetching submission data
        // const res = await AxiosClient.get(`/submissions/${submissionId}`);
        // setSubmission(res.data?.data);
        
        // Mock data for now
        setTimeout(() => {
          setSubmission({
            id: submissionId,
            projectId: "proj-1",
            project: {
              title: "E-commerce API with Node.js",
              difficultyLevel: "INTERMEDIATE"
            },
            user: {
              firstName: "Alex",
              lastName: "Developer",
              avatarUrl: null
            },
            repoUrl: "https://github.com/alex/ecommerce-api",
            createdAt: new Date().toISOString(),
            aiFeedback: {
              score: 85,
              summary: "Excellent implementation of the core features. The code is well-structured and follows most best practices.",
              strengths: ["Clean project structure", "Good use of async/await", "Proper error handling"],
              improvements: ["Add more unit tests for the payment logic", "Consider using a caching layer for product listings"],
              analysis: [
                { type: "security", status: "passed", message: "No critical security vulnerabilities found." },
                { type: "performance", status: "warning", message: "Some queries could be optimized with indexing." },
                { type: "style", status: "passed", message: "Follows Airbnb style guide consistently." }
              ]
            },
            comments: [
              { id: 1, user: { firstName: "Jane", lastName: "Senior" }, content: "Great job on the database schema! Very scalable.", createdAt: new Date().toISOString() }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch submission", error);
        setLoading(false);
      }
    };

    if (submissionId) fetchSubmission();
  }, [submissionId]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    // API call to post comment
    setComment("");
  };

  if (loading) return <div className="p-12 text-center">Loading submission...</div>;
  if (!submission) return <div className="p-12 text-center">Submission not found</div>;

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-blue-600 font-bold mb-2 cursor-pointer hover:underline" onClick={() => router.push(`/projects/${submission.projectId}`)}>
              <Code2 size={16} /> {submission.project.title}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Submission Review</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${submission.user.firstName}`} alt="" />
              </div>
              <span className="text-gray-700 font-medium">Submitted by <span className="font-bold">{submission.user.firstName} {submission.user.lastName}</span></span>
              <span className="text-gray-400 text-sm">• {new Date(submission.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => window.open(submission.repoUrl, "_blank")}>
              <Github size={18} /> View Repository
            </Button>
            <Button className="gap-2">
              Approve Submission
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: AI Feedback & Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Score & Summary */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-900 to-blue-900 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                      <circle 
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364} 
                        strokeDashoffset={364 * (1 - submission.aiFeedback.score / 100)} 
                        className="text-blue-400 transition-all duration-1000" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{submission.aiFeedback.score}</span>
                      <span className="text-[10px] uppercase font-bold text-blue-300">AI Score</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <BrainCircuit className="text-blue-400" size={24} />
                      <h2 className="text-xl font-bold">AI Review Summary</h2>
                    </div>
                    <p className="text-blue-100 text-lg leading-relaxed">{submission.aiFeedback.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {submission.aiFeedback.analysis.map((item: any, i: number) => (
                <Card key={i} className="border-none shadow-sm">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.status === "passed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                    }`}>
                      {item.status === "passed" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{item.type}</div>
                      <div className="text-sm font-bold text-gray-900 capitalize">{item.status}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm bg-green-50/30">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-green-700 flex items-center gap-2 uppercase tracking-wider">
                    <ThumbsUp size={16} /> Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {submission.aiFeedback.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-blue-700 flex items-center gap-2 uppercase tracking-wider">
                    <AlertCircle size={16} /> Areas for Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {submission.aiFeedback.improvements.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" /> {imp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Code Viewer Simulator */}
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="bg-gray-900 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Code2 size={16} />
                  <span>src/controllers/product.controller.ts</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <CardContent className="p-0">
                <pre className="p-6 bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-x-auto leading-relaxed">
                  <code>{`
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, sort } = req.query;
    
    // AI Suggestion: Consider using pagination for large datasets
    const products = await prisma.product.findMany({
      where: category ? { category: String(category) } : {},
      orderBy: sort === 'price_asc' ? { price: 'asc' } : { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    logger.error('Error fetching products', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
                  `}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Peer Reviews & Comments */}
          <div className="space-y-8">
            {/* Rating Section */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Community Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="text-4xl font-bold text-gray-900">4.5</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={24} 
                        className={`${star <= 4.5 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Based on 12 reviews</div>
                  
                  <div className="w-full mt-6 pt-6 border-t">
                    <div className="text-sm font-bold mb-3 text-center">Rate this submission</div>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star 
                            size={32} 
                            className={`${
                              star <= (hoveredRating || rating) 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-200"
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-600" /> Peer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {submission.comments.map((c: any) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{c.user.firstName} {c.user.lastName}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">MENTOR</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                        <div className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex gap-3">
                    <TextInput 
                      placeholder="Add your feedback..." 
                      className="flex-1"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
