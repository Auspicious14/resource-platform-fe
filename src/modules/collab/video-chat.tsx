"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

interface VideoChatProps {
  projectId: string;
  user: any;
}

export default function VideoChat({ projectId, user }: VideoChatProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [key: string]: MediaStream;
  }>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
      {
        withCredentials: true,
      }
    );
    socketRef.current = socket;

    socket.on("video-signal", async ({ sender, signal }) => {
      if (signal.type === "offer") {
        await handleOffer(sender, signal);
      } else if (signal.type === "answer") {
        await handleAnswer(sender, signal);
      } else if (signal.candidate) {
        await handleCandidate(sender, signal);
      }
    });

    return () => {
      socket.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [projectId]);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      setIsConnected(true);
      // In a real app, logic would go here to notify others in the project room
      // and initiate peer connections. For demo, we just enable the stream.
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  const stopCall = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setIsConnected(false);
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    setRemoteStreams({});
  };

  const handleOffer = async (senderId: string, offer: any) => {
    const pc = createPeerConnection(senderId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current?.emit("video-signal", {
      target: senderId,
      signal: answer,
    });
  };

  const handleAnswer = async (senderId: string, answer: any) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleCandidate = async (senderId: string, candidate: any) => {
    const pc = peerConnections.current[senderId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const createPeerConnection = (targetId: string) => {
    const pc = new RTCPeerConnection(iceServers);
    peerConnections.current[targetId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("video-signal", {
          target: targetId,
          signal: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [targetId]: event.streams[0] }));
    };

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    return pc;
  };

  const toggleMute = () => {
    if (stream) {
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-inner">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          Video Collaboration
        </h3>
        <div className="flex gap-2">
          {!isConnected ? (
            <button
              onClick={startCall}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={stopCall}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <PhoneOff className="h-3 w-3" /> End
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Local Video */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border-2 border-primary/20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
            <span className="text-white text-xs font-medium">You</span>
            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-full"
              >
                {isMuted ? (
                  <MicOff className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <Mic className="h-3.5 w-3.5 text-white" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className="p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-full"
              >
                {isVideoOff ? (
                  <VideoOff className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <Video className="h-3.5 w-3.5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([peerId, remoteStream]) => (
          <div
            key={peerId}
            className="relative aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-700"
          >
            <video
              autoPlay
              playsInline
              ref={(el) => {
                if (el) el.srcObject = remoteStream;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded text-white text-[10px]">
              Partner
            </div>
          </div>
        ))}

        {!isConnected && (
          <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <Video className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Camera inactive</p>
          </div>
        )}
      </div>
    </div>
  );
}
