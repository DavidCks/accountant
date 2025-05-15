import Link from "next/link";

const ACCHeader = () => {
  return (
    <section className="w-full px-8 text-gray-500">
      <div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
        <div className="relative flex flex-col md:flex-row">
          <Link
            href="/"
            className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0"
          >
            <span className="flex items-center mx-auto text-xl font-black leading-none text-gray-900 select-none">
              <img
                className="dark:invert"
                src="/accountant-logo.png"
                alt="accountant logo"
              />
            </span>
          </Link>
          <nav className="flex flex-wrap items-center mb-5 text-base md:mb-0 md:pl-8 md:ml-8 md:border-l md:border-gray-200">
            <Link
              href="/"
              className="mr-5 font-medium leading-6 text-gray-600 dark:hover:text-gray-100"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="mr-5 font-medium leading-6 text-gray-600 dark:hover:text-gray-100"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="mr-5 font-medium leading-6 text-gray-600 dark:hover:text-gray-100"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="mr-5 font-medium leading-6 text-gray-600 dark:hover:text-gray-100"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="inline-flex items-center ml-5 space-x-6 lg:justify-end">
          <Link
            href="/login"
            className="text-base font-medium leading-6 text-gray-600 whitespace-no-wrap transition duration-150 ease-in-out dark:hover:text-gray-100"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ACCHeader;
