import { ChangeEvent, FC, useRef } from "react";
import { $React } from "@legendapp/state/react-web";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Memo, useEffectOnce } from "@legendapp/state/react";
import { ResumeController } from "./resume-controller";

interface ImageUploadProps {
  onChange?: (dataUri: string) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/jpeg") {
      alert("Only JPG images are allowed");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange?.(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="imageUpload">Profile Image (JPG only)</Label>
      <input
        type="file"
        id="imageUpload"
        accept="image/jpeg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload Image
      </Button>
    </div>
  );
};

const Field = ({
  id,
  label,
  children,
  className = "",
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <Label htmlFor={id} className="text-xs text-muted-foreground">
      {label}
    </Label>
    <div className="mt-1">{children}</div>
  </div>
);

const inputClasses =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const textareaClasses =
  "min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
// ---- Array helpers ----
function pushItem<T>(arr$: any, item: T) {
  const arr = (arr$.get?.() ?? arr$?.peek?.() ?? []) as T[];
  arr$.set([...arr, item]);
}
function removeIndex(arr$: any, index: number) {
  const arr = (arr$.get?.() ?? arr$?.peek?.() ?? []) as any[];
  arr$.set(arr.filter((_, i) => i !== index));
}

// ---- Default item templates ----
const defaultEducation = () => ({
  title: "",
  location: "",
  startYear: undefined as number | undefined,
  startMonth: undefined as number | undefined,
  endYear: undefined as number | undefined,
  endMonth: undefined as number | undefined,
  details: [{ description: "", link: "" }],
});

const defaultWork = () => ({
  title: "",
  role: "",
  companyDescription: "",
  workers: "",
  scope: "",
  start: "",
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
  location: "",
  responsibilities: [{ title: "", tasks: "" }],
  achievements: [{ title: "", description: "", link: "" }],
  environment: [{ title: "", items: [{ level: "", item: "" }] }],
  details: [{ description: "", link: "" }],
});

const defaultProject = () => ({
  title: "",
  technology: "",
  startYear: undefined as number | undefined,
  startMonth: undefined as number | undefined,
  endYear: undefined as number | undefined,
  endMonth: undefined as number | undefined,
  users: undefined as number | undefined,
  details: "",
  links: { repository: "", website: "" },
});

const ResumeForm: FC = () => {
  useEffectOnce(() => {
    ResumeController.init();
  }, []);

  const data$ = ResumeController.state.data;
  const buffer$ = ResumeController.state.dataBuffer;

  const onSave = () => ResumeController.applyBuffer();
  const onReset = () => buffer$.set(data$.peek());

  return (
    <form className="space-y-8">
      {/* Header actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Resume Form</h2>
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* Identity */}
        <AccordionItem value="identity">
          <AccordionTrigger>Identity</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Photo & Name</CardTitle>
                <CardDescription>Basic personal information</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <ImageUpload
                  onChange={(b64jpg) => buffer$.imageUri.set(b64jpg)}
                />

                <Field id="firstName" label="First name">
                  <$React.input
                    id="firstName"
                    $value={buffer$.name.firstName}
                    className={inputClasses}
                    placeholder="{FirstName}"
                  />
                </Field>
                <Field id="lastName" label="Last name">
                  <$React.input
                    id="lastName"
                    $value={buffer$.name.lastName}
                    className={inputClasses}
                    placeholder="{LastName}"
                  />
                </Field>
                <Field id="furigana" label="Furigana">
                  <$React.input
                    id="furigana"
                    $value={buffer$.name.furigana}
                    className={inputClasses}
                    placeholder="{Furigana}"
                  />
                </Field>

                <Separator className="md:col-span-3" />

                <Field id="birthdayYear" label="Birth year">
                  <$React.input
                    id="birthdayYear"
                    type="number"
                    className={inputClasses}
                    $value={buffer$.birthday.year}
                    placeholder="1990"
                  />
                </Field>
                <Field id="birthdayMonth" label="Birth month">
                  <$React.input
                    id="birthdayMonth"
                    type="number"
                    className={inputClasses}
                    $value={buffer$.birthday.month}
                    placeholder="1"
                  />
                </Field>
                <Field id="birthdayDay" label="Birth day">
                  <$React.input
                    id="birthdayDay"
                    type="number"
                    className={inputClasses}
                    $value={buffer$.birthday.day}
                    placeholder="1"
                  />
                </Field>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Profile */}
        <AccordionItem value="profile">
          <AccordionTrigger>Profile</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Demographics & headline</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <Field id="nationality" label="Nationality">
                  <$React.input
                    id="nationality"
                    $value={buffer$.nationality}
                    className={inputClasses}
                    placeholder="{Nationality}"
                  />
                </Field>

                <Field id="gender" label="Gender">
                  <$React.input
                    id="gender"
                    $value={buffer$.gender}
                    className={inputClasses}
                    placeholder="{Gender}"
                  />
                </Field>

                <Field id="maritalStatus" label="Marital status">
                  <$React.input
                    id="maritalStatus"
                    $value={buffer$.maritalStatus}
                    className={inputClasses}
                    placeholder="{MaritalStatus}"
                  />
                </Field>

                <Field id="dependents" label="Dependents">
                  <$React.input
                    id="dependents"
                    type="number"
                    className={inputClasses}
                    $value={buffer$.dependents}
                    placeholder="0"
                  />
                </Field>

                {/* Reactive Switch */}
                <div className="flex items-end gap-3">
                  <Memo>
                    {() => (
                      <Switch
                        id="alimonyPayments"
                        checked={!!buffer$.alimonyPayments.get()}
                        onCheckedChange={(v) =>
                          buffer$.alimonyPayments.set(!!v)
                        }
                      />
                    )}
                  </Memo>
                  <Label htmlFor="alimonyPayments">Alimony payments</Label>
                </div>

                <Field
                  id="workTitle"
                  label="Work title"
                  className="md:col-span-3"
                >
                  <$React.input
                    id="workTitle"
                    $value={buffer$.workTitle}
                    className={inputClasses}
                    placeholder="{Work Title}"
                  />
                </Field>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Contact */}
        <AccordionItem value="contact">
          <AccordionTrigger>Contact</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>How people can reach you</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <Field id="email" label="Email">
                  <$React.input
                    id="email"
                    type="email"
                    $value={buffer$.contact.email}
                    className={inputClasses}
                    placeholder="{Email}"
                  />
                </Field>
                <Field id="phone" label="Phone">
                  <$React.input
                    id="phone"
                    $value={buffer$.contact.phone}
                    className={inputClasses}
                    placeholder="{PhoneNumber}"
                  />
                </Field>

                <Field id="street" label="Street" className="md:col-span-2">
                  <$React.input
                    id="street"
                    $value={buffer$.contact.address.street}
                    className={inputClasses}
                    placeholder="{StreetAddress}"
                  />
                </Field>
                <Field id="zip" label="ZIP">
                  <$React.input
                    id="zip"
                    $value={buffer$.contact.address.zip}
                    className={inputClasses}
                    placeholder="{PostalCode}"
                  />
                </Field>
                <Field id="city" label="City">
                  <$React.input
                    id="city"
                    $value={buffer$.contact.address.city}
                    className={inputClasses}
                    placeholder="{City}"
                  />
                </Field>
                <Field id="country" label="Country">
                  <$React.input
                    id="country"
                    $value={buffer$.contact.address.country}
                    className={inputClasses}
                    placeholder="{Country}"
                  />
                </Field>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger>Skills</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Group your abilities</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 text-sm font-medium">
                    Relevant Software
                  </div>
                  <Field id="media-desc" label="Description">
                    <$React.input
                      id="media-desc"
                      $value={buffer$.skills.media.description}
                      className={inputClasses}
                      placeholder="{DesignSkills}"
                    />
                  </Field>
                  <Field id="media-tech" label="Technology / Tools">
                    <$React.input
                      id="media-tech"
                      $value={buffer$.skills.media.technology}
                      className={inputClasses}
                      placeholder="{DesignTools}"
                    />
                  </Field>
                  <Separator className="md:col-span-2" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 text-sm font-medium">
                    Relevant Skills
                  </div>
                  <Field id="prog-desc" label="Description">
                    <$React.input
                      id="prog-desc"
                      $value={buffer$.skills.programming.description}
                      className={inputClasses}
                      placeholder="{ProgrammingSkills}"
                    />
                  </Field>
                  <Field id="prog-tech" label="Technology / Tools">
                    <$React.input
                      id="prog-tech"
                      $value={buffer$.skills.programming.technology}
                      className={inputClasses}
                      placeholder="{ProgrammingLanguages}"
                    />
                  </Field>
                  <Separator className="md:col-span-2" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 text-sm font-medium">
                    Languages
                  </div>
                  <Field id="lang-desc" label="Description">
                    <$React.input
                      id="lang-desc"
                      $value={buffer$.skills.languages.description}
                      className={inputClasses}
                      placeholder="{LanguagesSpoken}"
                    />
                  </Field>
                  <Field id="lang-tech" label="Technology / Tools">
                    <$React.input
                      id="lang-tech"
                      $value={buffer$.skills.languages.technology}
                      className={inputClasses}
                      placeholder="{LanguageLevels}"
                    />
                  </Field>
                  <Separator className="md:col-span-2" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 text-sm font-medium">
                    Hobbies
                  </div>
                  <Field id="hobby-desc" label="Description">
                    <$React.input
                      id="hobby-desc"
                      $value={buffer$.skills.hobbies.description}
                      className={inputClasses}
                      placeholder="{HobbiesDescription}"
                    />
                  </Field>
                  <Field id="hobby-tech" label="Technology / Tools">
                    <$React.input
                      id="hobby-tech"
                      $value={buffer$.skills.hobbies.technology}
                      className={inputClasses}
                      placeholder="{HobbyTechOrTools}"
                    />
                  </Field>
                  <Separator className="md:col-span-2" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 text-sm font-medium">Misc</div>
                  <Field id="misc-desc" label="Description">
                    <$React.input
                      id="misc-desc"
                      $value={buffer$.skills.misc.description}
                      className={inputClasses}
                      placeholder="{MiscSkills}"
                    />
                  </Field>
                  <Field id="misc-tech" label="Technology / Tools">
                    <$React.input
                      id="misc-tech"
                      $value={buffer$.skills.misc.technology}
                      className={inputClasses}
                      placeholder="{MiscTools}"
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Expectations */}
        <AccordionItem value="expectations">
          <AccordionTrigger>Expectations</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Expectations</CardTitle>
                <CardDescription>What you’re looking for</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Field id="workplace" label="Preferred workplace">
                  <$React.input
                    id="workplace"
                    $value={buffer$.expectations.workplace}
                    className={inputClasses}
                    placeholder="{PreferredWorkplace}"
                  />
                </Field>
                <Field id="salary" label="Expected salary">
                  <$React.input
                    id="salary"
                    $value={buffer$.expectations.salary}
                    className={inputClasses}
                    placeholder="{ExpectedSalary}"
                  />
                </Field>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Story */}
        <AccordionItem value="story">
          <AccordionTrigger>Story</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Summary / Story</CardTitle>
                <CardDescription>Your personal narrative</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <$React.textarea
                  id="story"
                  $value={buffer$.story}
                  className={textareaClasses}
                  placeholder="{PersonalNarrativeOrCareerSummary}"
                />
                <Field id="tagLine-title" label="Tag Line">
                  <$React.input
                    id="tagLine"
                    $value={buffer$.tagLine}
                    className={inputClasses}
                    placeholder="{TagLine}"
                  />
                </Field>
                <Field id="subTagLine-title" label="Sub Tag Line">
                  <$React.input
                    id="subTagLine"
                    $value={buffer$.subTagLine}
                    className={inputClasses}
                    placeholder="{SubTagLine}"
                  />
                </Field>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Education (multi-item) */}
        <AccordionItem value="education">
          <AccordionTrigger>Education</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Add schools and coursework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Memo>
                  {() => {
                    return (buffer$.education.get?.() ?? []).map(
                      (_, i: number) => (
                        <div
                          key={i}
                          className="grid gap-4 md:grid-cols-6 p-4 border rounded-xl"
                        >
                          <div className="md:col-span-6 flex items-center justify-between">
                            <Label className="text-sm">Entry #{i + 1}</Label>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeIndex(buffer$.education, i)}
                            >
                              Remove
                            </Button>
                          </div>

                          <Field
                            id={`edu-title-${i}`}
                            label="Title"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`edu-title-${i}`}
                              $value={buffer$.education[i].title}
                              className={inputClasses}
                              placeholder="{EducationTitle}"
                            />
                          </Field>
                          <Field
                            id={`edu-location-${i}`}
                            label="Location"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`edu-location-${i}`}
                              $value={buffer$.education[i].location}
                              className={inputClasses}
                              placeholder="{EducationLocation}"
                            />
                          </Field>

                          <Field id={`edu-start-year-${i}`} label="Start year">
                            <$React.input
                              id={`edu-start-year-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.education[i].startYear}
                              placeholder="2010"
                            />
                          </Field>
                          <Field
                            id={`edu-start-month-${i}`}
                            label="Start month"
                          >
                            <$React.input
                              id={`edu-start-month-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.education[i].startMonth}
                              placeholder="4"
                            />
                          </Field>
                          <Field id={`edu-end-year-${i}`} label="End year">
                            <$React.input
                              id={`edu-end-year-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.education[i].endYear}
                              placeholder="2014"
                            />
                          </Field>
                          <Field id={`edu-end-month-${i}`} label="End month">
                            <$React.input
                              id={`edu-end-month-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.education[i].endMonth}
                              placeholder="3"
                            />
                          </Field>

                          <div className="md:col-span-6 grid gap-3">
                            <Label className="text-xs text-muted-foreground">
                              Details
                            </Label>
                            <div className="grid gap-3 md:grid-cols-2">
                              <$React.input
                                id={`edu-detail-desc-${i}`}
                                $value={
                                  buffer$.education[i].details[0].description
                                }
                                className={inputClasses}
                                placeholder="{CourseworkOrFocus}"
                              />
                              <$React.input
                                id={`edu-detail-link-${i}`}
                                $value={buffer$.education[i].details[0].link}
                                className={inputClasses}
                                placeholder="{ExternalLink}"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    );
                  }}
                </Memo>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    pushItem(buffer$.education, defaultEducation())
                  }
                >
                  + Add Education
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Work Experience (multi-item) */}
        <AccordionItem value="work">
          <AccordionTrigger>Work Experience</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Roles, impact, and environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Memo>
                  {() => {
                    return (buffer$.workExperience.get?.() ?? []).map(
                      (_, i: number) => (
                        <div
                          key={i}
                          className="grid gap-4 md:grid-cols-6 p-4 border rounded-xl"
                        >
                          <div className="md:col-span-6 flex items-center justify-between">
                            <Label className="text-sm">Entry #{i + 1}</Label>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                removeIndex(buffer$.workExperience, i)
                              }
                            >
                              Remove
                            </Button>
                          </div>

                          <Field
                            id={`work-title-${i}`}
                            label="Company"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`work-title-${i}`}
                              $value={buffer$.workExperience[i].title}
                              className={inputClasses}
                              placeholder="{CompanyName}"
                            />
                          </Field>
                          <Field
                            id={`work-role-${i}`}
                            label="Role"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`work-role-${i}`}
                              $value={buffer$.workExperience[i].role}
                              className={inputClasses}
                              placeholder="{RoleTitle}"
                            />
                          </Field>

                          <Field
                            id={`work-company-desc-${i}`}
                            label="Company description"
                            className="md:col-span-6"
                          >
                            <$React.textarea
                              id={`work-company-desc-${i}`}
                              $value={
                                buffer$.workExperience[i].companyDescription
                              }
                              className={textareaClasses}
                              placeholder="{CompanyDescription}"
                            />
                          </Field>

                          <Field id={`work-workers-${i}`} label="Team size">
                            <$React.input
                              id={`work-workers-${i}`}
                              $value={buffer$.workExperience[i].workers}
                              className={inputClasses}
                              placeholder="{TeamSize}"
                            />
                          </Field>
                          <Field
                            id={`work-scope-${i}`}
                            label="Scope"
                            className="md:col-span-5"
                          >
                            <$React.input
                              id={`work-scope-${i}`}
                              $value={buffer$.workExperience[i].scope}
                              className={inputClasses}
                              placeholder="{ProjectScope}"
                            />
                          </Field>

                          <Field id={`work-start-${i}`} label="Start (YYYY-MM)">
                            <$React.input
                              id={`work-start-${i}`}
                              $value={buffer$.workExperience[i].start}
                              className={inputClasses}
                              placeholder="2015-01"
                            />
                          </Field>
                          <Field id={`work-start-year-${i}`} label="Start year">
                            <$React.input
                              id={`work-start-year-${i}`}
                              $value={buffer$.workExperience[i].startYear}
                              className={inputClasses}
                              placeholder="2015"
                            />
                          </Field>
                          <Field
                            id={`work-start-month-${i}`}
                            label="Start month"
                          >
                            <$React.input
                              id={`work-start-month-${i}`}
                              $value={buffer$.workExperience[i].startMonth}
                              className={inputClasses}
                              placeholder="01"
                            />
                          </Field>
                          <Field id={`work-end-year-${i}`} label="End year">
                            <$React.input
                              id={`work-end-year-${i}`}
                              $value={buffer$.workExperience[i].endYear}
                              className={inputClasses}
                              placeholder="2018"
                            />
                          </Field>
                          <Field id={`work-end-month-${i}`} label="End month">
                            <$React.input
                              id={`work-end-month-${i}`}
                              $value={buffer$.workExperience[i].endMonth}
                              className={inputClasses}
                              placeholder="12"
                            />
                          </Field>
                          <Field
                            id={`work-location-${i}`}
                            label="Location"
                            className="md:col-span-2"
                          >
                            <$React.input
                              id={`work-location-${i}`}
                              $value={buffer$.workExperience[i].location}
                              className={inputClasses}
                              placeholder="{WorkLocation}"
                            />
                          </Field>

                          <Separator className="md:col-span-6" />

                          <div className="md:col-span-6 grid gap-3">
                            <Label className="text-xs text-muted-foreground">
                              Responsibilities
                            </Label>
                            <div className="grid gap-3 md:grid-cols-2">
                              <$React.input
                                id={`work-resp-title-${i}`}
                                $value={
                                  buffer$.workExperience[i].responsibilities[0]
                                    .title
                                }
                                className={inputClasses}
                                placeholder="{ResponsibilityTitle}"
                              />
                              <$React.input
                                id={`work-resp-tasks-${i}`}
                                $value={
                                  buffer$.workExperience[i].responsibilities[0]
                                    .tasks
                                }
                                className={inputClasses}
                                placeholder="{TaskDescription}"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-6 grid gap-3">
                            <Label className="text-xs text-muted-foreground">
                              Achievements
                            </Label>
                            <div className="grid gap-3 md:grid-cols-3">
                              <$React.input
                                id={`work-ach-title-${i}`}
                                $value={
                                  buffer$.workExperience[i].achievements[0]
                                    .title
                                }
                                className={inputClasses}
                                placeholder="{AchievementTitle}"
                              />
                              <$React.input
                                id={`work-ach-desc-${i}`}
                                $value={
                                  buffer$.workExperience[i].achievements[0]
                                    .description
                                }
                                className={inputClasses}
                                placeholder="{AchievementDescription}"
                              />
                              <$React.input
                                id={`work-ach-link-${i}`}
                                $value={
                                  buffer$.workExperience[i].achievements[0].link
                                }
                                className={inputClasses}
                                placeholder="{LinkToProject}"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-6 grid gap-3">
                            <Label className="text-xs text-muted-foreground">
                              Environment
                            </Label>
                            <div className="grid gap-3 md:grid-cols-3">
                              <$React.input
                                id={`work-env-title-${i}`}
                                $value={
                                  buffer$.workExperience[i].environment[0].title
                                }
                                className={inputClasses}
                                placeholder="{EnvironmentTitle}"
                              />
                              <$React.input
                                id={`work-env-level-${i}`}
                                $value={
                                  buffer$.workExperience[i].environment[0]
                                    .items[0].level
                                }
                                className={inputClasses}
                                placeholder="{ExpertiseLevel}"
                              />
                              <$React.input
                                id={`work-env-item-${i}`}
                                $value={
                                  buffer$.workExperience[i].environment[0]
                                    .items[0].item
                                }
                                className={inputClasses}
                                placeholder="{TechnologyOrTool}"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-6 grid gap-3">
                            <Label className="text-xs text-muted-foreground">
                              Details
                            </Label>
                            <div className="grid gap-3 md:grid-cols-1">
                              <$React.textarea
                                id={`work-detail-desc-${i}`}
                                $value={
                                  buffer$.workExperience[i].details[0]
                                    .description
                                }
                                className={textareaClasses}
                                placeholder="{WorkDetail}"
                              />
                              <$React.input
                                id={`work-detail-link-${i}`}
                                $value={
                                  buffer$.workExperience[i].details[0].link
                                }
                                className={inputClasses}
                                placeholder="{WorkLink}"
                              />
                            </div>
                          </div>
                        </div>
                      ),
                    );
                  }}
                </Memo>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    pushItem(buffer$.workExperience, defaultWork())
                  }
                >
                  + Add Work Experience
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Projects (multi-item) */}
        <AccordionItem value="projects">
          <AccordionTrigger>Projects</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Personal or professional projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Memo>
                  {() => {
                    return (buffer$.projects.get?.() ?? []).map(
                      (_, i: number) => (
                        <div
                          key={i}
                          className="grid gap-4 md:grid-cols-6 p-4 border rounded-xl"
                        >
                          <div className="md:col-span-6 flex items-center justify-between">
                            <Label className="text-sm">Entry #{i + 1}</Label>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeIndex(buffer$.projects, i)}
                            >
                              Remove
                            </Button>
                          </div>

                          <Field
                            id={`proj-title-${i}`}
                            label="Title"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`proj-title-${i}`}
                              $value={buffer$.projects[i].title}
                              className={inputClasses}
                              placeholder="{ProjectTitle}"
                            />
                          </Field>
                          <Field
                            id={`proj-tech-${i}`}
                            label="Technology"
                            className="md:col-span-3"
                          >
                            <$React.input
                              id={`proj-tech-${i}`}
                              $value={buffer$.projects[i].technology}
                              className={inputClasses}
                              placeholder="{ProjectTech}"
                            />
                          </Field>

                          <Field id={`proj-start-year-${i}`} label="Start year">
                            <$React.input
                              id={`proj-start-year-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.projects[i].startYear}
                              placeholder="2020"
                            />
                          </Field>
                          <Field
                            id={`proj-start-month-${i}`}
                            label="Start month"
                          >
                            <$React.input
                              id={`proj-start-month-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.projects[i].startMonth}
                              placeholder="01"
                            />
                          </Field>
                          <Field id={`proj-end-year-${i}`} label="End year">
                            <$React.input
                              id={`proj-end-year-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.projects[i].endYear}
                              placeholder="2020"
                            />
                          </Field>
                          <Field id={`proj-end-month-${i}`} label="End month">
                            <$React.input
                              id={`proj-end-month-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.projects[i].endMonth}
                              placeholder="12"
                            />
                          </Field>

                          <Field id={`proj-users-${i}`} label="Users">
                            <$React.input
                              id={`proj-users-${i}`}
                              type="number"
                              className={inputClasses}
                              $value={buffer$.projects[i].users}
                              placeholder="1000"
                            />
                          </Field>

                          <Field
                            id={`proj-details-${i}`}
                            label="Details"
                            className="md:col-span-5"
                          >
                            <$React.textarea
                              id={`proj-details-${i}`}
                              $value={buffer$.projects[i].details}
                              className={textareaClasses}
                              placeholder="{ProjectDetails}"
                            />
                          </Field>

                          <Field id={`proj-repo-${i}`} label="Repository">
                            <$React.input
                              id={`proj-repo-${i}`}
                              $value={buffer$.projects[i].links.repository}
                              className={inputClasses}
                              placeholder="{RepoURL}"
                            />
                          </Field>
                          <Field id={`proj-site-${i}`} label="Website">
                            <$React.input
                              id={`proj-site-${i}`}
                              $value={buffer$.projects[i].links.website}
                              className={inputClasses}
                              placeholder="{WebsiteURL}"
                            />
                          </Field>
                        </div>
                      ),
                    );
                  }}
                </Memo>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => pushItem(buffer$.projects, defaultProject())}
                >
                  + Add Project
                </Button>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
};

export default ResumeForm;
