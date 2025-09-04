import { AIController } from "./ai-controller";
import { HTMLTransformer } from "./utils/html-transformer/html-transformer";

export type JobSite = {
  title: string;
  url: string;
  needsRedirect: boolean;
  format: "json" | "html";
  linkFilter?: {
    jobPostings?: (url: string) => boolean;
    pagination?: (url: string) => boolean;
  };
  contentFilter?: {
    jobDescription?: (html: string) => Promise<string>;
    applyLinkFilter?: (html: string) => Promise<string>;
  };
};

export type ResolveLinkResponse = {
  ok: boolean;
  start_url?: string;
  final_url?: string;
  final_status?: number;
  final_content_type?: string;
  total_hops?: number;
  meta_refresh_followed?: boolean;
  hops?: Array<{
    url: string;
    status: number;
    location?: string;
    via?: "http" | "refresh-header" | "meta-refresh";
  }>;
  html?: string;
  error?: string;
};

export const jobSites = [
  {
    title: "English jobs in Poland",
    url: "https://englishjobs.pl/in/warszawa",
    format: "html",
    needsRedirect: true,
    linkFilter: {
      jobPostings: (url: string) => {
        return url.includes("clickout");
      },
      pagination: (url: string) => {
        return url.includes("page=") || url.endsWith("in/warszawa");
      },
    },
  } as JobSite,
  {
    title: "Tokyo Dev",
    url: "https://www.tokyodev.com/jobs#295",
    format: "html",
    needsRedirect: false,
    linkFilter: {
      jobPostings: (url: string) => {
        return url.includes("jobs/") && url.includes("companies/");
      },
      pagination: () => {
        return false;
      },
    },
    contentFilter: {
      jobDescription: async (html: string) => {
        const raw = HTMLTransformer.getTokyoDevJobDescription(html);
        const summary = await AIController.summarizeJobDescription(raw);
        return summary;
      },
      applyLinkFilter: async (html: string) => {
        const raw = HTMLTransformer.getTokyoDevApplyLink(html);
        return raw;
      },
    },
  } as JobSite,
  {
    title: "Remotive",
    url: "https://remotive.com/api/remote-jobs?search=react",
    needsRedirect: false,
    format: "json",
    linkFilter: {
      jobPostings: (url: string) => {
        return url.includes("jobs/");
      },
      pagination: () => {
        return false;
      },
    },
    contentFilter: {
      jobDescription: async (html: string) => {
        const raw = HTMLTransformer.getRemotiveJobDescription(html);
        const summary = await AIController.summarizeJobDescription(raw);
        return summary;
      },
    },
  } as JobSite,
] as JobSite[];
