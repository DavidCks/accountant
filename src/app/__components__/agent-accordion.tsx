import { FC } from "react";
import { $React } from "@legendapp/state/react-web";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AgentController } from "./agent-controller";
import { Button } from "@/components/ui/button";
import { Memo } from "@legendapp/state/react";
import { LinkPill } from "./link-pill";
import { jobSites } from "./agent-sites";
import ResumeTemplate from "./resume-template";
import { Textarea } from "@/components/ui/textarea";
import { DownloadResumePDF } from "./download-resume";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AgentAccordion: FC = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Agent</AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-balance">
          <div>
            <div className="py-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Job Site
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {jobSites.map((s, i) => {
                  return (
                    <Button
                      key={i}
                      variant={"outline"}
                      onClick={() => {
                        AgentController.state.jobSite.set(s);
                        AgentController.setHTML(s);
                      }}
                    >
                      {s.title}
                    </Button>
                  );
                })}
              </div>
            </div>
            <Memo>
              {() => {
                const jobs = AgentController.state.jobSiteJobLinks.get() ?? [];
                const pagination =
                  AgentController.state.jobSitePaginationLinks.get() ?? [];

                const onPaginationPick = (url: string) => {
                  const jobSite = AgentController.state.jobSite.peek();
                  const newJobSite = {
                    ...jobSite,
                    url: url,
                  };
                  AgentController.setHTML(newJobSite);
                  AgentController.state.jobSite.set(newJobSite);
                };

                const onJobPick = async (url: string) => {
                  const jobSite = AgentController.state.jobSite.peek();
                  const newJobSite = {
                    ...jobSite,
                    url: url,
                  };
                  if (jobSite.needsRedirect) {
                    const finalSite =
                      await AgentController.getFinalSite(newJobSite);
                    window.open(
                      finalSite.value?.url,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  } else {
                    AgentController.state.jobSite.set(newJobSite);
                    const jobDesc =
                      await AgentController.setJobDescription(newJobSite);
                    AgentController.applyJobToResume(jobDesc);
                  }
                };

                return (
                  <div className="space-y-4">
                    {jobs.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Job Links
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {jobs.map((l, i: number) => (
                            <div key={`other-${i}`}>
                              <Memo>
                                {() => {
                                  const hasAppliedRec =
                                    AgentController.state.hasApplied.get();
                                  const hasApplied =
                                    hasAppliedRec[l.absolute!] ||
                                    localStorage.getItem(l.absolute!) ===
                                      "true";
                                  return (
                                    <LinkPill
                                      link={l}
                                      hasApplied={hasApplied}
                                      kind="other"
                                      onClick={onJobPick}
                                    />
                                  );
                                }}
                              </Memo>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Empty state */}
                    {jobs.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        No job links found on this page.
                      </p>
                    )}
                    {pagination.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-2">
                          Pagination links
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pagination.map((l, i: number) => (
                            <LinkPill
                              key={`other-${i}`}
                              link={l}
                              kind="other"
                              onClick={onPaginationPick}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            </Memo>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Memo>
              {() => {
                const loading = AgentController.state.loading.description.get();
                const desc = AgentController.state.jobDescription.get() ?? {};
                const url = desc.url as string | undefined;

                const description =
                  (desc.description as string | undefined) ?? "";

                if (loading) {
                  return (
                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-5 w-48 animate-pulse rounded bg-muted/60" />
                        <div className="flex gap-2">
                          <div className="h-9 w-20 animate-pulse rounded bg-muted/60" />
                          <div className="h-9 w-24 animate-pulse rounded bg-muted/60" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="h-4 w-full animate-pulse rounded bg-muted/60"
                            style={{ width: `${90 - i * 5}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }

                // WITH DESCRIPTION
                if (description) {
                  const editing =
                    AgentController.state.ui.editingDescription.get();
                  const draft = AgentController.state.ui.descriptionDraft.get();

                  return (
                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-muted-foreground">
                            {url ?? "Job description"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (!editing) {
                                AgentController.beginEditDescription(
                                  description,
                                );
                              } else {
                                await AgentController.saveDescription(url);
                              }
                            }}
                          >
                            {editing ? "Save" : "Edit"}
                          </Button>

                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex"
                              title="Open original in a new tab"
                            >
                              <Button size="sm" variant="outline">
                                Open
                              </Button>
                            </a>
                          ) : null}
                        </div>
                      </div>

                      <div className="px-4 py-4">
                        {editing ? (
                          <Textarea
                            value={draft}
                            onChange={(e) =>
                              AgentController.setDescriptionDraft(
                                e.target.value,
                              )
                            }
                            className="min-h-[240px]"
                            placeholder="Edit the job description…"
                          />
                        ) : (
                          <details className="group" open>
                            <summary className="cursor-pointer list-none select-none pb-2 text-sm font-medium text-muted-foreground hover:opacity-80">
                              <span className="hidden group-open:inline">
                                Hide description
                              </span>
                              <span className="group-open:hidden">
                                Show full description
                              </span>
                            </summary>
                            <article className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed">
                              {description}
                            </article>
                          </details>
                        )}
                      </div>
                    </div>
                  );
                }

                // NO DESCRIPTION — allow adding one inline
                {
                  const editing =
                    AgentController.state.ui.editingDescription.get();
                  const draft = AgentController.state.ui.descriptionDraft.get();

                  return (
                    <div className="rounded-2xl border bg-card text-card-foreground shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
                        <p className="truncate text-sm text-muted-foreground">
                          No job selected
                        </p>
                        <Button
                          size="sm"
                          onClick={async () => {
                            if (!editing) {
                              AgentController.beginEditDescription("");
                            } else {
                              await AgentController.saveDescription();
                            }
                          }}
                        >
                          {editing ? "Save" : "Add description"}
                        </Button>
                      </div>

                      <div className="px-4 py-4">
                        {editing ? (
                          <Textarea
                            value={draft}
                            onChange={(e) =>
                              AgentController.setDescriptionDraft(
                                e.target.value,
                              )
                            }
                            className="min-h-[240px]"
                            placeholder="Paste or type the job description…"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">
                            Click &ldquo;Add description&rdquo; to paste a job
                            posting.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              }}
            </Memo>
            <Memo>
              {() => {
                const loadingResume =
                  AgentController.state.loading.resume.get();
                if (!loadingResume) return null;

                return (
                  <div
                    className="w-full h-4"
                    role="status"
                    aria-busy="true"
                    aria-live="polite"
                  >
                    <span className="block h-2 w-full rounded-3xl translate-y-1 bg-primary/70 animate-pulse"></span>
                    <span className="sr-only">Loading resume…</span>
                  </div>
                );
              }}
            </Memo>
            <Memo>
              {() => {
                const data = AgentController.state.jobSpecificResume.get();
                const coverLetter =
                  AgentController.state.jobSpecificIntroMessage.get();
                const loading = AgentController.state.loading.resume.get();
                return (
                  <div className="flex flex-col gap-2">
                    <ResumeTemplate cvdata={data} />
                    {coverLetter && (
                      <Card>
                        <CardContent>{coverLetter}</CardContent>
                      </Card>
                    )}
                    <div className="flex flex-row items-center gap-2">
                      {loading && <Loader2 className="animate-spin" />}
                      <DownloadResumePDF cvdata={data} />
                    </div>
                  </div>
                );
              }}
            </Memo>
            <Memo>
              {() => {
                const loadingResume =
                  AgentController.state.loading.resume.get();
                if (!loadingResume) return null;

                return (
                  <div
                    className="w-full h-4"
                    role="status"
                    aria-busy="true"
                    aria-live="polite"
                  >
                    <span className="block h-2 w-full rounded-3xl translate-y-1 bg-primary/70 animate-pulse"></span>
                    <span className="sr-only">Loading resume…</span>
                  </div>
                );
              }}
            </Memo>
            <Memo>
              {() => {
                const desc = AgentController.state.jobDescription.get() ?? {};
                const applyUrl = desc.applyUrl as string | undefined;
                return applyUrl ? (
                  <div className="flex flex-row flex-wrap gap-2">
                    <a
                      href={applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex"
                      title="Open original in a new tab"
                    >
                      <Button variant={"default"} size="sm">
                        Open Application Site
                      </Button>
                    </a>
                  </div>
                ) : null;
              }}
            </Memo>
            <$React.iframe
              className="rounded-md"
              width={"100%"}
              height={"800"}
              $src={AgentController.state.jobSite.url}
            ></$React.iframe>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AgentAccordion;
