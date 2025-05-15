import Link from "next/link";

const ACCWhatIsAccoutant = () => {
  return (
    <section className="px-2 py-2 md:px-0">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl px-8 py-12 mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          <span className="block ">What is Accountant?</span>
        </h2>
        <p className="mt-4 mb-12 text-xl text-gray-500 dark:text-gray-500">
          Accountant is a simple budgeting tool that helps you organize your
          spending.
        </p>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-300 text-start">
          It&apos;s the perfect tool for anyone who wants to get their finances
          in order without all the bells and whistles of other budgeting tools.
          Like other sandai products, Accountant is open source and free to use.
          You can self-host it if you want, or you can use the hosted version at{" "}
          <Link
            href="https://accountant.sandai.org"
            className="text-indigo-600 hover:text-indigo-700"
          >
            accountant.sandai.org
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ACCWhatIsAccoutant;
