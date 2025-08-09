import { placeholderImage } from "./PlaceholderImage";

export interface CVDataType {
  imageUri: string;

  tagLine: string;
  subTagLine: string;

  name: {
    firstName: string;
    lastName: string;
    furigana: string;
  };

  birthday: {
    year: number;
    month: number;
    day: number;
  };

  nationality: string;
  gender: string;
  maritalStatus: string;
  dependents: number;
  alimonyPayments: boolean;
  workTitle: string;

  contact: {
    email: string;
    phone: string;
    address: {
      street: string;
      zip: string;
      city: string;
      country: string;
    };
  };

  education: Array<{
    title: string;
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
    location: string;
    details: Array<{
      description: string;
      link: string;
    }>;
  }>;

  workExperience: Array<{
    title: string;
    role: string;
    companyDescription: string;
    workers: string;
    scope: string;
    responsibilities: Array<{
      title: string;
      tasks: string;
    }>;
    achievements: Array<{
      title: string;
      description: string;
      link: string;
    }>;
    environment: Array<{
      title: string;
      items: Array<{
        level: string;
        item: string;
      }>;
    }>;
    start: string;
    startYear: string;
    startMonth: string;
    endYear: string;
    endMonth: string;
    location: string;
    details: Array<{
      description: string;
      link: string;
    }>;
  }>;

  projects: Array<{
    title: string;
    startYear: string;
    startMonth: string;
    endYear: string;
    endMonth: string;
    details: string;
    links: {
      repository: string;
      website: string;
    };
    users: number;
    technology: string;
  }>;

  skills: {
    media: { description: string; technology: string };
    programming: { description: string; technology: string };
    languages: { description: string; technology: string };
    hobbies: { description: string; technology: string };
    misc: { description: string; technology: string };
  };

  expectations: {
    workplace: string;
    salary: string;
  };

  story: string;
}

export class CVData {
  state: CVDataType;

