import React, { FC, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "../modules/auth/context";
import { ProjectConextProvider } from "@/modules/projects/context";
import { ChatContextProvider } from "@/modules/chat/context";
import { SocialProvider } from "@/modules/social/context";
import { EventProvider } from "@/modules/events/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const QueryProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export const combineContext = (...components: FC<any>[]): FC<any> => {
  return components.reduce(
    (AccumulatedComponents: FC<any>, CurrentComponent: FC<any>) => {
      const WrapperComponent: FC<any> = ({ children }) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };

      WrapperComponent.displayName = `Combined(${
        CurrentComponent.displayName || CurrentComponent.name || "Component"
      })`;

      return WrapperComponent;
    },
    ({ children }: { children: React.ReactNode }) => (
      <>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
            },
          }}
        />
      </>
    )
  );
};

import { SubmissionProvider } from "@/modules/submissions/context";
import { CommunityProvider } from "@/modules/community/context";
import { NotificationProvider } from "@/modules/notifications/context";
import { ProfileProvider } from "@/modules/profile/context";

const providers = [
  QueryProvider,
  AuthContextProvider,
  ProjectConextProvider,
  ProfileProvider,
  ChatContextProvider,
  SubmissionProvider,
  CommunityProvider,
  EventProvider,
  NotificationProvider,
  SocialProvider,
];

export const AppContextProvider = combineContext(...providers);
