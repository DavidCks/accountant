import { withControllerHelpers } from "@/lib/__state__/controller-helpers";
import { observable, Observable } from "@legendapp/state";
import { SB } from "../_accountant-supabase_/client";
import { HTMLTransformer } from "./utils/html-transformer/html-transformer";
import { JSONTransformer } from "./utils/html-transformer/json-transformer";
import { ExtractedLink } from "./utils/html-transformer/types";
import { CVData, CVDataType } from "./utils/pdf/templates/CVData";
import { ResumeController } from "./resume-controller";
import { AIController } from "./ai-controller";
import { Prompts } from "./ai-prompts";
import { JobSite, jobSites, ResolveLinkResponse } from "./agent-sites";

type AgentState = {
  jobSite: JobSite;
  jobSiteHtml: string;
  jobSiteJobLinks: ExtractedLink[];
  hasApplied: Record<string, boolean>;
  jobSitePaginationLinks: ExtractedLink[];
  jobDescription: {
    url: string;
    description: string;
    applyUrl: string;
  };
  loading: {
    description: boolean;
    resume: boolean;
  };
  jobSpecificResume: CVDataType;
  jobSpecificIntroMessage: string;
  ui: {
    editingDescription: boolean;
    descriptionDraft: string;
  };
};

class AgentControllerBase {
  public static state: Observable<AgentState> = observable<AgentState>({
    jobSite: jobSites[0],
    jobSiteHtml: "",
    jobSiteJobLinks: [],
    hasApplied: {},
    jobSitePaginationLinks: [],
    jobDescription: {
      url: "",
      description: "",
      applyUrl: "",
    },
    loading: {
      description: false,
      resume: false,
    },
    jobSpecificResume: new CVData({}).state,
    jobSpecificIntroMessage: "",
    ui: {
      editingDescription: false,
      descriptionDraft: "",
    },
  });

  public static set(state: Partial<AgentState>) {
    AgentControllerBase.state.set({
      ...AgentControllerBase.state.peek(),
      ...state,
    });
  }

  public static beginEditDescription(prefill?: string) {
    const cur =
      prefill ?? AgentController.state.jobDescription.description.peek();
    AgentController.state.ui.editingDescription.set(true);
    AgentController.state.ui.descriptionDraft.set(cur || "");
  }

  public static setDescriptionDraft(val: string) {
    AgentController.state.ui.descriptionDraft.set(val);
  }

  public static async saveDescription(url?: string) {
    const jobDesc = AgentController.state.ui.descriptionDraft.peek().trim();
    AgentController.state.ui.editingDescription.set(false);
    if (!jobDesc) return;

    const curUrl =
      url ??
      AgentController.state.jobDescription.url.peek() ??
      AgentController.state.jobSite.url.peek();

    AgentController.state.jobDescription.set({
      url: curUrl,
      description: jobDesc,
      applyUrl: "",
    });

    await AgentController.applyJobToResume(jobDesc);
  }

