import { CVDataType } from "./CVData";
import { Pdf } from "./Pdf";
import { PdfSection } from "./Section";

export class PdfTemplate {
  public pdf: Pdf;
  private lang: "en";
  static colors = {
    grayNight: "#21222c",
    grayDark: "#40404a",
    gray: "#61626c",
    orange: "#bd7955",
    grayDay: "#dfe1e5",
  };

  static fontSizes = {
    tagLine: 26,
    title: 22,
    subtitle: 14,
    body: 12,
  };

  static labels = {
    aboutMe: {
      en: "About me",
    },
    dependents: {
      en: "Dependents",
    },
    alimony: {
      en: "Alimony",
    },
    maritalStatus: {
      en: "Marital status",
    },
    nationality: {
      en: "Nationality",
    },
    gender: {
      en: "Gender",
    },
    noAlimonyPayments: {
      en: "No alimony payments",
    },
    payingAlimony: {
      en: "paying alimony",
    },
    noDependents: {
      en: "No dependents",
    },
    oneDependent: {
      en: "1 dependent",
    },
    nDependents: {
      en: "dependents",
    },
    portfolio: {
      en: "Portfolio",
    },
    computerSkills: {
      en: "Relevant Skills",
    },
    otherSkills: {
      en: "Other Skills",
    },
    hobbies: {
      en: "Hobbies",
    },
    languages: {
      en: "Languages",
    },
  };

  constructor(lang: PdfTemplate["lang"] = "en") {
    this.pdf = new Pdf();
    this.lang = lang;
  }

