"use client";

import { LocaleProvider } from "@/providers/locale-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { ProfileProvider } from "@/providers/profile-provider";
import { DocumentsProvider } from "@/providers/documents-provider";
import { ApplicationsProvider } from "@/providers/applications-provider";
import { AllocationProvider } from "@/providers/allocation-provider";
import { MetaProvider } from "@/providers/meta-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <ToastProvider>
        <MetaProvider>
          <ProfileProvider>
            <DocumentsProvider>
              <ApplicationsProvider>
                <AllocationProvider>{children}</AllocationProvider>
              </ApplicationsProvider>
            </DocumentsProvider>
          </ProfileProvider>
        </MetaProvider>
      </ToastProvider>
    </LocaleProvider>
  );
}