  private async probeIframeable(
    url: string,
    timeoutMs = 1000,
  ): Promise<boolean> {
    if (typeof window === "undefined" || typeof document === "undefined")
      return false;

    return new Promise<boolean>((resolve) => {
      const iframe = document.createElement("iframe");
      // keep it invisible and cheap
      iframe.style.position = "fixed";
      iframe.style.left = "-10000px";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.opacity = "0";
      iframe.setAttribute("referrerpolicy", "no-referrer");

      let done = false;
      let navigated = false;
      const cleanup = () => {
        iframe.onload = null;
        iframe.onerror = null;
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      };
      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        cleanup();
        resolve(ok);
      };

      iframe.onload = () => {
        // Ignore the initial about:blank load; count only after we set src.
        if (!navigated) return;
        finish(true);
      };
      iframe.onerror = () => finish(false);

      const timer = window.setTimeout(() => finish(false), timeoutMs);

      document.body.appendChild(iframe);
      // Navigate on next tick so the first onload (about:blank) doesn’t trick us
      Promise.resolve().then(() => {
        navigated = true;
        try {
          iframe.src = url;
        } catch {
          finish(false);
        }
      });
    });
  }

  public static async setHTML(site?: JobSite, updateState: boolean = true) {
    const targetSite = AgentController.state.jobSite.peek();
    const target = site?.url ?? targetSite.url;

    try {
      const fnURL = `${SB.anonUrl}/functions/v1/clever-action`;
      const apikey = SB.anonKey; // publishable

      const res = await fetch(fnURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`,
          apikey,
        },
        body: JSON.stringify({
          url: target,
          maxHops: 10,
          followMetaRefresh: true,
          format: "html",
          readerFallback: true, // <— lets the worker use the reader proxy if blocked
        }),
        redirect: "follow",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        return { value: null, error: `Proxy ${res.status} ${errText}` };
      }

      const html = await res.text(); // always 200
      if (updateState) {
        AgentController.state.jobSiteHtml.set(html);
      }

      // 1) Extract ALL links
      let allLinks;
      if (targetSite.format === "html") {
        allLinks = HTMLTransformer.getLinks(html);
      } else {
        allLinks = JSONTransformer.getLinks(html);
      }
      const jobLinks = allLinks.filter((l) =>
        targetSite.linkFilter?.jobPostings?.(l.href),
      );

      const paginationLinks = allLinks.filter((l) =>
        targetSite.linkFilter?.pagination?.(l.href),
      );
      if (updateState) {
        AgentController.state.jobSiteJobLinks.set(jobLinks);
        AgentController.state.jobSitePaginationLinks.set(paginationLinks);
      }
      return { value: html, error: null };
    } catch (err: any) {
      return { value: null, error: String(err?.message ?? err) };
    }
  }

  public static async getFinalSite(site: JobSite): Promise<{
    value: JobSite | null;
    error: string | null;
    html?: string;
    meta?: ResolveLinkResponse;
  }> {
    const inputUrl = (site?.url ?? "").trim();
    if (!inputUrl) return { value: null, error: "Missing site.url" };

    // Your deployed resolver
    const fnURL =
      "https://jgvvywbqpqgprmysxdcp.supabase.co/functions/v1/smart-worker";

    // Try GET first (no auth headers; function should be public)
    const tryOnce = async (): Promise<Response> =>
      fetch(`${fnURL}?url=${encodeURIComponent(inputUrl)}&include_html=1`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apikey}`,
        },
        redirect: "follow",
      });
    const apikey = SB.anonKey; // publishable

    // Fallback to POST if GET fails (some setups prefer POST)
    const tryPost = async (): Promise<Response> =>
      fetch(fnURL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apikey}`,
        },
        body: JSON.stringify({ url: inputUrl }),
        redirect: "follow",
      });

    let res: Response;
    try {
      res = await tryOnce();
      if (
        !res.ok ||
        !(res.headers.get("content-type") || "").includes("application/json")
      ) {
        // Try POST fallback
        res = await tryPost();
      }
    } catch (e: any) {
      return { value: null, error: String(e?.message ?? e) };
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      return {
        value: null,
        error: `Resolver ${res.status} ${msg.slice(0, 500)}`,
      };
    }

    // Parse JSON (be tolerant if server returns text/json)
    let data: ResolveLinkResponse | null = null;
    try {
      data = (await res.json()) as ResolveLinkResponse;
    } catch {
      const txt = await res.text().catch(() => "");
      try {
        data = JSON.parse(txt) as ResolveLinkResponse;
      } catch {
        return { value: null, error: "Resolver returned non-JSON response." };
      }
    }

    if (!data?.ok) {
      return { value: null, error: data?.error || "Resolver failed." };
    }

    const finalUrl = (data.final_url || "").trim();
    if (!finalUrl) {
      return {
        value: null,
        error: "Resolver did not return final_url.",
        meta: data,
      };
    }

    // Preserve any filters from the incoming site
    const value: JobSite = {
      title: site.title,
      needsRedirect: site.needsRedirect,
      url: finalUrl,
      format: site.format,
      linkFilter: site.linkFilter,
    };

    return { value, error: null, meta: data };
  }

  public static async setJobDescription(site: JobSite) {
    AgentControllerBase.state.loading.description.set(true);
    const jobSiteHtml = await AgentControllerBase.setHTML(site, false);
    let jobDesc: string | null = null;
    let jobApplyUrl: string = "";

    if (jobSiteHtml.value) {
      jobApplyUrl = site.contentFilter?.applyLinkFilter
        ? await site.contentFilter.applyLinkFilter(jobSiteHtml.value)
        : "";

      if (jobApplyUrl) {
        AgentController.state.jobSite.url.set(jobApplyUrl);
        AgentControllerBase.state.jobDescription.set({
          url: site.url,
          description: "",
          applyUrl: jobApplyUrl,
        });
      }
      jobDesc = site.contentFilter?.jobDescription
        ? await site.contentFilter.jobDescription(jobSiteHtml.value)
        : jobSiteHtml.value;
    }
    AgentControllerBase.state.loading.description.set(false);
    if (jobDesc) {
      AgentControllerBase.state.jobDescription.set({
        url: site.url,
        description: jobDesc,
        applyUrl: jobApplyUrl,
      });
      return jobDesc;
    } else {
      return "";
    }
  }

  public static async applyJobToResume(jobDescription: string) {
    AgentControllerBase.state.loading.resume.set(true);
    const fullResume: CVDataType = ResumeController.state.data.peek();
    const smallResume: string = ResumeController.getDenseResume();
    const basePrompt =
      `## Resume Data\n${smallResume}\n\n` +
      `## Job Desciption\n${jobDescription}`;
    const jobTitle = await AIController.chatSend({
      model: "prompt",
      input: basePrompt + Prompts.jobTitle,
    });
    if (jobTitle.ok) {
      fullResume.workTitle = jobTitle.output;
      const resume = JSON.parse(JSON.stringify(fullResume));
      AgentControllerBase.state.jobSpecificResume.set(resume);
    }
    const tagline = await AIController.chatSend({
      model: "prompt",
      input: basePrompt + Prompts.tagline,
    });
    if (tagline.ok) {
      fullResume.tagLine = tagline.output.replaceAll("*", "");
      fullResume.subTagLine = "";
      const resume = JSON.parse(JSON.stringify(fullResume));
      AgentControllerBase.state.jobSpecificResume.set(resume);
    }
    const about = await AIController.chatSend({
      model: "prompt",
      input: basePrompt + Prompts.about,
    });
    if (about.ok) {
      fullResume.story = about.output;
      const resume = JSON.parse(JSON.stringify(fullResume));
      AgentControllerBase.state.jobSpecificResume.set(resume);
    }
    // work experience
    for (let i = 0; i < fullResume.workExperience.length; i++) {
      const w = fullResume.workExperience[i];
      const d = (w.details || [])
        .map(({ description }) => description)
        .join("\n");

      const newD = await AIController.chatSend({
        model: "prompt",
        input:
          `JD: \n${jobDescription}\n\n
          Details:\n${d}\n\n` + Prompts.workExperienceDetails,
      });

      if (newD?.ok) {
        if (!fullResume.workExperience[i].details?.length) {
          fullResume.workExperience[i].details = [
            {
              description: newD.output,
              link: "",
            },
          ];
        } else {
          fullResume.workExperience[i].details[0].description = newD.output;
        }
      }
    }
    const resumeWithWorkExp = JSON.parse(JSON.stringify(fullResume));
    AgentControllerBase.state.jobSpecificResume.set(resumeWithWorkExp);
    const relevantProjects = await AIController.chatSend({
      model: "prompt",
      input:
        `JD: \n${jobDescription}\n\n
        Projects:\n${JSON.stringify(fullResume.projects)}\n\n` +
        Prompts.projectRelevance,
    });

    let projects: CVDataType["projects"] = [];
    if (!relevantProjects.ok) {
      projects = fullResume.projects;
    } else {
      // sort projects by relevance
      const out = relevantProjects.output.toLowerCase();
      projects = [...fullResume.projects].sort((a, b) => {
        const ia = out.indexOf(a.title.toLowerCase()),
          ib = out.indexOf(b.title.toLowerCase());
        return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
      });
    }

    const endIndex = Math.abs(fullResume.workExperience.length - 6);
    projects = projects.slice(0, endIndex);

    // projects
    for (let i = 0; i < projects.length; i++) {
      const w = projects[i];
      const d = `Details: ${w.details}\nTechnology: ${w.technology}`;

      const newD = await AIController.chatSend({
        model: "prompt",
        input:
          `JD: \n${jobDescription}\n\n
          Details:\n${d}\n\n` + Prompts.projectDetails,
      });

      const newT = await AIController.chatSend({
        model: "prompt",
        input:
          `JD: \n${jobDescription}\n\n
          Details:\n${d}\n\n` + Prompts.projectTech,
      });

      if (newD?.ok) {
        fullResume.projects[i].title = w.title;
        fullResume.projects[i].details = newD.output;
      }

      if (newT?.ok) {
        fullResume.projects[i].technology = newT.output;
      }
      const resumeWithProj = JSON.parse(JSON.stringify(fullResume));
      AgentControllerBase.state.jobSpecificResume.set(resumeWithProj);
    }

    const coverLetter = await AIController.chatSend({
      model: "prompt",
      input:
        `JD: \n${jobDescription}\n\n` +
        `Applicant Name: ${fullResume.name.firstName} ${fullResume.name.lastName}\n\n` +
        `About Me:\n${fullResume.story}\n\n` +
        Prompts.coverLetter,
    });
    if (coverLetter.ok) {
      AgentControllerBase.state.jobSpecificIntroMessage.set(coverLetter.output);
    }

    const resumeWithProj = JSON.parse(JSON.stringify(fullResume));
    AgentControllerBase.state.jobSpecificResume.set(resumeWithProj);

    AgentControllerBase.state.loading.resume.set(false);
  }
}

export const AgentController = withControllerHelpers(AgentControllerBase);
