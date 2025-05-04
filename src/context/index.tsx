import React, { FC, ComponentProps, JSX } from "react";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "../modules/auth/context";
import { ProjectConextProvider } from "@/modules/projects/context";

export const combineContext = (...components: FC[]): FC<any> => {
  const CombinedComponent = components.reduce(
    (AccumulatedComponents: any, CurrentComponent: any) => {
      const WrapperComponent: FC<any> = ({
        children,
      }: ComponentProps<FC<any>>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };

      // Assign a displayName to the WrapperComponent
      WrapperComponent.displayName = `Combined(${
        CurrentComponent.displayName || CurrentComponent.name || "Unknown"
      })`;

      return WrapperComponent;
    },
    ({ children }: any) => (
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

  return CombinedComponent;
};

const providers = [AuthContextProvider, ProjectConextProvider] as any;
export const AppContextProvider = combineContext(...providers);