  private buildTopBar(data: CVDataType): PdfSection {
    this.pdf.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      y: 0.0,
      width: 1,
      height: 0.02,
    });

    const headerSection = this.pdf.section({
      bgColor: PdfTemplate.colors.gray,
      x: 0.0,
      y: 0.02,
      width: 1,
      height: 0.18,
    });

    const nameSection = headerSection.section({
      width: 0.3,
      height: 0.5,
      y: 0.2,
      x: 0.033,
    });

    nameSection.text(`${data.name.firstName}\n${data.name.lastName}`, {
      font: "Helvetica-Bold",
      fontSize: 24,
      color: PdfTemplate.colors.grayDay,
      align: "center",
    });

    const titleSection = headerSection.section({
      width: 0.3,
      height: 0.2,
      y: 0.6,
      x: 0.033,
    });

    titleSection.text(`${data.workTitle}`, {
      font: "Helvetica",
      fontSize: 16,
      color: PdfTemplate.colors.grayDay,
      align: "center",
    });

    const contactSection = headerSection.section({
      width: 0.3,
      height: 0.6,
      x: 0.666,
      y: 0.2,
    });

    const imageSection = headerSection.section({
      width: 0.2,
      height: 0.6,
      x: 0.4,
      y: 0.2,
    });

    imageSection.image(data.imageUri);

    contactSection.text(
      `${data.contact.address.street}, ` +
        `${data.contact.address.city}, ` +
        `${data.contact.address.zip}, ` +
        `${data.contact.address.country}\n` +
        `${data.contact.email}\n` +
        `${data.contact.phone}`,
      {
        font: "Helvetica",
        fontSize: PdfTemplate.fontSizes.subtitle,
        color: PdfTemplate.colors.grayDay,
        align: "right",
      },
    );

    this.pdf.section({
      bgColor: PdfTemplate.colors.orange,
      x: 0.0,
      y: 0.2,
      width: 0.5,
      height: 0.01,
    });

    this.pdf.section({
      bgColor: PdfTemplate.colors.grayNight,
      x: 0.5,
      y: 0.2,
      width: 0.5,
      height: 0.01,
    });

    const remainingSection = this.pdf.section({
      x: 0.0,
      y: 0.21,
      width: 1,
      height: 0.79,
    });

    return remainingSection;
  }

  private buildAboutMe(data: CVDataType, container: PdfSection) {
    const aboutMeBodySection = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      y: 0.0,
      width: 1,
      height: 1,
    });

    const titleSection = aboutMeBodySection.section({
      x: 0.033,
      y: 0.099,
      width: 0.933,
      height: 0.15,
    });

    const subtitleSection = aboutMeBodySection.section({
      x: 0.033,
      y: 0.27,
      width: 0.933,
      height: 0.15,
    });

    const bodySection = aboutMeBodySection.section({
      x: 0.033,
      y: !!data.subTagLine ? 0.466 : 0.313,
      width: 0.933,
      height: !!data.subTagLine ? 0.5 : 0.6,
    });

    titleSection.text(data.tagLine, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.tagLine,
      align: "center",
    });

    subtitleSection.text(data.subTagLine, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.tagLine,
      align: "center",
    });

    bodySection.text(data.story, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });
  }

  private buildArrowLeft(container: PdfSection, color?: string) {
    if (!color) {
      return;
    }
    const containerHeight = container.internal.maxY - container.internal.minY;
    const arrowX = 4;
    const arrowSize = 22;
    const sy = container.internal.minY + containerHeight / 2 - arrowSize / 2;
    const ey = container.internal.minY + containerHeight / 2 + arrowSize / 2;
    const my = container.internal.minY + containerHeight / 2;
    const sx = container.internal.minX + arrowX;
    const ex = container.internal.minX + arrowX;
    const mx = container.internal.minX + arrowX + arrowSize / 2;
    container.internal.doc
      .save()
      .moveTo(sx, sy)
      .lineTo(ex, ey)
      .lineTo(mx, my)
      .lineTo(sx, sy)
      .fill(color);
  }

  private build3Col(
    container: PdfSection,
    {
      withArrow,
      paddingRight,
      colorLeft,
      colorMiddle,
      colorRight,
    }: {
      withArrow?: boolean;
      paddingRight?: number;
      colorLeft?: string;
      colorMiddle?: string;
      colorRight?: string;
    } = {},
  ) {
    paddingRight = paddingRight ?? 0;
    const leftSection = container.section({
      bgColor: colorLeft,
      x: 0.0,
      y: 0.0,
      width: 0.333 - paddingRight,
      height: 1,
    });

    const middleSection = container.section({
      bgColor: colorLeft,
      x: 0.333,
      y: 0.0,
      width: 0.333 - paddingRight,
      height: 1,
    });

    const rightSection = container.section({
      bgColor: colorRight,
      x: 0.666,
      y: 0.0,
      width: 0.333 - paddingRight,
      height: 1,
    });

    if (withArrow) {
      this.buildArrowLeft(middleSection, colorLeft);
      this.buildArrowLeft(rightSection, colorMiddle);
    }
    return {
      left: leftSection,
      middle: middleSection,
      right: rightSection,
    };
  }

  private build2Col(
    container: PdfSection,
    {
      paddingRight,
      withArrow,
      colorLeft,
      colorRight,
    }: {
      paddingRight?: number;
      withArrow?: boolean;
      colorLeft?: string;
      colorRight?: string;
    } = {},
  ) {
    paddingRight = paddingRight ?? 0;
    const leftSection = container.section({
      bgColor: colorLeft,
      x: 0.0,
      y: 0.0,
      width: 0.5 - paddingRight,
      height: 1,
    });

    const rightSection = container.section({
      bgColor: colorRight,
      x: 0.5,
      y: 0.0,
      width: 0.5 - paddingRight,
      height: 1,
    });

    if (withArrow) {
      this.buildArrowLeft(rightSection, colorLeft);
    }
    return {
      left: leftSection,
      right: rightSection,
    };
  }

  private buildEducation(data: CVDataType, container: PdfSection) {
    const mainSection = container.section({
      x: 0.066,
      y: 0.166,
      width: 0.901,
      height: 0.812,
    });

    const educationString = data.education
      .map((edu) => {
        return `${edu.startMonth}/${edu.startYear} - ${edu.title} - ${edu.location}`;
      })
      .join("\n");

    mainSection.text(educationString, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });
  }

  private buildPersonal(data: CVDataType, container: PdfSection) {
    const mainSection = container.section({
      x: 0.066,
      y: 0.166,
      width: 0.866,
      height: 0.766,
    });

    const dependentsString =
      data.dependents == 0
        ? PdfTemplate.labels.noDependents[this.lang]
        : data.dependents == 1
          ? PdfTemplate.labels.oneDependent[this.lang]
          : `${data.dependents} ${PdfTemplate.labels.nDependents[this.lang]}`;

    const alimonyString = data.alimonyPayments
      ? PdfTemplate.labels.payingAlimony[this.lang]
      : PdfTemplate.labels.noAlimonyPayments[this.lang];
    const personalShortString =
      `${data.gender} - ${data.nationality} - ${data.maritalStatus}\n` +
      `${dependentsString}\n${alimonyString}`;

    mainSection.text(personalShortString, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
      align: "center",
    });
  }

  private buildPreviousWork(data: CVDataType, container: PdfSection) {
    const headerSection = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0,
      y: 0,
      width: 1,
      height: 0.1,
    });

    const titleSection = headerSection.section({
      x: 0.033,
      width: 0.933,
      y: 0.5,
      height: 0.5,
    });

    const titleRow1Container = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      width: 1,
      y: 0.1,
      height: 0.1,
    });

    const subtitleRow1Container = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      width: 1,
      y: 0.2,
      height: 0.07,
    });

    const descriptionRow1Container = container.section({
      bgColor: PdfTemplate.colors.grayNight,
      x: 0.0,
      width: 1,
      y: 0.27,
      height: 0.23,
    });

    const titleRow2Container = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      width: 1,
      y: 0.5,
      height: 0.1,
    });

    const subtitleRow2Container = container.section({
      bgColor: PdfTemplate.colors.grayDark,
      x: 0.0,
      width: 1,
      y: 0.6,
      height: 0.07,
    });

    const descriptionRow2Container = container.section({
      bgColor: PdfTemplate.colors.grayNight,
      x: 0.0,
      width: 1,
      y: 0.67,
      height: 0.23,
    });

    const titleRow1 = titleRow1Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.6,
      height: 0.4,
    });

    const subtitleRow1 = subtitleRow1Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.2,
      height: 0.6,
    });

    const descriptionRow1 = descriptionRow1Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.166,
      height: 0.78,
    });

    const titleRow2 = titleRow2Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.6,
      height: 0.4,
    });

    const subtitleRow2 = subtitleRow2Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.2,
      height: 0.6,
    });

    const descriptionRow2 = descriptionRow2Container.section({
      x: 0.033,
      width: 0.933,
      y: 0.166,
      height: 0.78,
    });

    const {
      left: titleRow1Col1,
      middle: titleRow1Col2,
      right: titleRow1Col3,
    } = this.build3Col(titleRow1, {
      paddingRight: 0.05,
    });

    const {
      left: subtitleRow1Col1,
      middle: subtitleRow1Col2,
      right: subtitleRow1Col3,
    } = this.build3Col(subtitleRow1, {
      paddingRight: 0.05,
    });

    const {
      left: descriptionRow1Col1,
      middle: descriptionRow1Col2,
      right: descriptionRow1Col3,
    } = this.build3Col(descriptionRow1, {
      paddingRight: 0.05,
    });

    const {
      left: titleRow2Col1,
      middle: titleRow2Col2,
      right: titleRow2Col3,
    } = this.build3Col(titleRow2, {
      paddingRight: 0.05,
    });

    const {
      left: subtitleRow2Col1,
      middle: subtitleRow2Col2,
      right: subtitleRow2Col3,
    } = this.build3Col(subtitleRow2, {
      paddingRight: 0.05,
    });

    const {
      left: descriptionRow2Col1,
      middle: descriptionRow2Col2,
      right: descriptionRow2Col3,
    } = this.build3Col(descriptionRow2, {
      paddingRight: 0.05,
    });

    const titleCols = [
      titleRow1Col1,
      titleRow2Col1,
      titleRow1Col2,
      titleRow2Col2,
      titleRow1Col3,
      titleRow2Col3,
    ];

    const subtitleCols = [
      subtitleRow1Col1,
      subtitleRow2Col1,
      subtitleRow1Col2,
      subtitleRow2Col2,
      subtitleRow1Col3,
      subtitleRow2Col3,
    ];

    const descriptionCols = [
      descriptionRow1Col1,
      descriptionRow2Col1,
      descriptionRow1Col2,
      descriptionRow2Col2,
      descriptionRow1Col3,
      descriptionRow2Col3,
    ];

    const portfolioSlots = titleCols.map((tc, i) => {
      return {
        titleSlot: tc,
        subtitleSlot: subtitleCols[i],
        descriptionSlop: descriptionCols[i],
      };
    });

    const titleString = PdfTemplate.labels.portfolio[this.lang];
    titleSection.text(titleString, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.title,
      align: "left",
    });

    const primaryTitleStrings = data.workExperience.map((w) => w.title);
    const primarySubtitleStrings = data.workExperience.map((w) => w.role);
    const primaryDescriptionStrings = data.workExperience.map((w) => w.details);
    const secondaryTitleStrings = data.projects.map((p) => p.title);
    const secondarySubtitleStrings = data.projects.map((p) => p.technology);
    const secondaryDescriptionStrings = data.projects.map((p) => p.details);
    const tertiaryTitleStrings = Object.entries(data.skills).map((s) => s[0]);
    const tertiarySubtitleStrings = Object.entries(data.skills).map(
      (s) => s[1].technology,
    );
    const tertiaryDescriptionStrings = Object.entries(data.skills).map(
      (s) => s[1].description,
    );

    const portfolioStrings = {
      titles: [
        ...primaryTitleStrings,
        ...secondaryTitleStrings,
        ...tertiaryTitleStrings,
      ],
      subtitles: [
        ...primarySubtitleStrings,
        ...secondarySubtitleStrings,
        ...tertiarySubtitleStrings,
      ],
      descriptions: [
        ...primaryDescriptionStrings,
        ...secondaryDescriptionStrings,
        ...tertiaryDescriptionStrings,
      ],
    };

    const portfolio = portfolioStrings.titles.map((t, i) => {
      return {
        title: t,
        subtitle: portfolioStrings.subtitles[i],
        description: portfolioStrings.descriptions[i],
      };
    });

    for (let i = 0; i < portfolioSlots.length; i++) {
      const slot = portfolioSlots[i];
      const value = portfolio[i];
      if (value) {
        slot.titleSlot.text(value.title, {
          color: PdfTemplate.colors.grayDay,
          font: "Helvetica",
          fontSize: PdfTemplate.fontSizes.body,
          align: "left",
        });
        slot.subtitleSlot.text(value.subtitle, {
          color: PdfTemplate.colors.orange,
          font: "Helvetica",
          fontSize: PdfTemplate.fontSizes.body,
          align: "left",
        });
        slot.descriptionSlop.text(
          typeof value.description === "object"
            ? value.description[0].description
            : value.description,
          {
            color: PdfTemplate.colors.grayDay,
            font: "Helvetica",
            fontSize: PdfTemplate.fontSizes.body,
            align: "left",
          },
        );
      }
    }
  }

  private buildSkills(data: CVDataType, container: PdfSection) {
    const titleSection = container.section({
      x: 0.0,
      y: 0.0,
      width: 1,
      height: 0.33,
    });
    const bodySection = container.section({
      x: 0.0,
      y: 0.33,
      width: 1,
      height: 0.67,
    });
    const { left: computerSkillsTitleSection, right: otherSkillsTitleSection } =
      this.build2Col(titleSection, {
        colorLeft: PdfTemplate.colors.grayDark,
        colorRight: PdfTemplate.colors.grayDark,
      });
    const { left: computerSkillsSection, right: otherSkillsSection } =
      this.build2Col(bodySection, {
        colorLeft: PdfTemplate.colors.orange,
        colorRight: PdfTemplate.colors.grayNight,
        withArrow: true,
      });

    const titleLeftContainer = computerSkillsTitleSection.section({
      x: 0.066,
      y: 0.29,
      width: 0.901,
      height: 0.7,
    });

    const titleRightContainer = otherSkillsTitleSection.section({
      x: 0.099,
      y: 0.53,
      width: 0.833,
      height: 0.45,
    });

    const bodyLeftContainer = computerSkillsSection.section({
      x: 0.066,
      y: 0.066,
      width: 0.9,
      height: 0.901,
    });

    const bodyRightContainer = otherSkillsSection.section({
      x: 0.099,
      y: 0.066,
      width: 0.833,
      height: 0.901,
    });

    titleLeftContainer.text(PdfTemplate.labels.computerSkills[this.lang], {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.title,
    });

    titleRightContainer.text(PdfTemplate.labels.otherSkills[this.lang], {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.subtitle,
    });

    const computerSkills = `${data.skills.programming.technology} ${data.skills.media.technology} `;
    const otherSkills = `${data.skills.misc.technology}`;

    bodyLeftContainer.text(computerSkills, {
      color: PdfTemplate.colors.grayNight,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });

    bodyRightContainer.text(otherSkills, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });
  }

  private buildHobbies(data: CVDataType, container: PdfSection) {
    const titleSection = container.section({
      x: 0.0,
      y: 0.0,
      width: 1,
      height: 0.33,
    });
    const bodySection = container.section({
      x: 0.0,
      y: 0.33,
      width: 1,
      height: 0.67,
    });
    const { left: computerSkillsTitleSection, right: otherSkillsTitleSection } =
      this.build2Col(titleSection, {
        colorLeft: PdfTemplate.colors.grayDark,
        colorRight: PdfTemplate.colors.grayDark,
      });
    const { left: computerSkillsSection, right: otherSkillsSection } =
      this.build2Col(bodySection, {
        colorLeft: PdfTemplate.colors.grayNight,
        colorRight: PdfTemplate.colors.orange,
        withArrow: true,
      });

    const titleLeftContainer = computerSkillsTitleSection.section({
      x: 0.066,
      y: 0.3,
      width: 0.901,
      height: 0.7,
    });

    const titleRightContainer = otherSkillsTitleSection.section({
      x: 0.099,
      y: 0.3,
      width: 0.833,
      height: 0.7,
    });

    const bodyLeftContainer = computerSkillsSection.section({
      x: 0.066,
      width: 0.9,
      y: 0.211,
      height: 0.733,
    });

    const bodyRightContainer = otherSkillsSection.section({
      x: 0.099,
      width: 0.833,
      y: 0.211,
      height: 0.733,
    });

    titleLeftContainer.text(PdfTemplate.labels.hobbies[this.lang], {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.subtitle,
    });

    titleRightContainer.text(PdfTemplate.labels.languages[this.lang], {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica-Bold",
      fontSize: PdfTemplate.fontSizes.subtitle,
    });

    const hobbies = `${data.skills.hobbies.technology} `;
    const languages = `${data.skills.languages.technology}`;

    bodyLeftContainer.text(hobbies, {
      color: PdfTemplate.colors.grayDay,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });

    bodyRightContainer.text(languages, {
      color: PdfTemplate.colors.grayNight,
      font: "Helvetica",
      fontSize: PdfTemplate.fontSizes.body,
    });
  }

  async resume(data: CVDataType) {
    const bodySection = this.buildTopBar(data);
    const aboutMeSection = bodySection.section({
      x: 0.0,
      y: 0.0,
      width: 1,
      height: 0.3,
    });

    const eduprivateSection = bodySection.section({
      x: 0.0,
      y: 0.3,
      width: 1,
      height: 0.09,
    });
    const previousWorkSection = bodySection.section({
      x: 0.0,
      y: 0.39,
      width: 1,
      height: 0.4,
    });

    const skillsSection = bodySection.section({
      x: 0.0,
      y: 0.75,
      width: 1,
      height: 0.15,
    });

    const hobbiesSection = bodySection.section({
      x: 0.0,
      y: 0.9,
      width: 1,
      height: 0.1,
    });

    this.buildAboutMe(data, aboutMeSection);
    const { left: educationSection, right: personalSection } = this.build2Col(
      eduprivateSection,
      {
        withArrow: true,
        colorLeft: PdfTemplate.colors.orange,
        colorRight: PdfTemplate.colors.grayNight,
      },
    );
    this.buildEducation(data, educationSection);
    this.buildPersonal(data, personalSection);
    this.buildPreviousWork(data, previousWorkSection);
    this.buildSkills(data, skillsSection);
    this.buildHobbies(data, hobbiesSection);

    return await this.pdf.end();
  }
}