  constructor(initialData: Partial<CVDataType>) {
    this.state = {
      imageUri: initialData.imageUri ?? placeholderImage,

      tagLine: initialData.tagLine ?? "{TagLine}",
      subTagLine: initialData.subTagLine ?? "{SubTagLine}",

      name: {
        firstName: initialData.name?.firstName ?? "{FirstName}",
        lastName: initialData.name?.lastName ?? "{LastName}",
        furigana: initialData.name?.furigana ?? "{Furigana}",
      },

      birthday: {
        year: initialData.birthday?.year ?? 1990,
        month: initialData.birthday?.month ?? 1,
        day: initialData.birthday?.day ?? 1,
      },

      nationality: initialData.nationality ?? "{Nationality}",
      gender: initialData.gender ?? "{Gender}",
      maritalStatus: initialData.maritalStatus ?? "{MaritalStatus}",
      dependents: initialData.dependents ?? 0,
      alimonyPayments: initialData.alimonyPayments ?? false,
      workTitle: initialData.workTitle ?? "{Work Title}",

      contact: {
        email: initialData.contact?.email ?? "{Email}",
        phone: initialData.contact?.phone ?? "{PhoneNumber}",
        address: {
          street: initialData.contact?.address?.street ?? "{StreetAddress}",
          zip: initialData.contact?.address?.zip ?? "{PostalCode}",
          city: initialData.contact?.address?.city ?? "{City}",
          country: initialData.contact?.address?.country ?? "{Country}",
        },
      },

      education: initialData.education?.map((e) => ({
        title: e.title ?? "{EducationTitle}",
        startYear: e.startYear ?? 2010,
        startMonth: e.startMonth ?? 4,
        endYear: e.endYear ?? 2014,
        endMonth: e.endMonth ?? 3,
        location: e.location ?? "{EducationLocation}",
        details: e.details?.map((d) => ({
          description: d.description ?? "{CourseworkOrFocus}",
          link: d.link ?? "{ExternalLink}",
        })) ?? [{ description: "{CourseworkOrFocus}", link: "{ExternalLink}" }],
      })) ?? [
        {
          title: "{EducationTitle}",
          startYear: 2010,
          startMonth: 4,
          endYear: 2014,
          endMonth: 3,
          location: "{EducationLocation}",
          details: [
            { description: "{CourseworkOrFocus}", link: "{ExternalLink}" },
          ],
        },
      ],

      workExperience: initialData.workExperience?.map((w) => ({
        title: w.title ?? "{CompanyName}",
        role: w.role ?? "{RoleTitle}",
        companyDescription: w.companyDescription ?? "{CompanyDescription}",
        workers: w.workers ?? "{TeamSize}",
        scope: w.scope ?? "{ProjectScope}",
        responsibilities: w.responsibilities?.map((r) => ({
          title: r.title ?? "{ResponsibilityTitle}",
          tasks: r.tasks ?? "{TaskDescription}",
        })) ?? [{ title: "{ResponsibilityTitle}", tasks: "{TaskDescription}" }],
        achievements: w.achievements?.map((a) => ({
          title: a.title ?? "{AchievementTitle}",
          description: a.description ?? "{AchievementDescription}",
          link: a.link ?? "{LinkToProject}",
        })) ?? [
          {
            title: "{AchievementTitle}",
            description: "{AchievementDescription}",
            link: "{LinkToProject}",
          },
        ],
        environment: w.environment?.map((env) => ({
          title: env.title ?? "{EnvironmentTitle}",
          items: env.items?.map((i) => ({
            level: i.level ?? "{ExpertiseLevel}",
            item: i.item ?? "{TechnologyOrTool}",
          })) ?? [{ level: "{ExpertiseLevel}", item: "{TechnologyOrTool}" }],
        })) ?? [
          {
            title: "{EnvironmentTitle}",
            items: [{ level: "{ExpertiseLevel}", item: "{TechnologyOrTool}" }],
          },
        ],
        start: w.start ?? "2015-01",
        startYear: w.startYear ?? "2015",
        startMonth: w.startMonth ?? "01",
        endYear: w.endYear ?? "2018",
        endMonth: w.endMonth ?? "12",
        location: w.location ?? "{WorkLocation}",
        details: w.details?.map((d) => ({
          description: d.description ?? "{ExtraWorkDetail}",
          link: d.link ?? "{WorkLink}",
        })) ?? [{ description: "{ExtraWorkDetail}", link: "{WorkLink}" }],
      })) ?? [
        {
          title: "{CompanyName}",
          role: "{RoleTitle}",
          companyDescription: "{CompanyDescription}",
          workers: "{TeamSize}",
          scope: "{ProjectScope}",
          responsibilities: [
            { title: "{ResponsibilityTitle}", tasks: "{TaskDescription}" },
          ],
          achievements: [
            {
              title: "{AchievementTitle}",
              description: "{AchievementDescription}",
              link: "{LinkToProject}",
            },
          ],
          environment: [
            {
              title: "{EnvironmentTitle}",
              items: [
                { level: "{ExpertiseLevel}", item: "{TechnologyOrTool}" },
              ],
            },
          ],
          start: "2015-01",
          startYear: "2015",
          startMonth: "01",
          endYear: "2018",
          endMonth: "12",
          location: "{WorkLocation}",
          details: [{ description: "{ExtraWorkDetail}", link: "{WorkLink}" }],
        },
      ],

      projects: initialData.projects?.map((p) => ({
        title: p.title ?? "{ProjectTitle}",
        startYear: p.startYear ?? "2020",
        startMonth: p.startMonth ?? "01",
        endYear: p.endYear ?? "2020",
        endMonth: p.endMonth ?? "12",
        details: p.details ?? "{ProjectDetails}",
        links: {
          repository: p.links?.repository ?? "{RepoURL}",
          website: p.links?.website ?? "{WebsiteURL}",
        },
        users: p.users ?? 1000,
        technology: p.technology ?? "{ProjectTech}",
      })) ?? [
        {
          title: "{ProjectTitle}",
          startYear: "2020",
          startMonth: "01",
          endYear: "2020",
          endMonth: "12",
          details: "{ProjectDetails}",
          links: { repository: "{RepoURL}", website: "{WebsiteURL}" },
          users: 1000,
          technology: "{ProjectTech}",
        },
      ],

      skills: {
        media: {
          description:
            initialData.skills?.media?.description ?? "{DesignSkills}",
          technology: initialData.skills?.media?.technology ?? "{DesignTools}",
        },
        programming: {
          description:
            initialData.skills?.programming?.description ??
            "{ProgrammingSkills}",
          technology:
            initialData.skills?.programming?.technology ??
            "{ProgrammingLanguages}",
        },
        languages: {
          description:
            initialData.skills?.languages?.description ?? "{LanguagesSpoken}",
          technology:
            initialData.skills?.languages?.technology ?? "{LanguageLevels}",
        },
        hobbies: {
          description:
            initialData.skills?.hobbies?.description ?? "{HobbiesDescription}",
          technology:
            initialData.skills?.hobbies?.technology ?? "{HobbyTechOrTools}",
        },
        misc: {
          description: initialData.skills?.misc?.description ?? "{MiscSkills}",
          technology: initialData.skills?.misc?.technology ?? "{MiscTools}",
        },
      },

      expectations: {
        workplace:
          initialData.expectations?.workplace ?? "{PreferredWorkplace}",
        salary: initialData.expectations?.salary ?? "{ExpectedSalary}",
      },

      story: initialData.story ?? "{PersonalNarrativeOrCareerSummary}",
    };
  }
}
