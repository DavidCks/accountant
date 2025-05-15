import Link from "next/link";

const ACCWhatIsSandai = () => {
  return (
    <section className="px-2 py-2 md:px-0">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl px-8 py-12 mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          <span className="block ">What is Sandai?</span>
        </h2>
        <p className="mt-4 mb-12 text-xl text-gray-500 dark:text-gray-500">
          Sandai builds lots of free and open source apps and libraries that
          make the world a better place.
        </p>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-300 text-start">
          We&apos;re a small team of developers who are passionate about
          building tools that help people. We believe that technology should be
          accessible to everyone, and that&apos;s why we build open source
          software. We love building software that makes a difference in
          people&apos;s lives, and we hope you enjoy using our products as much
          as we enjoy building them.
          <br />
          <br />
          We are currently working on a few projects, including{" "}
          <Link
            href="https://sandai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            sandai.org
          </Link>
          ,{" "}
          <Link
            href="https://accountant.sandai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            accountant.sandai.org
          </Link>
          , and our{" "}
          <Link
            href="https://gitlab.com/users/DavidCks1/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            open source libraries
          </Link>
          , but you probably know us for our{" "}
          <Link
            href="https://sandai.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-700"
          >
            state of the art 3D AI Characters
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default ACCWhatIsSandai;
