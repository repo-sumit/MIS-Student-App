"use client";

import { LocaleProvider } from "@/providers/locale-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ProfileProvider } from "@/providers/profile-provider";
import { DocumentsProvider } from "@/providers/documents-provider";
import { ApplicationsProvider } from "@/providers/applications-provider";
import {
  AllotmentBridgeProvider,
  ScrutinyBridgeProvider
} from "@/providers/bridge-providers";
import { DemoProgressProvider } from "@/providers/demo-progress-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ToastProvider>
        <ProfileProvider>
          <DocumentsProvider>
            <ApplicationsProvider>
              <ScrutinyBridgeProvider>
                <AllotmentBridgeProvider>
                  <DemoProgressProvider>{children}</DemoProgressProvider>
                </AllotmentBridgeProvider>
              </ScrutinyBridgeProvider>
            </ApplicationsProvider>
          </DocumentsProvider>
        </ProfileProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}
